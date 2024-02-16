import react from "@vitejs/plugin-react"
import {defineConfig} from "vite"

export default defineConfig({
    resolve: {alias: [{find: "~", replacement: "/src"}]},
    plugins: [react({babel: {plugins: [["module:@preact/signals-react-transform"]]}})],
})
