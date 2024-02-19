import {CardContent, CircularProgress} from "@mui/material"
import {Avatar, Card, Input} from "@nextui-org/react"
import {useSignal} from "@preact/signals-react"
import {Link} from "react-router-dom"
import * as api from "~/api"
import {Navbar} from "~/components/Navbar"
import {useMethod} from "~/reproca"

export function Explore() {
    const query = useSignal("")
    const [results] = useMethod(() => api.search_all(query.value), [query.value])
    const debounce = useSignal<number | null>(null)
    query.subscribe((v) => {
        console.log(v)
    })
    return (
        <div>
            <Navbar />
            <div className="flex flex-col h-full w-[95vw] max-w-[1024px] mx-auto p-4 gap-5">
                <Input
                    label="Search for entrepreneurs, mentors and startups..."
                    onValueChange={(value) => {
                        if (debounce.value) {
                            clearTimeout(debounce.value)
                            debounce.value = null
                        }
                        debounce.value = setTimeout(() => {
                            query.value = value
                            debounce.value = null
                        }, 500)
                    }}
                    endContent={
                        <span className="my-auto mr-1 material-symbols-rounded select-none">
                            search
                        </span>
                    }
                />
                {debounce.value !== null && <CircularProgress className="m-auto" />}
                {results?.ok && results.ok.length > 0 && (
                    <div
                        className="grid gap-4"
                        style={{
                            gridTemplateColumns:
                                "repeat(auto-fill, minmax(min(10rem, 100%), 1fr))",
                        }}
                    >
                        {results.ok.map((result, i) => (
                            <Card key={i}>
                                {result.type === "user" ? (
                                    <CardContent className="flex flex-col items-center justify-center gap-3">
                                        <Avatar />
                                        <Link
                                            to={`/user/${result.name}`}
                                            className="font-bold"
                                        >
                                            {result.name}
                                        </Link>
                                    </CardContent>
                                ) : result.type === "blog" ? (
                                    <CardContent className="flex flex-col items-center justify-center gap-3">
                                        <Avatar
                                            icon={
                                                <span className="material-symbols-rounded">
                                                    book
                                                </span>
                                            }
                                        />
                                        <Link
                                            to={`/blog/${result.id}`}
                                            className="font-bold"
                                        >
                                            {result.name}
                                        </Link>
                                    </CardContent>
                                ) : (
                                    <CardContent className="flex flex-col items-center justify-center gap-3">
                                        <Avatar
                                            icon={
                                                <span className="material-symbols-rounded">
                                                    corporate_fare
                                                </span>
                                            }
                                        />
                                        <Link
                                            to={`/startup/${result.id}`}
                                            className="font-bold"
                                        >
                                            {result.name}
                                        </Link>
                                    </CardContent>
                                )}
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
