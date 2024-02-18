"""Blog functionality."""

from __future__ import annotations
import msgspec
from . import User, reproca
from .db import db, get_last_insert_ID
from .misc import seconds_since_1970

MAX_BLOG_TITLE_LENGTH = 256
MAX_BLOG_CONTENT_LENGTH = 512


def is_blog_title_ok(title: str) -> bool:
    """Return true if blog's title is valid."""
    return 1 <= len(title.strip()) <= MAX_BLOG_TITLE_LENGTH


def is_blog_content_ok(content: str) -> bool:
    """Return true if blog's content is valid."""
    return 1 <= len(content.strip()) <= MAX_BLOG_CONTENT_LENGTH


@reproca.method
async def post_blog(session: User, title: str, content: str) -> int | None:
    """Create new blog. Returns blog id."""
    if not (is_blog_title_ok(title) and is_blog_content_ok(content)):
        return None
    con, cur = db()
    cur.execute(
        "INSERT INTO Blog (Title, Content, Author, CreatedAt) VALUES (?, ?, ?, ?)",
        [title, content, session.id, seconds_since_1970()],
    )
    con.commit()
    return get_last_insert_ID(cur, "Blog")


@reproca.method
async def delete_blog(session: User, blog_id: int) -> None:
    """Delete a blog."""
    con, cur = db()
    cur.execute("DELETE FROM Blog WHERE ID = ? AND Author = ?", [blog_id, session.id])
    con.commit()


class Blog(msgspec.Struct):
    id: int
    title: str
    content: str
    author_id: int
    author_username: str
    author_picture: str


@reproca.method
async def get_blogs() -> list[Blog]:
    """Return all blogs."""
    _, cur = db()
    cur.execute(
        """
        SELECT Blog.ID, Title, Content, User.ID as AuthorID, Username, Picture
        FROM Blog
        INNER JOIN User
        WHERE Blog.Author = User.ID
        """
    )
    return [
        Blog(row.ID, row.Title, row.Content, row.AuthorID, row.Username, row.Picture)
        for row in cur.fetchall()
    ]
