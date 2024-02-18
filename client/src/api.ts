
import type {ReprocaMethodResponse} from "./reproca"
import reproca from "./reproca_config.ts"
/** None */
export async function get_languages(): Promise<ReprocaMethodResponse<string[]>> {
    return await reproca.callMethod("/get_languages", {})
}
