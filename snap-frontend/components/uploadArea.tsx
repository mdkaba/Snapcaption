"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { FileUpload } from "@/components/ui/file-upload";
import { useState } from "react";

export function UploadArea() {
  const [files, setFiles] = useState<File[]>([]);
  const handleFileUpload = (files: File[]) => {
    setFiles(files);
    console.log(files);
  };
  return (
    <Tabs
      defaultValue="upload"
      className="w-full flex flex-col items-center gap-5"
    >
      <TabsList className="grid w-2/3 grid-cols-2 bg-zinc-100">
        <TabsTrigger value="upload">Upload File</TabsTrigger>
        <TabsTrigger value="take">Take a Picture</TabsTrigger>
      </TabsList>
      <TabsContent
        value="upload"
        className="w-full flex flex-col gap-5 items-center"
      >
        <Card className="bg-transparent flex flex-col w-full items-center border-dashed border-2 border-zinc-400">
          <CardContent className="w-full">
            <FileUpload onChange={handleFileUpload} />
          </CardContent>
        </Card>
        <Button className="sm:w-1/4 w-1/2">Get Captions</Button>
      </TabsContent>
      <TabsContent value="take" className="w-full">
        <Card className="bg-transparent">
          <CardHeader>
            <CardTitle>Take Picture</CardTitle>
            {/* <CardDescription>
              Make changes to your account here. Click save when you're done.
            </CardDescription> */}
          </CardHeader>
          <CardContent className="space-y-2"></CardContent>
          <CardFooter className="mb-10">
            <Button>Get Captions</Button>
          </CardFooter>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
