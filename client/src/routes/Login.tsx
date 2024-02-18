import {Button, Card, CardBody, Input, Link} from "@nextui-org/react"
import {useSignal} from "@preact/signals-react"
import {useRef} from "react"
import toast from "react-hot-toast"
import {useNavigate} from "react-router-dom"
import * as api from "~/api"
import {fetchSession} from "~/globalState"

export function Login() {
    const navigate = useNavigate()
    const usernameRef = useRef<HTMLInputElement>(null)
    const passwordRef = useRef<HTMLInputElement>(null)
    const username = useSignal("")
    const password = useSignal("")
    const isVisible = useSignal(false)
    let usernameError: string | null = null
    let passwordError: string | null = null
    if (username.value.trim() && !/^[a-zA-Z0-9\-_]{1,64}$/.test(username.value)) {
        usernameError =
            "Username can only contain letters, numbers, dash or underscore."
    }
    if (password.value.trim() && password.value.length < 8) {
        passwordError = "Password should be longer than 8 characters."
    }
    async function onLoginClick() {
        if (usernameError || !username.value.trim()) {
            return usernameRef.current?.focus()
        }
        if (passwordError || !password.value.trim()) {
            return passwordRef.current?.focus()
        }
        const response = await api.login(username.value, password.value)
        await fetchSession()
        if (response.ok) {
            toast.success("Logged-in successfully")
            navigate("/")
        } else {
            console.error(response.err)
            toast.error("An error occured")
        }
    }
    return (
        <div className="flex flex-col items-center justify-center h-full">
            <Card>
                <CardBody className="gap-4 p-8 w-[20rem]">
                    <span className="font-bold text-xl mx-auto">
                        Login to your account
                    </span>
                    <Input
                        ref={usernameRef}
                        variant="bordered"
                        type="text"
                        placeholder="Username"
                        value={username.value}
                        onValueChange={(value) => (username.value = value)}
                        isInvalid={!!usernameError}
                        errorMessage={usernameError}
                    />
                    <Input
                        ref={passwordRef}
                        variant="bordered"
                        type={isVisible.value ? "text" : "password"}
                        placeholder="Password"
                        value={password.value}
                        onValueChange={(value) => (password.value = value)}
                        isInvalid={!!passwordError}
                        errorMessage={passwordError}
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
