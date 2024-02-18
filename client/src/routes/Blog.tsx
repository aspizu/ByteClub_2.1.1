import {CardContent} from "@mui/material"
import {Avatar, Card, CardFooter, CircularProgress, Divider} from "@nextui-org/react"
import {Link, useParams} from "react-router-dom"
import * as api from "~/api"
import {Navbar} from "~/components/Navbar"
import {useMethod} from "~/reproca"

function BlogContent({
    blog: {
        id,
        title,
        content,
        created_at,
        author_username,
        author_name,
        author_picture,
    },
}: {
    blog: api.Blog
}) {
    return (
        <Card>
            <CardContent>
                <p className="font-bold text-xl mb-2">{title}</p>
                <p>{content}</p>
            </CardContent>
            <Divider />
            <CardFooter className="gap-3">
                <Avatar
                    as="a"
                    href={`/user/${author_username}`}
                    name={author_username}
                    src={author_picture || undefined}
                />
                <div className="flex flex-col justify-center">
                    <Link to={`/user/${author_username}`} className="font-bold">
                        {author_name}
                    </Link>
                    <p className="text-gray-500 text-sm">@{author_username}</p>
                </div>
            </CardFooter>
        </Card>
    )
}

export function Blog() {
    const {id} = useParams()
    const blog_id = parseInt(id!)
    const [blog, fetchBlog] = useMethod(() => api.get_blog(blog_id), [])
    return (
        <div>
            <Navbar />
            <div className="flex flex-col h-full w-[95vw] max-w-[1024px] mx-auto p-4 gap-5">
                {blog?.ok ? (
                    <BlogContent blog={blog.ok} />
                ) : (
                    <CircularProgress className="m-auto" />
                )}
            </div>
        </div>
    )
}
