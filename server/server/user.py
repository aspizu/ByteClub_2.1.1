"""User functionality."""
from __future__ import annotations
import re
from typing import Literal
import msgspec

# Don't put this in a TYPE_CHECKING block, else reproca fails.
from reproca import Response  # noqa: TCH002
from . import User, reproca
from .db import Row, db
from .misc import seconds_since_1970
from .passwords import (
    hash_password,
    is_password_matching,
    is_password_ok,
    password_needs_rehash,
)

MAX_BIO_LENGTH = 256

USERNAME_RE = re.compile(r"[a-zA-Z0-9\-_]{1,64}")
EMAIL_RE = re.compile(
    r"^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$"
)


class Search(msgspec.Struct):
    """Search results."""

    type: Literal["user", "blog", "startup"]
    name: str
    id: int


def is_username_ok(username: str) -> bool:
    """Return true if username is valid."""
    return bool(USERNAME_RE.fullmatch(username))


def is_email_ok(email: str) -> bool:
    """Return true if email is valid."""
    return bool(EMAIL_RE.fullmatch(email))


def name_from_username(username: str) -> str:
    """Convert username into a proper name."""
    return " ".join(
        i.strip().capitalize()
        for i in username.replace("-", " ").replace("_", " ").split()
    )


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
    if row is None or not is_password_matching(row.Password, password, row.CreatedAt):
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
        "INSERT INTO User (Username, Name, Password, CreatedAt) VALUES (?, ?, ?, ?)",
        [
            username,
            name_from_username(username),
            hash_password(password, created_at),
            created_at,
        ],
    )
    con.commit()
    return True


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
async def update_user(
    session: User,
    link: str | None,
    email: str | None,
    name: str | None,
    bio: str | None,
    experience: str | None,
    is_mentor: bool | None,
    mentor_available: bool | None,
    mentor_expertise: str | None,
) -> None:
    """Change given details for user."""
    params = []
    fields = []
    if link is not None:
        fields.append("Link = ?")
        params.append(link)
    if email is not None and is_email_ok(email):
        fields.append("Email = ?")
        params.append(email)
    if name is not None:
        fields.append("Name = ?")
        params.append(name)
    if bio is not None:
        fields.append("Bio = ?")
        params.append(bio)
    if experience is not None:
        fields.append("Experience = ?")
        params.append(experience)
    if is_mentor is not None:
        fields.append("IsMentor = ?")
        params.append(is_mentor)
    if mentor_available is not None:
        fields.append("MentorAvailable = ?")
        params.append(mentor_available)
    if mentor_expertise is not None:
        fields.append("MentorExpertise = ?")
        params.append(mentor_expertise)

    print(fields)
    
    if fields:
        con, cur = db()
        update_query = f"UPDATE User SET {', '.join(fields)} WHERE ID = ?"  # noqa: S608
        params.append(session.id)
        cur.execute(update_query, params)
        con.commit()


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


@reproca.method
async def get_session(session: User | None) -> User | None:
    """Return session user."""
    return session


@reproca.method
async def search_all(query: str) -> list[Search]:
    """Search for all users, blogs and startups."""
    query = f"%{query.strip()}%"
    if query == "%%":
        return []
    _, cur = db()
    cur.execute(
        "SELECT * FROM User WHERE Name LIKE ? OR Username LIKE ?",
        [query, query],
    )
    results = [Search("user", row.Username, row.ID) for row in cur.fetchall()]
    cur.execute(
        "SELECT * FROM Blog WHERE Title LIKE ? OR Content LIKE ?",
        [query, query],
    )
    results.extend(Search("blog", row.Title, row.ID) for row in cur.fetchall())
    cur.execute(
        "SELECT * FROM Startup WHERE Name LIKE ? OR Description LIKE ?",
        [query, query],
    )
    results.extend(Search("startup", row.Name, row.ID) for row in cur.fetchall())
    return results


class GetUser(msgspec.Struct):
    """Details from get user."""

    id: int
    name: str
    link: str
    email: str
    bio: str
    experience: str
    picture: str | None
    is_mentor: bool
    mentor_available: bool
    mentor_expertise: str
    created_at: int
    followers: list[tuple[str, str]]
    following: list[tuple[str, str]]


@reproca.method
async def get_user(username: str) -> GetUser | None:
    """Get a user."""
    _, cur = db()
    cur.execute(
        """
        SELECT
        User.ID, Name, Link, Email, Bio, Experience, Path, IsMentor,
        MentorAvailable, MentorExpertise, User.CreatedAt
        FROM User
        LEFT JOIN File
        ON File.ID = User.Picture
        WHERE Username = ?
        """,
        [username],
    )
    row: Row | None = cur.fetchone()
    if row is None:
        return None
    cur.execute(
        """
        SELECT Username, Name
        FROM User
        INNER JOIN FollowUser
        WHERE Following = ? AND User.ID = Follower
        """,
        [row.ID],
    )
    followers = [(row.Username, row.Name) for row in cur.fetchall()]
    cur.execute(
        """
        SELECT Username, Name
        FROM User
        INNER JOIN FollowUser
        WHERE Follower = ? AND User.ID = Following
        """,
        [row.ID],
    )
    following = [(row.Username, row.Name) for row in cur.fetchall()]
    return GetUser(
        id=row.ID,
        name=row.Name,
        link=row.Link,
        email=row.Email,
        bio=row.Bio,
        experience=row.Experience,
        picture=row.Path,
        is_mentor=row.IsMentor,
        mentor_available=row.MentorAvailable,
        mentor_expertise=row.MentorExpertise,
        created_at=row.CreatedAt,
        followers=followers,
        following=following,
    )
