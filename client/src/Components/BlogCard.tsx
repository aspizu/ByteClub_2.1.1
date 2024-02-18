import {Card, CardHeader, CardBody, Image} from "@nextui-org/react";



function BlogCard(image: any, sender: string, caption: string) {
  return (
    <Card className="py-4">
      <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
      <Image
          alt="Card background"
          className="object-cover rounded-xl"
          src= {image || "https://images.unsplash.com/photo-1444418776041-9c7e33cc5a9c?w=164&h=164&fit=crop&auto=format&dpr=2"}
          width={270}
        />
      </CardHeader>
      <CardBody className="overflow-visible py-2">
        <p className="text-tiny uppercase font-bold">{sender}</p>
        <small className="text-default-500">{caption}</small>
        
        
      </CardBody>
    </Card>
  )
}

export default BlogCard