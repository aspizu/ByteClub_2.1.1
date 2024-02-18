import {
    Avatar,
    Card,
    CardBody,
    CardHeader,
    CircularProgress,
    Divider,
    Link,
    Textarea,
} from "@nextui-org/react"
import timeago from "epoch-timeago"
import {Link as ClientLink} from "react-router-dom"
import * as api from "~/api"
import {Navbar} from "~/components/Navbar"
import {useMethod} from "~/reproca"
export function Root() {
    const [blogs, fetchBlogs] = useMethod(api.get_blogs, [])
    return (
        <div>
            <Navbar />
            <div className="flex flex-col h-full w-[95vw] max-w-[1024px] mx-auto p-4 gap-5">
                <ClientLink to="/write">
                    <Textarea
                        className="w-[40rem] mx-auto"
                        placeholder="Whats on your mind..."
                    />
                </ClientLink>
                {blogs?.ok ? (
                    <>
                        <p className="font-bold">Blogs</p>
                        {blogs.ok.map((blog) => (
                            <Card key={blog.id}>
                                <CardHeader className="px-4 gap-2">
                                    <Link
                                        className="font-bold text-lg"
                                        color="foreground"
                                        href={`/blog/${blog.id}`}
                                    >
                                        {blog.title}
                                    </Link>
                                    <p className="mr-auto text-gray-400 text-sm">
                                        By {blog.author_name}{" "}
                                        {timeago(blog.created_at * 1000)}
                                    </p>
                                    <Avatar
                                        as="a"
                                        href={`/user/${blog.author_username}`}
                                        src={blog.author_picture || undefined}
                                        name={blog.author_name}
                                    />
                                </CardHeader>
                                <Divider />
                                <CardBody>
                                    <p className="">{blog.content}</p>
                                </CardBody>
                            </Card>
                        ))}
                    </>
                ) : (
                    <CircularProgress className="m-auto" />
                )}
            </div>
        </div>
    )
}
