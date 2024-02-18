import {effect, signal} from "@preact/signals-react"
import * as api from "~/api"

export const session = signal<api.User | null>(null)

effect(async () => {
    const sessionResponse = await api.get_session()
    if (sessionResponse.ok) {
        session.value = sessionResponse.ok
    }
})
