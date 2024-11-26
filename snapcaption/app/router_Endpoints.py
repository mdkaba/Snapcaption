from fastapi import APIRouter, HTTPException, UploadFile, File
from fastapi.responses import JSONResponse
from azure.storage.blob import BlobServiceClient, ContentSettings
import uuid
from dotenv import load_dotenv
import os
import requests

load_dotenv()

router = APIRouter()

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


@router.get("/")
async def read_root():
    return {"message": "Welcome to SnapCaption!"}


@router.post("/upload_image")
async def upload_image(image: UploadFile = File(...)):
    # Generate a unique ID for the image
    image_id = str(uuid.uuid4())

    try:
        # Create a blob client using the unique ID as the name for the blob
        blob_client = blob_service_client.get_blob_client(
            container=container_name, blob=image_id
        )

        # Upload the image to blob storage
        image_data = await image.read()

        blob_client.upload_blob(
            image_data,
            overwrite=True,
            content_settings=ContentSettings(image.content_type),
        )

        # Generate a URL for the uploaded image
        image_url = blob_client.url
        print(f"Image uploaded. URL: {image_url}")

        return {
            "image_id": image_id,
            "image_url": image_url,
            "filename": image.filename,
            "message": "Image uploaded successfully",
        }
    except Exception as e:
        print(f"Error during image upload: {e}")  # Log the exact error
        raise HTTPException(status_code=500, detail=f"Failed to upload image: {str(e)}")


@router.get("/get_caption")
async def get_caption(image_url: str):
    """
    Generate a caption for the image using Azure Computer Vision.
    """
    # Define the request headers with the subscription key
    headers = {"Ocp-Apim-Subscription-Key": cv_key, "Content-Type": "application/json"}

    params = {"features": "denseCaptions", "language": "en"}

    # Define the data payload with the image URL
    data = {"url": image_url}

    try:
        # Make a request to the Computer Vision API
        response = requests.post(cv_endpoint, headers=headers, params=params, json=data)
        response.raise_for_status()  # Raise an error for non-200 responses
        result = response.json()

        # Extract the caption from the response
        if "denseCaptionsResult" in result:
            return result
        else:
            return JSONResponse(
                content={"caption": "No description available for the image."},
                status_code=404,
            )

    except requests.exceptions.RequestException as e:
        # Handle any request errors
        raise HTTPException(status_code=500, detail=f"Error generating caption: {e}")
