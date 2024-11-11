import requests, os
from dotenv import load_dotenv

load_dotenv()

# Replace with your own details
subscription_key = os.getenv("COMPUTER_VISION_KEY")
endpoint = os.getenv("COMPUTER_VISION_CONNECTION_STRING") + "/vision/v3.2"
image_url = "https://snapcstorage.blob.core.windows.net/snap-images/ce5c53c0-5d8d-4e66-a913-b6e4c890e879"  # Replace with your Blob image URL

# Define headers and parameters for the request
headers = {
    "Ocp-Apim-Subscription-Key": subscription_key,
    "Content-Type": "application/json",
}
params = {
    "visualFeatures": "Description"  # This tells the API to return a description (caption)
}
data = {"url": image_url}


# Function to detect objects
def detect_objects(image_url):
    detect_endpoint = f"{endpoint}/detect"
    data = {"url": image_url}
    response = requests.post(detect_endpoint, headers=headers, json=data)
    response.raise_for_status()
    return response.json()


# Function to describe the image
def describe_image(image_url):
    describe_endpoint = f"{endpoint}/describe"
    params = {"maxCandidates": 1}
    data = {"url": image_url}
    response = requests.post(
        describe_endpoint, headers=headers, params=params, json=data
    )
    response.raise_for_status()
    return response.json()


# Analyze the image for objects and descriptions
objects_result = detect_objects(image_url)
description_result = describe_image(image_url)

# Print general description
if (
    "description" in description_result
    and "captions" in description_result["description"]
):
    general_caption = description_result["description"]["captions"][0]["text"]
    print(f"General Description: {general_caption}")

# Print dense captions based on detected objects
if "objects" in objects_result:
    print("\nDetailed Descriptions (Dense Captions):")
    for obj in objects_result["objects"]:
        obj_name = obj["object"]
        confidence = obj["confidence"]
        rect = obj["rectangle"]
        print(f"Object: {obj_name} (Confidence: {confidence:.2f}) - Location: {rect}")
else:
    print("No objects detected.")
