import {Button, Input, Textarea} from "@nextui-org/react"
import {useSignal} from "@preact/signals-react"
import {useEffect} from "react"
import toast from "react-hot-toast"
import {useNavigate} from "react-router-dom"
import * as api from "~/api"
import {Navbar} from "~/components/Navbar"
import {session} from "~/globalState"

//name:string,description:string,mission_statement:string,offerings:string
export function Createstartup() {
    const navigate = useNavigate()
    const name = useSignal("")
    const description = useSignal("")
    const mission_statement = useSignal("")
    const offerings = useSignal("")

    useEffect(() => {
        if (!session.value) {
            navigate("/login")
        }
    }, [])

    async function submit() {
        if (
            !name.value.trim() ||
            !description.value.trim() ||
            !mission_statement.value.trim() ||
            !offerings.value.trim()
        ) {
            return
        }
        const response = await api.create_startup(
            name.value,
            description.value,
            mission_statement.value,
            offerings.value
        )
        if (response.ok) {
            navigate(`/startup/${response.ok}`)
            toast.success("Your startup has been registered!")
        } else {
            console.error(response.err)
            toast.error("An error occurred")
        }
    }
    return (
        <>
            <Navbar />
            <div className="flex flex-col h-full w-[95vw] max-w-[1024px] mx-auto p-4 gap-5">
                <Input
                    type="text"
                    label="Startup Name"
                    placeholder=""
                    value={name.value}
                    onValueChange={(value) => (name.value = value)}
                    labelPlacement="outside"
                />

                <Textarea
                    type="text"
                    label="Description"
                    placeholder=""
                    value={description.value}
                    onValueChange={(value) => (description.value = value)}
                    labelPlacement="outside"
                />

                <Textarea
                    type="text"
                    label="Mission Statement"
                    placeholder=""
                    value={mission_statement.value}
                    onValueChange={(value) => (mission_statement.value = value)}
                    labelPlacement="outside"
                />

                <Textarea
                    type="text"
                    label="Offerings"
                    placeholder=""
                    value={offerings.value}
                    onValueChange={(value) => (offerings.value = value)}
                    labelPlacement="outside"
                />

                <Button color="primary" onClick={submit}>
                    Register
                </Button>
            </div>
        </>
    )
}
