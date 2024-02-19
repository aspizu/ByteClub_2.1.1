import {Button, Card, CardFooter, CardHeader, Divider} from "@nextui-org/react"
import * as api from "~/api"

function formatFounderNames(names: string[]): string {
    const totalCount = names.length
    if (totalCount === 1) {
        return `Founded by ${names[0]}`
    } else if (totalCount === 2) {
        return `Founded by ${names[0]} and ${names[1]}`
    } else if (totalCount === 3) {
        return `Founded by ${names[0]}, ${names[1]} and ${names[2]}`
    } else {
        const otherCount = totalCount - 2
        return `Founded by ${names[0]}, ${names[1]} and ${otherCount} others`
    }
}

export function Startup({startup}: {startup: api.Startup}) {
    return (
        <Card>
            <CardHeader className="gap-3">
                <p className="font-bold text-lg">{startup.name}</p>
                <p className="text-sm text-gray-400">{startup.mission_statement}</p>
            </CardHeader>
            <Divider />
            <CardFooter>
                <p className="text-gray-300 text-sm">
                    {formatFounderNames(
                        startup.founders.map((founder) => founder.name)
                    )}
                </p>
                <Button
                    as="a"
                    href={`/startup/${startup.id}`}
                    color="secondary"
                    size="sm"
                    className="ml-auto"
                    isIconOnly
                >
                    <span className="material-symbols-outlined">open_in_new</span>
                </Button>
            </CardFooter>
        </Card>
    )
}
