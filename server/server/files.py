"""Allows users to upload files such as images."""
from __future__ import annotations
import secrets
from pathlib import Path
from typing import TYPE_CHECKING
from starlette.responses import PlainTextResponse, Response
from starlette.routing import Mount
from starlette.staticfiles import StaticFiles

if TYPE_CHECKING:
    from starlette.requests import Request

MAX_UPLOAD_SIZE = 1_049_000  # 10 MiB
UPLOADED = Path("./uploaded")


async def upload_file(request: Request) -> Response:
    """Endpoint to upload one file."""
    form = await request.form()
    file = form.get("file")
    if (
        isinstance(file, str)
        or file is None
        or file.size is None
        or file.size > MAX_UPLOAD_SIZE
        or file.filename is None
    ):
        return Response(status_code=400)
    extension = file.filename.split(".")[-1]
    if extension not in ["png", "jpg", "jpeg", "bmp", "webp"]:
        return Response(status_code=400)
    filename = secrets.token_urlsafe() + "." + extension
    if not UPLOADED.is_dir():
        UPLOADED.mkdir()
    filepath = UPLOADED / filename
    with filepath.open("wb") as fp:
        fp.write(await file.read())
    return PlainTextResponse(f"/uploaded/{filename}")


files_mount = (
    Mount("/uploaded", app=StaticFiles(directory=UPLOADED), name="uploaded"),
)
