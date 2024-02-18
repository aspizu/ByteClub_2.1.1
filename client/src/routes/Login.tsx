import {Button, Card, CardBody, Input, Link} from "@nextui-org/react"
import {Link as LinkTo} from "react-router-dom"

export function Login() {
    return (
        <div className="flex flex-col items-center justify-center h-full">
            <Card>
                <CardBody className="gap-4 p-8">
                    <span className="font-bold text-xl">Login to your account</span>
                    <Input type="text" label="Username" />
                    <Input type="password" label="Password" />
                    <Button color="primary" variant="shadow">
                        Login
                    </Button>
                    <div className="flex gap-2">
                        <span className="text-gray-500">Don't have an account?</span>
                        <LinkTo to="/register">
                            <Link>Sign up</Link>
                        </LinkTo>
                    </div>
                </CardBody>
            </Card>
        </div>
    )
}
