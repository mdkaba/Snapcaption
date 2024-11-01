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

export function UploadArea() {
  return (
    <Tabs defaultValue="upload " className="w-[400px]">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="upload">Account</TabsTrigger>
        <TabsTrigger value="take">Password</TabsTrigger>
      </TabsList>
      <TabsContent value="upload">
        <Card className="bg-transparent">
          <CardHeader>
            <CardTitle>Upload File</CardTitle>
            {/* <CardDescription>
              Make changes to your account here. Click save when you're done.
            </CardDescription> */}
          </CardHeader>
          <CardContent className="space-y-2"></CardContent>
          <CardFooter>
            <Button>Get Captions</Button>
          </CardFooter>
        </Card>
      </TabsContent>
      <TabsContent value="take">
        <Card className="bg-transparent">
          <CardHeader>
            <CardTitle>Take Picture</CardTitle>
            {/* <CardDescription>
              Make changes to your account here. Click save when you're done.
            </CardDescription> */}
          </CardHeader>
          <CardContent className="space-y-2"></CardContent>
          <CardFooter>
            <Button>Get Captions</Button>
          </CardFooter>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
