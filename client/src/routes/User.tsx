import {Avatar, Card, CardBody, CircularProgress} from "@nextui-org/react"
import {useParams} from "react-router-dom"
import * as api from "~/api"
import {Navbar} from "~/components/Navbar"
import {useMethod} from "~/reproca"

function UserContent({
    user: {username, id, bio, created_at},
}: {
    user: api.UserDetails & {username: string}
}) {
    return (
        <Card>
            <CardBody>
                <Avatar name={username} size="lg" />
                <p>{username}</p>
                <p>{id}</p>
                <p>{bio}</p>
                <p>{created_at}</p>
            </CardBody>
        </Card>
    )
}

export function User() {
    const {username} = useParams()
    const [user] = useMethod(() => api.get_user(username!), [])
    return (
        <div className="flex flex-col h-full">
            <Navbar />
            <div className="flex flex-col h-full w-[95vw] max-w-[1024px] mx-auto p-4">
                {user?.ok ? (
                    <UserContent user={{...user.ok, username: username!}} />
                ) : (
                    <CircularProgress className="m-auto" />
                )}
            </div>
        </div>
    )
}
