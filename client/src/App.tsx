import * as api from "~/api"
import {useMethod} from "./reproca"

export function App() {
    const [languages] = useMethod(api.get_languages, [])
    if (languages?.ok) {
        return (
            <ul>
                {languages.ok.map((language) => (
                    <li key={language}>{language}</li>
                ))}
            </ul>
        )
    } else {
        return <h2>Loading...</h2>
    }
}
