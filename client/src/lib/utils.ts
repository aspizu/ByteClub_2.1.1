import {useEffect} from "react"
import {useNavigate} from "react-router-dom"
import {session} from "~/globalState"

/** Fixes the issue where you cannot click back */
export function useLoggedInOnly() {
    const navigate = useNavigate()
    useEffect(() => {
        if (!session.value) {
            navigate("/login", {replace: true})
        }
    }, [])
}
