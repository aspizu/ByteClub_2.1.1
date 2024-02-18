import {NextUIProvider} from "@nextui-org/react"
import "material-symbols"
import {StrictMode} from "react"
import {createRoot} from "react-dom/client"
import {Toaster} from "react-hot-toast"
import {RouterProvider, createBrowserRouter} from "react-router-dom"
import "~/index.css"
import {PageNotFound} from "~/routes/PageNotFound"
import {Register} from "~/routes/Register"
import {Root} from "~/routes/Root"
import Writeblog from "./CustomComponents/Writeblog"
import {Login} from "./routes/Login"
import {User} from "./routes/User"

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
        path: "/register",
        element: <Register />,
    },
    {

        path: "/user/:username",
        element: <User />,
    },
    {

        path: "/writeblog",
        element: <Writeblog />,

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
            <Toaster />
        </StrictMode>
    )
}

const root = createRoot(document.getElementById("app")!)
root.render(<Base />)
