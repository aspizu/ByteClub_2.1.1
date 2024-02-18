"""Startup functionality."""

from __future__ import annotations
import msgspec
from server.misc import seconds_since_1970
from . import User, reproca
from .db import db


class Startup(msgspec.Struct):
    """Startup."""

    id: int
    name: str
    description: str
    mission_statement: str
    offerings: str
    created_at: int


@reproca.method
async def create_startup(
    session: User, name: str, description: str, mission_statement: str, offerings: str
) -> bool:
    """Create new startup. Returns startup id."""
    con, cur = db()
    cur.execute(
        """
        INSERT INTO Startup (Name, Offering, Description, MissionStatement, CreatedAt)
        VALUES (?, ?, ?, ?, ?)""",
        [name, description, offerings, mission_statement, seconds_since_1970()],
    )
    con.commit()
    startup_id = cur.lastrowid
    cur.execute(
        "INSERT INTO Founder (founder, startup, createdat) VALUES (?, ?, ?)",
        [session.id, startup_id, seconds_since_1970()],
    )
    con.commit()
    return True


@reproca.method
async def add_founder(session: User, user_id: int, startup_id: int) -> bool:
    """Add founder to startup."""
    con, cur = db()
    cur.execute(
        "SELECT ID FROM Founder WHERE founder = ? AND Startup = ?",
        [session.id, startup_id],
    )
    if cur.fetchone() is None:
        return False
    cur.execute(
        "INSERT INTO Founder (founder, Startup, CreatedAt) VALUES (?, ?, ?)",
        [user_id, startup_id, seconds_since_1970()],
    )
    con.commit()
    return True


@reproca.method
async def get_startup(startup_id: int) -> Startup:
    """Return startup by id."""
    _, cur = db()
    cur.execute("SELECT * FROM Startup WHERE ID = ?", [startup_id])
    row = cur.fetchone()
    return Startup(
        row.ID,
        row.Name,
        row.Description,
        row.MissionStatement,
        row.Offering,
        row.CreatedAt,
    )


@reproca.method
async def get_startups() -> list[Startup]:
    """Return all startups."""
    _, cur = db()
    cur.execute("SELECT * FROM Startup")
    return [
        Startup(
            row.ID,
            row.Name,
            row.Description,
            row.MissionStatement,
            row.Offering,
            row.CreatedAt,
        )
        for row in cur.fetchall()
    ]


@reproca.method
async def update_startup(
    session: User,
    startup_id: int,
    name: str | None = None,
    description: str | None = None,
    mission_statement: str | None = None,
    offerings: str | None = None,
) -> bool:
    """Update startup."""
    if name is description is mission_statement is offerings is None:
        return True
    con, cur = db()
    cur.execute(
        "SELECT ID FROM Founder WHERE Startup = ? AND founder = ?",
        [startup_id, session.id],
    )
    if cur.fetchone() is None:
        return False
    query = "UPDATE Startup SET "
    params = []
    if name is not None:
        query += "Name = ?, "
        params.append(name)
    if description is not None:
        query += "Description = ?, "
        params.append(description)
    if mission_statement is not None:
        query += "MissionStatement = ?, "
        params.append(mission_statement)
    if offerings is not None:
        query += "Offering = ?, "
        params.append(offerings)
    query = query.rstrip(", ") + " WHERE ID = ?"
    params.append(startup_id)
    cur.execute(query, params)
    con.commit()
    return True


@reproca.method
async def follow_startup(startup_id: int, session: User) -> bool:
    """Follow a startup."""
    con, cur = db()
    cur.execute(
        "SELECT * FROM FollowStartup WHERE follower = ? AND following = ?",
        [session.id, startup_id],
    )
    if cur.fetchone():
        return False
    cur.execute(
        "INSERT INTO FollowStartup (follower, following, createdat) VALUES (?, ?, ?)",
        [session.id, startup_id, seconds_since_1970()],
    )
    con.commit()
    return True


@reproca.method
async def unfollow_startup(startup_id: int, session: User) -> bool:
    """Unfollow a startup."""
    con, cur = db()
    cur.execute(
        "DELETE FROM FollowStartup WHERE follower = ? AND following = ?",
        [session.id, startup_id],
    )
    con.commit()
    return True
