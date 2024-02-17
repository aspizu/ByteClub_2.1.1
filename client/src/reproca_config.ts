import reproca from "./reproca"

export default reproca(import.meta.env.DEV ? "http://localhost:8000" : "")
