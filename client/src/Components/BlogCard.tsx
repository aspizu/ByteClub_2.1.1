import {Card, CardBody, CardHeader, Divider} from "@nextui-org/react"

// id:number;title:string;content:string;author_username:string;author_name:string;author_picture
function BlogCard(props: {
    id?: number
    title: string
    content: string
    author_username: string
    author_name: string
    author_picture?: any
}) {
    return (
        <Card className="py-4">
            <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
                {props.title}
            </CardHeader>
            <Divider />
            <CardBody className="overflow-visible py-2">
                <p className="text-tiny uppercase font-bold">{props.author_name}</p>
            </CardBody>
        </Card>
    )
}

export default BlogCard
