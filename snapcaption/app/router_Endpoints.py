from fastapi import APIRouter, HTTPException, UploadFile, File

router = APIRouter()


@router.get("/")
async def read_root():
    return {"message": "Welcome to SnapCaption!"}

@router.post("/upload_image")
async def upload_image(image: UploadFile = File(...)):
    # Process the uploaded image
    return {"filename": image.filename}

@router.get("/get_caption")
async def get_caption(image_id: str):
    # Generate a caption for the image
    return {"caption": "A caption for the image with id " + image_id}
