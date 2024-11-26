from fastapi import APIRouter, HTTPException, UploadFile, File, Body
from fastapi.responses import JSONResponse
from azure.storage.blob import BlobServiceClient, ContentSettings
import uuid
from dotenv import load_dotenv
import os, requests, logging
from azure.cosmos import CosmosClient, exceptions

load_dotenv()

router = APIRouter()

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize the BlobServiceClient with connection string
connection_string = os.getenv("BLOB_STORAGE_CONNECTION_STRING")
blob_service_client = BlobServiceClient.from_connection_string(connection_string)
container_name = os.getenv("BLOB_CONTAINER")

# Initialize the Computer Vision API client
cv_key = os.getenv("COMPUTER_VISION_KEY")
cv_endpoint = (
    os.getenv("COMPUTER_VISION_CONNECTION_STRING")
    + "computervision/imageanalysis:analyze?api-version=2023-04-01-preview"
)

# Initialize Azure OpenAI client
openai_key = os.getenv("OPENAI_KEY")
openai_endpoint = os.getenv("OPENAI_CONNECTION_STRING")

# Initialize Cosmos DB Client
cosmos_db_connection_string = os.getenv("COSMOS_CONNECTION_STRING")
cosmos_db_database = os.getenv("COSMOS_DATABASE")
cosmos_db_container = os.getenv("COSMOS_COLLECTION")

if not cosmos_db_connection_string:
    raise ValueError("COSMOS_DB_CONNECTION_STRING is not set. Check your .env file.")

logging.info(f"Using database: {cosmos_db_database}, container: {cosmos_db_container}")

try:
    cosmos_client = CosmosClient.from_connection_string(cosmos_db_connection_string)
    database = cosmos_client.get_database_client(cosmos_db_database)
    container = database.get_container_client(cosmos_db_container)
except Exception as e:
    logger.error(f"Error connecting to Cosmos DB: {e}")
    raise HTTPException(
        status_code=500, detail=f"Failed to connect to Cosmos DB: {str(e)}"
    )


@router.get("/")
async def read_root():
    return {"message": "Welcome to SnapCaption!"}


@router.post("/upload_image")
async def upload_image(image: UploadFile = File(...)):
    image_id = str(uuid.uuid4())
    try:
        blob_client = blob_service_client.get_blob_client(
            container=container_name, blob=image_id
        )
        image_data = await image.read()
        blob_client.upload_blob(
            image_data,
            overwrite=True,
            content_settings=ContentSettings(image.content_type),
        )
        image_url = blob_client.url
        return {
            "image_id": image_id,
            "image_url": image_url,
            "filename": image.filename,
            "message": "Image uploaded successfully",
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to upload image: {str(e)}")


@router.get("/get_caption")
async def get_caption(image_url: str):
    headers = {"Ocp-Apim-Subscription-Key": cv_key, "Content-Type": "application/json"}
    params = {"features": "denseCaptions", "language": "en"}
    data = {"url": image_url}
    try:
        response = requests.post(cv_endpoint, headers=headers, params=params, json=data)
        response.raise_for_status()
        result = response.json()
        if "denseCaptionsResult" in result:
            return result
        else:
            return JSONResponse(
                content={"caption": "No description available for the image."},
                status_code=404,
            )
    except requests.exceptions.RequestException as e:
        raise HTTPException(status_code=500, detail=f"Error generating caption: {e}")


@router.post("/generate_caption")
async def generate_caption(captions: list[str]):
    if (
        not captions
        or not isinstance(captions, list)
        or not all(isinstance(c, str) for c in captions)
    ):
        raise HTTPException(
            status_code=400, detail="Invalid input: must provide a list of strings."
        )
    bullet_points = "\n".join(f"{caption}" for caption in captions)
    prompt = f"The following captions were generated by a vision model:\n{bullet_points}\n\nProvide a more detailed and descriptive caption for the image caption overall:"
    url = f"{openai_endpoint}"
    headers = {
        "Content-Type": "application/json",
        "api-key": openai_key,
    }
    payload = {
        "messages": [
            {
                "role": "system",
                "content": "You are an assistant that refines image captions.",
            },
            {"role": "user", "content": prompt},
        ],
        "temperature": 0.2,
        "top_p": 0.5,
        "max_tokens": 200,
    }
    try:
        response = requests.post(url, headers=headers, json=payload)
        response.raise_for_status()
        result = response.json()
        if "choices" in result and len(result["choices"]) > 0:
            refined_caption = result["choices"][0]["message"]["content"].strip()
            return {"refined_caption": refined_caption}
        else:
            raise HTTPException(
                status_code=500,
                detail="Azure OpenAI API error: Missing 'choices' in response.",
            )
    except requests.exceptions.RequestException as e:
        raise HTTPException(status_code=500, detail=f"Azure OpenAI API error: {str(e)}")


@router.post("/store_caption")
async def store_caption(payload: dict = Body(...)):
    """
    Endpoint to store refined captions in Azure Cosmos DB.
    Expects a JSON payload with a `refined_caption` field.
    """
    # Validate payload
    refined_caption = payload.get("refined_caption")
    if not refined_caption or not isinstance(refined_caption, str):
        raise HTTPException(
            status_code=400, detail="`refined_caption` must be a non-empty string."
        )

    # Process the caption into sentences
    sentences = [
        sentence.strip() for sentence in refined_caption.split(".") if sentence.strip()
    ]

    # Prepare the document for Cosmos DB
    try:
        document = {
            "id": str(uuid.uuid4()),  # Unique ID for the document
            "refined_caption": refined_caption,
            "sentences": sentences,  # Store sentences as a list
        }
        container.create_item(body=document)
        return {"message": "Caption stored successfully.", "id": document["id"]}
    except exceptions.CosmosHttpResponseError as e:
        raise HTTPException(
            status_code=500, detail=f"Failed to store caption: {str(e)}"
        )


@router.get("/get_stored_caption")
async def get_captions():
    """
    Endpoint to retrieve stored captions from Azure Cosmos DB.
    Returns all stored captions with their IDs, refined captions, and sentences.
    """
    try:
        # Query to fetch all documents from the container
        query = "SELECT c.id, c.refined_caption, c.sentences FROM c"
        items = list(
            container.query_items(query=query, enable_cross_partition_query=True)
        )

        # Check if items exist
        if not items:
            return {"message": "No captions found.", "captions": []}

        # Format the retrieved items for the response
        formatted_items = [
            {
                "id": item["id"],
                "refined_caption": item.get("refined_caption", ""),
                "sentences": item.get("sentences", []),
            }
            for item in items
        ]
        return {"captions": formatted_items}

    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Failed to retrieve captions: {str(e)}"
        )
