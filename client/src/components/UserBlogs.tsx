import {Card, CardBody, CardHeader, Divider, Link} from "@nextui-org/react"
import timeago from "epoch-timeago"
import * as api from "~/api"

export function UserBlogs({
    username,
    userBlogs,
}: {
    username: string
    userBlogs: api.UserBlog[]
}) {
    return (
        <div className="flex flex-col gap-4">
            {userBlogs.map((blog) => (
                <Card key={blog.id}>
                    <CardHeader className="px-4">
                        <Link
                            className="font-bold text-lg"
                            color="foreground"
                            href={`/blog/${blog.id}`}
                        >
                            {blog.title}
                        </Link>
                        <p className="ml-auto text-gray-400 text-sm">
                            Posted {timeago(blog.created_at * 1000)}
                        </p>
                    </CardHeader>
                    <Divider />
                    <CardBody>
                        <p className="max-h-20 overflow-hidden">{blog.content}</p>
                    </CardBody>
                </Card>
            ))}
        </div>
    )
}
