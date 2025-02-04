"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Camera, Download, RefreshCw, AlertCircle } from "lucide-react";
import Image from "next/image"; // Import the next/image component

export default function Component() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [image, setImage] = useState<string | null>(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const startCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        setCameraActive(true);
        setError(null);
      }
    } catch (err) {
      console.error("Error accessing the camera:", err);
      setError(
        "Unable to access the camera. Please make sure you've granted the necessary permissions."
      );
    }
  }, []);

  const stopCamera = useCallback(() => {
    const stream = videoRef.current?.srcObject as MediaStream;
    const tracks = stream?.getTracks();
    tracks?.forEach((track) => track.stop());
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setCameraActive(false);
  }, []);

  const captureImage = useCallback(() => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext("2d");
      if (context) {
        canvasRef.current.width = videoRef.current.videoWidth;
        canvasRef.current.height = videoRef.current.videoHeight;
        context.drawImage(
          videoRef.current,
          0,
          0,
          canvasRef.current.width,
          canvasRef.current.height
        );
        const imageDataUrl = canvasRef.current.toDataURL("image/jpeg");
        setImage(imageDataUrl);
        stopCamera();
      }
    }
  }, [stopCamera]);

  const resetCamera = useCallback(() => {
    setImage(null);
    startCamera();
  }, [startCamera]);

  const downloadImage = useCallback(() => {
    if (image) {
      const link = document.createElement("a");
      link.href = image;
      link.download = "captured-image.jpg";
      link.click();
    }
  }, [image]);

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, [stopCamera]);

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Camera Capture</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        {!cameraActive && !image && (
          <Button onClick={startCamera}>
            <Camera className="mr-2 h-4 w-4" />
            Start Camera
          </Button>
        )}
        {cameraActive && (
          <>
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-auto rounded-lg"
            />
            <Button onClick={captureImage}>
              <Camera className="mr-2 h-4 w-4" />
              Take Picture
            </Button>
          </>
        )}
        {image && (
          <div className="space-y-4 w-full">
            <Image
              src={image}
              alt="Captured"
              className="w-full h-auto rounded-lg"
              width={500}
              height={400}
              unoptimized // Add this to allow base64 inline images
            />
            <div className="flex justify-center space-x-4">
              <Button onClick={resetCamera}>
                <RefreshCw className="mr-2 h-4 w-4" />
                Retake
              </Button>
              <Button onClick={downloadImage}>
                <Download className="mr-2 h-4 w-4" />
                Download
              </Button>
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="justify-center">
        <canvas ref={canvasRef} style={{ display: "none" }} />
      </CardFooter>
    </Card>
  );
}
