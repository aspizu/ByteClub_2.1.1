import {CardContent} from "@mui/material"
import {
    Avatar,
    Card,
    CardFooter,
    CardHeader,
    CircularProgress,
    Divider,
    Link,
} from "@nextui-org/react"
import timeago from "epoch-timeago"
import {useParams} from "react-router-dom"
import * as api from "~/api"
import {Navbar} from "~/components/Navbar"
import {useMethod} from "~/reproca"
import {PageNotFound} from "./PageNotFound"

function StartupPage({
    startup: {
        id,
        name,
        description,
        mission_statement,
        offering,
        picture,
        created_at,
        followers,
        founders,
    },
}: {
    startup: api.Startup
}) {
    return (
        <>
            <Card>
                <CardHeader className="gap-3">
                    <p className="text-xl font-bold">{name}</p>
                    <p className="text-sm text-gray-400">{mission_statement}</p>
                </CardHeader>
                <Divider />
                <CardContent className="flex flex-col gap-2">
                    <p className="font-bold">Description</p>
                    <p>{description}</p>
                    <p className="font-bold">Offerings</p>
                    <p>{offering}</p>
                    <p className="text-gray-400 text-sm">
                        Founded {timeago(created_at * 1000)}
                    </p>
                </CardContent>
            </Card>
            <p className="font-bold">Founders</p>
            <div className="flex gap-5">
                {founders.map((founder) => (
                    <Card key={founder.username}>
                        <CardContent className="flex flex-col items-center gap-2">
                            <Avatar
                                size="lg"
                                src={founder.picture || undefined}
                                name={founder.name}
                            />
                            <div className="flex flex-col items-center">
                                <p className="font-bold">{founder.name}</p>
                                <Link href={`/user/${founder.username}`} size="sm">
                                    @{founder.username}
                                </Link>
                            </div>
                        </CardContent>
                        <Divider />
                        <CardFooter>
                            <p className="text-sm text-gray-500">
                                Joined {timeago(founder.created_at * 1000)}
                            </p>
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </>
    )
}

export function Startup() {
    const {id} = useParams()
    const startup_id = parseInt(id!)
    const [startup, fetchStartup] = useMethod(() => api.get_startup(startup_id), [])
    if (startup?.ok === null) {
        return <PageNotFound />
    }
    return (
        <div className="flex flex-col h-full">
            <Navbar />
            <div className="flex flex-col h-full w-[95vw] max-w-[1024px] mx-auto p-4 gap-5">
                {startup?.ok != null ? (
                    <StartupPage startup={startup.ok} />
                ) : (
                    <CircularProgress className="m-auto" />
                )}
            </div>
        </div>
    )
}
