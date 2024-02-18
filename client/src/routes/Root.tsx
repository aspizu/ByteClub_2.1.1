import {useEffect} from "react"
import {useNavigate} from "react-router-dom"
import {Navbar} from "~/components/Navbar"
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
    return (
        <div>
            <Navbar />
        </div>
    )
}
