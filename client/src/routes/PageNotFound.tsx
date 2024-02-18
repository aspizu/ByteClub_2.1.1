import {Button} from "@nextui-org/react"
import {Link} from "react-router-dom"

export function PageNotFound() {
    return (
        <div className="flex flex-col items-center justify-center h-full gap-4">
            <span className="text-[5rem] font-bold">404</span>
            <Link to="/">
                <Button color="primary" variant="shadow">
                    Go back to home
                </Button>
            </Link>
        </div>
    )
}
