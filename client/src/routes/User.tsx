import {
    Avatar,
    Button,
    Card,
    CardBody,
    CardHeader,
    CircularProgress,
    Divider,
    Link,
} from "@nextui-org/react"
import timeago from "epoch-timeago"
import toast from "react-hot-toast"
import {useParams} from "react-router-dom"
import * as api from "~/api"
import {Navbar} from "~/components/Navbar"
import {session} from "~/globalState"
import {useMethod} from "~/reproca"

function formatFollowersString(followers: [string, string][]) {
    if (followers.length === 0) {
        return "No followers"
    }
    const [_, firstName] = followers[0]
    const restCount = followers.length - 1
    if (restCount === 0) {
        return `Followed by ${firstName}`
    } else {
        const restString = restCount === 1 ? "other" : "others"
        return `Followed by ${firstName}, ${followers
            .slice(1, 3)
            .map(([username]) => username)
            .join(", ")} and ${restCount} ${restString}`
    }
}

function UserContent({
    user: {
        username,
        id,
        name,
        link,
        email,
        bio,
        experience,
        picture,
        is_mentor,
        mentor_available,
        mentor_expertise,
        created_at,
        followers,
        following,
    },
    fetchUser,
}: {
    user: api.GetUser & {username: string}
    fetchUser: () => void
}) {
    const isFollowing =
        !!session.value &&
        followers.map(([username, _]) => username).includes(session.value.username)
    async function followUser() {
        if (isFollowing) {
            toast(`You are no longer following ${name}`)
            await api.unfollow_user(id)
        } else {
            toast(`You are now following ${name}`)
            await api.follow_user(id)
        }
        setTimeout(() => {
            fetchUser()
        }, 200)
    }
    return (
        <Card>
            <CardHeader className="gap-3">
                <Avatar name={username} size="lg" />
                <div className="flex flex-col justify-center">
                    <p className="font-bold text-lg">{name}</p>
                    <p className="text-gray-500">@{username}</p>
                </div>
                <div className="flex flex-col items-center ml-auto">
                    <p className="text-xl font-bold">{followers.length}</p>
                    <p className="text-gray-500 text-sm">Followers</p>
                </div>
                <div className="flex flex-col items-center">
                    <p className="text-xl font-bold">{following.length}</p>
                    <p className="text-gray-500 text-sm">Following</p>
                </div>
                {session.value && (
                    <Button
                        className="ml-4 mr-2"
                        color={isFollowing ? "secondary" : "primary"}
                        onClick={followUser}
                    >
                        {isFollowing ? "Unfollow" : "Follow"}
                    </Button>
                )}
            </CardHeader>
            <Divider />
            <CardBody className="gap-2">
                <p>{bio}</p>
                <p className="text-gray-400 text-sm">
                    Joined {timeago(created_at * 1000)}
                </p>
            </CardBody>
            <Divider />
            <CardBody>
                <p>{formatFollowersString(followers)}</p>
            </CardBody>
        </Card>
    )
}

function UserBlogs({
    username,
    userBlogs,
    fetchUserBlogs,
}: {
    username: string
    userBlogs: api.UserBlog[]
    fetchUserBlogs: () => void
}) {
    return (
        <div>
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
                        <p className="">{blog.content}</p>
                    </CardBody>
                </Card>
            ))}
        </div>
    )
}

export function User() {
    const {username} = useParams()
    const [user, fetchUser] = useMethod(() => api.get_user(username!), [])
    const [userBlogs, fetchUserBlogs] = useMethod(
        () => api.get_user_blogs(username!),
        []
    )
    return (
        <div className="flex flex-col h-full">
            <Navbar />
            <div className="flex flex-col h-full w-[95vw] max-w-[1024px] mx-auto p-4 gap-5">
                {user?.ok && userBlogs?.ok ? (
                    <>
                        <UserContent
                            user={{...user.ok, username: username!}}
                            fetchUser={fetchUser}
                        />
                        <p className="font-bold">Blogs</p>
                        <UserBlogs
                            username={username!}
                            userBlogs={userBlogs.ok}
                            fetchUserBlogs={fetchUserBlogs}
                        />
                    </>
                ) : (
                    <CircularProgress className="m-auto" />
                )}
            </div>
        </div>
    )
}
