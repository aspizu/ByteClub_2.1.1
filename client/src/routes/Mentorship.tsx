import {
    Card,
    CardBody,
    CardFooter,
    CardHeader,
    CircularProgress,
    Divider,
    Image,
    Navbar,
} from "@nextui-org/react"
import {Link} from "react-router-dom"
import * as api from "~/api"
import {useMethod} from "~/reproca"
import {PageNotFound} from "./PageNotFound"

export function Mentorship() {
    const [users, fetchUser] = useMethod(() => api.get_all_mentors(), [])

    if (users?.ok === null) {
        return <PageNotFound />
    }

    return (
        <div className="flex flex-col items-center h-full gap-3">
            <Navbar />
            <div className="flex flex-col items-center h-full w-full max-w-[1024px] mx-auto p-4 gap-5">
                <p className="text-3xl font-bold mb-4">Mentors</p>
                <div className="flex flex-col items-center w-full gap-3">
                    {users?.ok != null ? (
                        <>
                            {users?.ok.map((mentor, index) => (
                                <Card
                                    key={mentor.id}
                                    className="w-full max-w-[400px] overflow-hidden m-4"
                                >
                                    <CardHeader className="flex items-center gap-3">
                                        <Image
                                            alt="User profile"
                                            height={40}
                                            radius="sm"
                                            src={mentor.picture || ""}
                                            width={40}
                                        />
                                        <div className="flex flex-col">
                                            <p className="text-md">{mentor.name}</p>
                                            <div className="flex flex-row">
                                                <p className="text-small text-default-500">
                                                    Followers:{" "}
                                                    {`${mentor.followers.length}`}
                                                </p>
                                                <p className="text-small text-default-500">
                                                    Following:{" "}
                                                    {`${mentor.following.length}`}
                                                </p>
                                            </div>
                                        </div>
                                    </CardHeader>
                                    <Divider />
                                    <CardBody>
                                        <p>
                                            Availability:{" "}
                                            {mentor.mentor_available
                                                ? "Available"
                                                : "Not available"}
                                        </p>
                                    </CardBody>
                                    <Divider />
                                    <CardFooter>
                                        <Link to={`/user/${mentor}`}>
                                            {mentor.email}
                                        </Link>
                                    </CardFooter>
                                </Card>
                            ))}
                        </>
                    ) : (
                        <CircularProgress className="m-auto" />
                    )}
                </div>
            </div>
        </div>
    )
}
