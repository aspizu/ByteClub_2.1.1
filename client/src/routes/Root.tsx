import {useEffect} from "react"
import {useNavigate} from "react-router-dom"
import {session} from "~/globalState"

export function Root() {
    const navigate = useNavigate()
    useEffect(() => {
        if (!session.value) {
            navigate("/login")
        }
    }, [])
    return <h1>Hello, World!</h1>
}
