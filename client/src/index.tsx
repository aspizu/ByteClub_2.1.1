import {NextUIProvider} from "@nextui-org/react"
import "material-symbols"
import {StrictMode} from "react"
import {createRoot} from "react-dom/client"
import {RouterProvider, createBrowserRouter} from "react-router-dom"
import "~/index.css"
import {PageNotFound} from "~/routes/PageNotFound"
import {Root} from "~/routes/Root"
import {Login} from "./routes/Login"

const router = createBrowserRouter([
    {
        path: "/",
        element: <Root />,
    },
    {
        path: "/login",
        element: <Login />,
    },
    {
        path: "*",
        element: <PageNotFound />,
    },
])

function Base() {
    return (
        <StrictMode>
            <NextUIProvider>
                <RouterProvider router={router} />
            </NextUIProvider>
        </StrictMode>
    )
}

const root = createRoot(document.getElementById("app")!)
root.render(<Base />)
