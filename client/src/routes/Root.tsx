import {useEffect} from "react"
import {useNavigate} from "react-router-dom"
import {fetchSession, session} from "~/globalState"

export function Root() {
    const navigate = useNavigate()
    useEffect(() => {
        ;(async () => {
            await fetchSession()
            if (session.value == null) {
                navigate("/login")
            }
        })()
    }, [])
    return <h1>Hello, World!</h1>
}
