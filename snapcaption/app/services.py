from azure.cognitiveservices.vision.computervision import ComputerVisionClient
from msrest.authentication import CognitiveServicesCredentials
from azure.storage.blob import BlobServiceClient
import os
from fastapi import UploadFile
import aiofiles
from dotenv import load_dotenv

load_dotenv()

# Initialize the Azure clients with environment variables
cognitive_client = ComputerVisionClient(
    endpoint=os.getenv("COMPUTER_VISION_CONNECTION_STRING"),
    credentials=CognitiveServicesCredentials(os.getenv("COMPUTER_VISION_KEY")),
)

blob_service_client = BlobServiceClient.from_connection_string(
    os.getenv("BLOB_STORAGE_CONNECTION_STRING")
)


# Allow user to upload an image
async def upload_image_service(image: UploadFile):
    image_url = await store_image_in_blob(image)
    image_id = image.filename
    caption = await process_image_service(image_id)

    return {"image_url": image_url, "caption": caption}


# Process the image and return caption
async def process_image_service(image_id: str):
    blob_client = blob_service_client.get_blob_client(container="images", blob=image_id)
    image_stream = await blob_client.download_blob().readall()

    # Send to Azure Cognitive Services for caption generation
    response = cognitive_client.describe_image_in_stream(image_stream)
    caption = response.captions[0].text if response.captions else "No caption detected"

    return caption


# Store the uploaded image in Blob Storage
async def store_image_in_blob(image: UploadFile):
    blob_client = blob_service_client.get_blob_client(
        container="images", blob=image.filename
    )

    async with aiofiles.open(image.filename, "wb") as out_file:
        content = await image.read()  # Read file content
        await out_file.write(content)  # Write content to a temp file

    with open(image.filename, "rb") as data:
        blob_client.upload_blob(data)

    # change the return value to the image URL
    return f"https://snapcstorage.blob.core.windows.net/{os.getenv("BLOB_CONTAINER")}/{image.filename}"
