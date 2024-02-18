import {Button, Card, CardBody, Input, Link} from "@nextui-org/react"
import {useSignal} from "@preact/signals-react"
import {useRef} from "react"
import toast from "react-hot-toast"
import {useNavigate} from "react-router-dom"
import * as api from "~/api"
import {fetchSession} from "~/globalState"

export function Register() {
    const navigate = useNavigate()
    const usernameRef = useRef<HTMLInputElement>(null)
    const passwordRef = useRef<HTMLInputElement>(null)
    const passwordAgainRef = useRef<HTMLInputElement>(null)
    const username = useSignal("")
    const password = useSignal("")
    const passwordAgain = useSignal("")
    const isVisible = useSignal(false)
    const isVisibleAgain = useSignal(false)
    let usernameError: string | null = null
    let passwordError: string | null = null
    let passwordAgainError: string | null = null
    if (username.value.trim() && !/^[a-zA-Z0-9\-_]{1,64}$/.test(username.value)) {
        usernameError =
            "Username can only contain letters, numbers, dash or underscore."
    }
    if (password.value.trim() && password.value.length < 8) {
        passwordError = "Password should be longer than 8 characters."
    }
    if (password.value.trim() && password.value != passwordAgain.value) {
        passwordAgainError = "Passwords should match."
    }
    async function onLoginClick() {
        if (usernameError || !username.value.trim()) {
            return usernameRef.current?.focus()
        }
        if (passwordError || !password.value.trim()) {
            return passwordRef.current?.focus()
        }
        if (passwordAgainError || !passwordAgain.value.trim()) {
            return passwordAgainRef.current?.focus()
        }
        const response = await api.register(username.value, password.value)
        await fetchSession()
        if (response.ok) {
            toast.success("Registered successfully")
            navigate("/login")
        } else {
            if (response.err === undefined) {
                username.value = ""
                usernameRef.current?.focus()
                toast.error("That username is already taken")
            } else {
                console.error(response.err)
                toast.error("An error occurred")
            }
        }
    }
    return (
        <div className="flex flex-col items-center justify-center h-full">
            <Card>
                <CardBody className="gap-4 p-8 w-[20rem]">
                    <span className="font-bold text-xl mx-auto">Create an account</span>
                    <Input
                        ref={usernameRef}
                        variant="bordered"
                        type="text"
                        label="Username"
                        value={username.value}
                        onValueChange={(value) => (username.value = value)}
                        isInvalid={!!usernameError}
                        errorMessage={usernameError}
                    />
                    <Input
                        ref={passwordRef}
                        variant="bordered"
                        type={isVisible.value ? "text" : "password"}
                        label="Password"
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
                    <Input
                        ref={passwordRef}
                        variant="bordered"
                        type={isVisibleAgain.value ? "text" : "password"}
                        label="Password Again"
                        value={passwordAgain.value}
                        onValueChange={(value) => (passwordAgain.value = value)}
                        isInvalid={!!passwordAgainError}
                        errorMessage={passwordAgainError}
                        endContent={
                            <Button
                                isIconOnly
                                radius="full"
                                size="sm"
                                variant="flat"
                                onClick={() =>
                                    (isVisibleAgain.value = !isVisibleAgain.value)
                                }
                            >
                                {isVisibleAgain.value ? (
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
                        Register
                    </Button>
                    <div className="flex gap-2">
                        <span className="text-gray-500">Already have an account?</span>
                        <Link href="/login">Log in</Link>
                    </div>
                </CardBody>
            </Card>
        </div>
    )
}
