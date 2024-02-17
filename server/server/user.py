"""User functionality."""
from __future__ import annotations
import re
from typing import TYPE_CHECKING
from . import User, reproca
from .db import Row, db
from .misc import seconds_since_1970
from .passwords import (
    hash_password,
    is_password_matching,
    is_password_ok,
    password_needs_rehash,
)

if TYPE_CHECKING:
    from reproca import Response

MAX_BIO_LENGTH = 256

USERNAME_RE = re.compile(r"[a-zA-Z0-9\-_]{1,64}")
EMAIL_RE = re.compile(
    r"^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$"
)


def is_username_ok(username: str) -> bool:
    """Return true if username is valid."""
    return bool(USERNAME_RE.fullmatch(username))


def is_email_ok(email: str) -> bool:
    """Return true if email is valid."""
    return bool(EMAIL_RE.fullmatch(email))


def is_bio_ok(bio: str) -> bool:
    """Return true if bio is valid."""
    return len(bio) <= MAX_BIO_LENGTH


@reproca.method
async def login(response: Response, username: str, password: str) -> bool:
    """Login to account."""
    if not (is_username_ok(username) and is_password_ok(password)):
        return False
    con, cur = db()
    cur.execute(
        "SELECT ID, Password, CreatedAt FROM User WHERE Username = ?", [username]
    )
    row: Row | None = cur.fetchone()
    if row is None or is_password_matching(row.Password, password, row.CreatedAt):
        return False
    if password_needs_rehash(row.Password):
        cur.execute(
            "UPDATE User SET Password = ? WHERE ID = ?",
            [hash_password(password, row.CreatedAt), row.ID],
        )
        con.commit()
    response.set_session(
        reproca.sessions.create(row.ID, User(row.ID, username, row.CreatedAt))
    )
    return True


@reproca.method
async def register(username: str, password: str) -> bool:
    """Register new user."""
    if not (is_username_ok(username) and is_password_ok(password)):
        return False
    con, cur = db()
    cur.execute("SELECT ID FROM User WHERE Username = ?", [username])
    if cur.fetchone():
        return False
    created_at = seconds_since_1970()
    cur.execute(
        "INSERT INTO User (Username, Password, CreatedAt) VALUES (?, ?, ?)",
        [username, hash_password(password, created_at), created_at],
    )
    con.commit()
    return False


@reproca.method
async def set_password(
    session: User, response: Response, old_password: str, new_password: str
) -> bool:
    """Change password if old password is given, requires user be logged-in."""
    if not (is_password_ok(old_password) and is_password_ok(new_password)):
        return False
    con, cur = db()
    cur.execute("SELECT Password FROM User WHERE ID = ?", [session.id])
    row: Row | None = cur.fetchone()
    if row is None:
        msg = "User deleted while logged-in."
        raise Exception(msg)
    if not is_password_matching(row.Password, old_password, session.created_at):
        return False
    cur.execute(
        "UPDATE User SET Password = ? WHERE ID = ?",
        [hash_password(new_password, session.created_at), session.id],
    )
    response.logout()
    con.commit()
    return True


@reproca.method
async def update_profile(session: User, bio: str | None) -> bool:
    """Change given details for user."""
    if not bio:
        return True
    if not is_bio_ok(bio):
        return False
    con, cur = db()
    cur.execute("UPDATE User SET Bio = ? WHERE ID = ?", [bio, session.id])
    con.commit()
    return True


@reproca.method
async def follow_user(session: User, user_id: int) -> None:
    """Follow a user."""
    con, cur = db()
    cur.execute(
        "INSERT INTO FollowUser (Follower, Following, CreatedAt) VALUES (?, ?, ?)",
        [session.id, user_id, seconds_since_1970()],
    )
    con.commit()


@reproca.method
async def unfollow_user(session: User, user_id: int) -> None:
    """Unfollow a user."""
    con, cur = db()
    cur.execute(
        "DELETE FROM FollowUser WHERE Follower = ? AND Following = ?",
        [session.id, user_id],
    )
    con.commit()
