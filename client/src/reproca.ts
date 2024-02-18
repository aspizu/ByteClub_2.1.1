export class ReprocaUnauthorizedError extends Error {}
export class ReprocaServerError extends Error {}
export class ReprocaProtocolError extends Error {}
import type {DependencyList} from "react"
import {useEffect, useState} from "react"

export type ReprocaMethodResponse<T> = {ok: T; err?: never} | {ok?: never; err: Error}

export class Reproca {
    host: string

    constructor(host: string) {
        this.host = host
    }

    async callMethod(
        path: string,
        params: object
    ): Promise<ReprocaMethodResponse<any>> {
        let response: Response
        try {
            response = await fetch(this.host + path, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(params),
                credentials: "include",
            })
        } catch (err) {
            if (err instanceof TypeError) {
                return {err}
            }
            throw err
        }
        if (response.ok) {
            return {ok: await response.json()}
        }
        if (response.status === 400) {
            return {err: new ReprocaProtocolError()}
        }
        if (response.status === 401) {
            return {err: new ReprocaUnauthorizedError()}
        }
        return {err: new ReprocaServerError()}
    }

    async logout(): Promise<Response> {
        return await fetch(this.host + "/logout", {
            method: "POST",
            credentials: "include",
        })
    }
}

export default function reproca(options: {host: string}): Reproca
export default function reproca(host: string): Reproca
export default function reproca(host_or_options: string | {host: string}): Reproca {
    if (typeof host_or_options === "string") {
        return new Reproca(host_or_options)
    } else {
        return new Reproca(host_or_options.host)
    }
}
export function useMethod<T>(
    method: () => Promise<ReprocaMethodResponse<T>>,
    deps?: DependencyList,
    {reload}: {reload?: number} = {}
) {
    const [state, setState] = useState<ReprocaMethodResponse<T> | undefined>(undefined)
    function fetch() {
        method().then(async (value) => {
            setState(value)
            if (reload && value.err) {
                const id = setTimeout(fetch, reload)
                return () => clearTimeout(id)
            }
            return undefined
        })
    }
    useEffect(fetch, deps)
    return [state, fetch] as const
}
