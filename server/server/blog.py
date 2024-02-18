"""Blog functionality."""

from __future__ import annotations
import msgspec
from . import User, reproca
from .db import Row, db
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
    return cur.lastrowid


class Blog(msgspec.Struct):
    """Blog."""

    id: int
    title: str
    content: str
    created_at: int
    author_username: str
    author_name: str
    author_picture: str | None


@reproca.method
async def get_blogs() -> list[Blog]:
    """Return all blogs."""
    _, cur = db()
    cur.execute(
        """
        SELECT
            B.ID,
            B.Title,
            B.Content,
            B.CreatedAt,
            U.Username,
            U.Name,
            F.Path
        FROM Blog AS B
        INNER JOIN User AS U ON B.Author = U.ID
        LEFT JOIN File AS F ON U.Picture = F.ID
        """
    )
    return [
        Blog(
            id=row.ID,
            title=row.Title,
            content=row.Content,
            created_at=row.CreatedAt,
            author_username=row.Username,
            author_name=row.Name,
            author_picture=row.Path,
        )
        for row in cur.fetchall()
    ]


@reproca.method
async def get_blog(blog_id: int) -> Blog | None:
    """Return a single blog by ID."""
    _, cur = db()
    cur.execute(
        """
        SELECT
            B.Title,
            B.Content,
            B.CreatedAt,
            U.Username,
            U.Name,
            F.Path
        FROM Blog AS B
        INNER JOIN User AS U ON B.Author = U.ID
        LEFT JOIN File AS F ON U.Picture = F.ID
        WHERE B.ID = ?
        """,
        [blog_id],
    )
    row: Row | None = cur.fetchone()
    if row is None:
        return None
    return Blog(
        id=blog_id,
        title=row.Title,
        content=row.Content,
        created_at=row.CreatedAt,
        author_username=row.Username,
        author_name=row.Name,
        author_picture=row.Path,
    )


class UserBlog(msgspec.Struct):
    """Blog from a known user."""

    id: int
    title: str
    content: str
    created_at: int


@reproca.method
async def get_user_blogs(username: str) -> list[UserBlog]:
    """Return all blogs."""
    _, cur = db()
    cur.execute(
        """
        SELECT Blog.ID, Title, Content, Blog.CreatedAt
        FROM Blog
        INNER JOIN User
        ON Blog.Author = User.ID AND User.Username = ?
        """,
        [username],
    )
    return [
        UserBlog(
            id=row.ID,
            title=row.Title,
            content=row.Content,
            created_at=row.CreatedAt,
        )
        for row in cur.fetchall()
    ]
