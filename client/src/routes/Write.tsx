import {Button, Input, Textarea} from "@nextui-org/react"
import {useSignal} from "@preact/signals-react"
import {useRef} from "react"
import toast from "react-hot-toast"
import {useNavigate} from "react-router-dom"
import * as api from "~/api"
import {Navbar} from "~/components/Navbar"

export function Write() {
    const navigate = useNavigate()
    const title = useSignal("")
    const content = useSignal("")
    const titleRef = useRef<HTMLInputElement>(null)
    const contentRef = useRef<HTMLTextAreaElement>(null)
    async function submit() {
        if (!title.value.trim()) {
            return titleRef.current?.focus()
        }
        if (!content.value.trim()) {
            return contentRef.current?.focus()
        }
        const response = await api.post_blog(title.value, content.value)
        if (response.ok) {
            navigate(`/post/${response.ok}`)
            toast.success("Your blog post is live")
        } else {
            console.error(response.err)
            toast.error("An error occured")
        }
    }
    return (
        <div>
            <Navbar />
            <div className="flex flex-col h-full w-[95vw] max-w-[1024px] mx-auto p-4 gap-5">
                <Input
                    ref={titleRef}
                    label="Title"
                    value={title.value}
                    onValueChange={(value) => (title.value = value)}
                />
                <Textarea
                    ref={contentRef}
                    label="Content"
                    value={content.value}
                    onValueChange={(value) => (content.value = value)}
                />
                <Button color="primary" onClick={submit}>
                    Create Blog
                </Button>
            </div>
        </div>
    )
}
