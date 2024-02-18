import {
    Avatar,
    Button,
    Card,
    CardBody,
    CardHeader,
    Chip,
    CircularProgress,
    Divider,
} from "@nextui-org/react"
import timeago from "epoch-timeago"
import toast from "react-hot-toast"
import {useParams} from "react-router-dom"
import * as api from "~/api"
import {Navbar} from "~/components/Navbar"
import {UserBlogs} from "~/components/UserBlogs"
import {session} from "~/globalState"
import {useMethod} from "~/reproca"
import {PageNotFound} from "./PageNotFound"

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
    const isDashboard = session.value?.username === username
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
                <Avatar name={username} src={picture || undefined} size="lg" />
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
                <div className="flex gap-2">
                    {link && (
                        <Chip className="" as="a" href={link} target="_none_">
                            {link.length > 25 ? link.slice(0, 25) + "..." : link}
                        </Chip>
                    )}
                    {email && <Chip>{email}</Chip>}
                </div>
                <div className="flex gap-4 items-center">
                    <p className="font-bold">Bio</p>
                    {isDashboard && (
                        <Button
                            className="material-symbols-rounded text-lg"
                            isIconOnly
                            size="sm"
                            variant="flat"
                        >
                            edit
                        </Button>
                    )}
                </div>
                <p>{bio}</p>
                {experience && (
                    <>
                        <p className="font-bold">Experience</p>
                        <p>{experience}</p>
                    </>
                )}
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

export function User() {
    const {username} = useParams()
    const [user, fetchUser] = useMethod(() => api.get_user(username!), [])
    const [userBlogs, fetchUserBlogs] = useMethod(
        () => api.get_user_blogs(username!),
        []
    )
    if (user?.ok === null) {
        return <PageNotFound />
    }
    return (
        <div className="flex flex-col h-full">
            <Navbar />
            <div className="flex flex-col h-full w-[95vw] max-w-[1024px] mx-auto p-4 gap-5">
                {user?.ok != null && userBlogs?.ok != null ? (
                    <>
                        <UserContent
                            user={{...user.ok, username: username!}}
                            fetchUser={fetchUser}
                        />
                        <p className="font-bold">Blogs</p>
                        <UserBlogs username={username!} userBlogs={userBlogs.ok} />
                    </>
                ) : (
                    <CircularProgress className="m-auto" />
                )}
            </div>
        </div>
    )
}
