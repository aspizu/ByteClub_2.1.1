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
import {Blog} from "./routes/Blog"
import {Explore} from "./routes/Explore"
import {Login} from "./routes/Login"
import {Startup} from "./routes/Startup"
import {User} from "./routes/User"
import {Write} from "./routes/Write"

const router = createBrowserRouter([
    {
        path: "/",
        element: <Root />,
    },
    {
        path: "/explore",
        element: <Explore />,
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
        path: "/blog/:id",
        element: <Blog />,
    },
    {
        path: "/startup/:id",
        element: <Startup />,
    },
    {
        path: "/write",
        element: <Write />,
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
