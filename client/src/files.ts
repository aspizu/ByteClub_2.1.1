import reproca from "~/reproca_config"
import {ReprocaMethodResponse} from "./reproca"

/**
 * upload a file to the server
 * @param fileInput HTML input for file selection, caller should handle max upload size, file-type and atleast one file selected.
 * @returns ok: the url which will return the uploaded file, err: exceed max upload size or disallowed extension
 */
export async function uploadFile(
    fileInput: HTMLInputElement,
): Promise<ReprocaMethodResponse<string>> {
    const file = fileInput.files?.[0]
    if (!file) {
        throw new TypeError(
            "uploadFile called with input which contains no selected files. This should have been handled by the caller.",
        )
    }
    const formData = new FormData()
    formData.append("file", file)
    try {
        const response = await fetch(`${reproca.host}/upload`, {
            method: "POST",
            body: formData,
        })
        if (!response.ok) {
            return {
                err: new Error(
                    "Either file extension is incorrect or file size exceeds maximum upload size.",
                ),
            }
        }
        return {ok: await response.text()}
    } catch (err) {
        if (err instanceof TypeError) {
            return {err}
        }
        throw err
    }
}
