from fastapi import APIRouter, HTTPException, UploadFile, File
from azure.storage.blob import BlobServiceClient, ContentSettings
import uuid
from dotenv import load_dotenv
import os

load_dotenv()

router = APIRouter()

# Initialize the BlobServiceClient with connection string
connection_string = os.getenv("BLOB_STORAGE_CONNECTION_STRING")
blob_service_client = BlobServiceClient.from_connection_string(connection_string)
container_name = os.getenv("BLOB_CONTAINER")


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
async def get_caption(image_id: str):
    # Generate a caption for the image (implementation not provided)
    return {"caption": f"A caption for the image with id {image_id}"}
