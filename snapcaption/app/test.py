import requests, os, json
from dotenv import load_dotenv

load_dotenv()

# Replace with your own details
subscription_key = os.getenv("COMPUTER_VISION_KEY")
endpoint = (
    os.getenv("COMPUTER_VISION_CONNECTION_STRING")
    + "computervision/imageanalysis:analyze?api-version=2023-04-01-preview"
)
image_url = "https://snapcstorage.blob.core.windows.net/snap-images/1b8e2c54-c4e2-4cd7-94f0-d22fef998997"  # Replace with your Blob image URL

# Define headers and parameters for the request
headers = {
    "Ocp-Apim-Subscription-Key": subscription_key,
    "Content-Type": "application/json",
}
params = {"features": "caption,objects,denseCaptions", "language": "en"}
data = {"url": image_url}


def analyze_image(image_url):
    """
    Function to analyze image using Azure Computer Vision v4.0
    """
    try:
        # Make a request to the analyze endpoint
        response = requests.post(endpoint, headers=headers, params=params, json=data)
        response.raise_for_status()
        return response.json()
    except requests.exceptions.RequestException as e:
        print(f"Error during analysis: {e}")
        return None


# Perform analysis and handle response
analysis_result = analyze_image(image_url)

print(json.dumps(analysis_result, indent=3))  # Display full response for debugging

# Extract and print dense captions
if analysis_result and "denseCaptionsResult" in analysis_result:
    print("Dense Captions:")
    for caption_data in analysis_result["denseCaptionsResult"]["values"]:
        caption_text = caption_data["text"]
        confidence = caption_data["confidence"]
        bounding_box = caption_data["boundingBox"]
        print(
            f"Caption: {caption_text} (Confidence: {confidence:.2f}) - Location: {bounding_box}"
        )

# Extract and print objects (dense captions)
if analysis_result and "objects" in analysis_result:
    print("\nDetailed Descriptions (Dense Captions):")
    for obj in analysis_result["objects"]:
        obj_name = obj["name"]
        confidence = obj["confidence"]
        rect = obj["boundingBox"]
        print(f"Object: {obj_name} (Confidence: {confidence:.2f}) - Location: {rect}")
else:
    print("No objects detected.")
