import {effect, signal} from "@preact/signals-react"
import * as api from "~/api"

export const session = signal<api.User | null>(null)

export async function fetchSession() {
    const sessionResponse = await api.get_session()
    if (sessionResponse.ok) {
        session.value = sessionResponse.ok
    }
}

effect(() => {
    fetchSession()
})
