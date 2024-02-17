from __future__ import annotations
from pathlib import Path
from typing import TYPE_CHECKING
from reproca import Reproca
from starlette.middleware import Middleware
from starlette.middleware.cors import CORSMiddleware
from starlette.responses import FileResponse
from starlette.routing import Mount, Route
from starlette.staticfiles import StaticFiles

if TYPE_CHECKING:
    from starlette.requests import Request

reproca = Reproca()

languages = [
        "Python",
        "Rust",
        "Typescript",
        "Java",
        "Javascript",
        "Ruby",
        "Go",
        "C",
        "C++",
    ]
@reproca.method
async def get_languages() -> list[str]:
    return languages
@reproca.method
async def add_language(language: str) -> str:
    languages.append(language)
    return language

# This will generate API bindings for Typescript inside the client src directory.
with Path("../client/src/api.ts").open("w") as file:
    reproca.typescript(file)


# This is not a reproca method, it is an endpoint which returns the index.html page
# for any URL.
async def spa_route(request: Request) -> FileResponse:
    return FileResponse("../client/dist/index.html")


# If debug is True, then visiting /docs on the server will respond with a documentation
# page.
app = reproca.build(
    debug=True,
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
            ],
            allow_methods=["*"],
            allow_headers=["*"],
        )
    ],
)

