import {Button, Card, CardBody, Input, Link} from "@nextui-org/react"
import {useSignal} from "@preact/signals-react"
import * as api from "~/api"

export function Login() {
    const username = useSignal("")
    const password = useSignal("")
    const isVisible = useSignal(false)
    async function onLoginClick() {
        const response = await api.login(username.value, password.value)
        if (response.ok) {
            console.log("Logged in")
        } else {
            console.log("Error occured")
        }
    }
    return (
        <div className="flex flex-col items-center justify-center h-full">
            <Card>
                <CardBody className="gap-4 p-8 min-w-[20rem]">
                    <span className="font-bold text-xl">Login to your account</span>
                    <Input
                        variant="bordered"
                        type="text"
                        label="Username"
                        value={username.value}
                        onValueChange={(value) => (username.value = value)}
                    />
                    <Input
                        variant="bordered"
                        type={isVisible.value ? "text" : "password"}
                        label="Password"
                        value={password.value}
                        onValueChange={(value) => (password.value = value)}
                        endContent={
                            <Button
                                isIconOnly
                                radius="full"
                                size="sm"
                                variant="flat"
                                onClick={() => (isVisible.value = !isVisible.value)}
                            >
                                {isVisible.value ? (
                                    <span className="material-symbols-rounded">
                                        visibility
                                    </span>
                                ) : (
                                    <span className="material-symbols-rounded">
                                        visibility_off
                                    </span>
                                )}
                            </Button>
                        }
                    />
                    <Button color="primary" variant="shadow" onClick={onLoginClick}>
                        Login
                    </Button>
                    <div className="flex gap-2">
                        <span className="text-gray-500">Don't have an account?</span>
                        <Link href="/register">Sign up</Link>
                    </div>
                </CardBody>
            </Card>
        </div>
    )
}
