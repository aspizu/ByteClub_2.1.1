from __future__ import annotations
from pathlib import Path
from reproca import Reproca
from starlette.middleware import Middleware
from starlette.middleware.cors import CORSMiddleware

reproca = Reproca()


@reproca.method
async def get_languages() -> list[str]:
    return [
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


# This will generate API bindings for Typescript inside the client src directory.
with Path("../client/src/api.ts").open("w") as file:
    reproca.typescript(file)

# If debug is True, then visiting /docs on the server will respond with a documentation
# page.
app = reproca.build(
    debug=True,
    middleware=[
        Middleware(
            CORSMiddleware,
            allow_origins=[
                "http://localhost:5173",
            ],
            allow_methods=["*"],
            allow_headers=["*"],
        )
    ],
)
