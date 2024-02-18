from __future__ import annotations
from pathlib import Path
from typing import TYPE_CHECKING
import msgspec
from reproca import Reproca
from starlette.middleware import Middleware
from starlette.middleware.cors import CORSMiddleware
from starlette.responses import FileResponse
from starlette.routing import Mount, Route
from starlette.staticfiles import StaticFiles

if TYPE_CHECKING:
    from starlette.requests import Request


class User(msgspec.Struct):
    """Reproca session store."""

    id: int
    username: str
    created_at: int


# --> int
# Type of unique identifier for any user. This is the ID column of the User table in the
# database.
# --> User
# Type used to store user sessions, any information can be stored together with the user
# sessions.
reproca: Reproca[int, User] = Reproca(debug=True)

# You should import all modules which create reproca methods here.
<<<<<<< HEAD
from . import blog, user, mentorship, mentor, startup  # noqa: E402
_ = (user, blog, mentorship, mentor, startup)  
=======
from . import blog, mentor, mentorship, user  # noqa: E402

_ = (user, blog, mentorship, mentor)
>>>>>>> 18d6b8bfd318ddee7bc12556ef83d7191644159b

# This will generate API bindings for Typescript inside the client src directory.
with Path("../client/src/api.ts").open("w") as file:
    reproca.typescript(file)


async def spa_route(request: Request) -> FileResponse:
    """Endpoint which returns the `index.html` page for any URL."""
    return FileResponse("../client/dist/index.html")


app = reproca.build(
    routes=[
        Mount(
            "/assets", app=StaticFiles(directory="../client/dist/assets"), name="assets"
        ),
        Route("/{path:path}", spa_route),
    ],
    middleware=[
        Middleware(
            CORSMiddleware,
            allow_origins=[
                "http://localhost:5173",  # Vite debug server, not for production.
                "http://0.0.0.0:5173",
                "http://127.0.0.1:5173",
            ],
            allow_methods=["*"],
            allow_headers=["*"],
            allow_credentials=True,
        )
    ],
)
