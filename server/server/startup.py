"""Startup functionality."""

from __future__ import annotations
import msgspec
from server.misc import seconds_since_1970
from . import User, reproca
from .db import db, get_last_insert_ID


class Startup(msgspec.Struct):
    """Startup structure."""

    id: int
    name: str
    description: str
    mission_statement: str
    offerings: str
    created_at: int


@reproca.method
async def create_startup(
    name: str, description: str, mission_statement: str, offerings: str, session: User
) -> bool:
    """Create new startup. Returns startup id."""
    con, cur = db()
    cur.execute(
        "INSERT INTO Startup (Name, Offering, Description, MissionStatement, CreatedAt) VALUES (?, ?, ?, ?, ?)",
        [name, description, offerings, mission_statement, seconds_since_1970()],
    )
    con.commit()
    startup_id = get_last_insert_ID(cur, "Startup")
    cur.execute(
        "INSERT INTO Founder (user_id, startup_id, createdat) VALUES (?, ?, ?)",
        [session.id, startup_id, seconds_since_1970()],
    )
    con.commit()
    return True


@reproca.method
async def add_founder(user_id: int, startup_id: int, session: User) -> bool:
    """Add founder to startup."""
    con, cur = db()
    cur.execute("SELECT user_id FROM Founder WHERE startup_id = ?", [startup_id])
    founder_ids = [row.User_id for row in cur.fetchall()]
    if session.id not in founder_ids:
        return False
    cur.execute(
        "INSERT INTO Founder (user_id, startup_id, createdat) VALUES (?, ?, ?)",
        [user_id, startup_id, seconds_since_1970()],
    )
    con.commit()
    return True


@reproca.method
async def get_startup(startup_id: int) -> Startup:
    """Return startup by id."""
    con, cur = db()
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
    con, cur = db()
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
    startup_id: int,
    name: str,
    description: str,
    mission_statement: str,
    offerings: str,
    session: User,
) -> bool:
    """Update startup."""
    con, cur = db()
    cur.execute("SELECT user_id FROM Founder WHERE startup_id = ?", [startup_id])
    founder_ids = [row.User_id for row in cur.fetchall()]
    if session.id not in founder_ids:
        return False
    cur.execute(
        "UPDATE Startup SET Name = ?, Description = ?, MissionStatement = ?, Offering = ? WHERE ID = ?",
        [name, description, mission_statement, offerings, startup_id],
    )
    con.commit()
    return True


@reproca.method
async def delete_startup(startup_id: int, session: User) -> bool:
    """Delete a startup."""
    con, cur = db()
    cur.execute("SELECT user_id FROM Founder WHERE startup_id = ?", [startup_id])
    founder_ids = [row.User_id for row in cur.fetchall()]
    if session.id not in founder_ids:
        return False
    cur.execute("DELETE FROM Startup WHERE ID = ?", [id])
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