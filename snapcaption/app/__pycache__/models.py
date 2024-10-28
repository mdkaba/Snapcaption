from pydantic import BaseModel
from typing import Optional

# Users model
class Users(BaseModel):
    id: str
    username: str
    email: str
    upload_image: bool
    view_caption: bool

# SnapCaptionAPI model
class SnapCaptionAPI(BaseModel):
    api_version: str
    upload_image: bool
    get_caption: bool
    process_image: bool
    user_id: str
    id: str

# ImageProcessor model
class ImageProcessor(BaseModel):
    id: str
    azure_vision_key: str
    azure_endpoint: str
    generate_caption: bool

# BlobStorage model
class BlobStorage(BaseModel):
    id: str
    container_name: str
    storage_account_url: str
    store_image: bool
    retrieve_image_url: bool

# Caption model
class Caption(BaseModel):
    id: str
    text: str
    confidence: float

# Database model
class Database(BaseModel):
    id: str
    database_id: str
    container_id: str
    save_metadata: bool
    get_metadata: bool
