"""Startup functionality."""

from __future__ import annotations
import msgspec
from server.misc import seconds_since_1970
from . import User, reproca
from .db import db


class Founder(msgspec.Struct):
    """Startup founder."""

    username: str
    name: str
    picture: str | None
    created_at: int


class Startup(msgspec.Struct):
    """Startup."""

    id: int
    name: str
    description: str
    mission_statement: str
    offering: str
    picture: str | None
    created_at: int
    followers: list[tuple[str, str]]
    founders: list[Founder]


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
async def get_startup(startup_id: int) -> Startup | None:
    """Return startup by id."""
    _, cur = db()
    cur.execute(
        """
        SELECT
        S.ID,
        S.Name,
        S.Description,
        S.MissionStatement,
        S.Offering,
        F.Path,
        S.CreatedAt
        FROM Startup AS S
        LEFT JOIN File as F ON S.Picture = F.ID
        WHERE S.ID = ?
        """,
        [startup_id],
    )
    row = cur.fetchone()
    if row is None:
        return None
    cur.execute(
        """
        SELECT
        F.Username,
        F.Name,
        Z.Path,
        F.CreatedAt
        FROM Founder AS F
        INNER JOIN User as U ON U.ID = F.Founder
        LEFT JOIN File as Z ON U.Picture = Z.ID
        WHERE F.Startup = ?
        """,
        [startup_id],
    )
    founders = [
        Founder(
            username=row.Username,
            name=row.Name,
            picture=row.Picture,
            created_at=row.CreatedAt,
        )
        for row in cur.fetchall()
    ]
    cur.execute(
        """
        SELECT Username, Name
        FROM User
        INNER JOIN FollowStartup
        WHERE Startup = ? AND User.ID = Follower
        """,
        [startup_id],
    )
    followers = [(row.Username, row.Name) for row in cur.fetchall()]
    return Startup(
        id=row.ID,
        name=row.Name,
        description=row.Description,
        mission_statement=row.MissionStatement,
        offering=row.Offering,
        picture=row.Path,
        created_at=row.CreatedAt,
        founders=founders,
        followers=followers,
    )


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


@reproca.method
async def get_founded_startups(username: str) -> list[Startup]:
    """Return startups founded by user."""
    startups = []
    _, cur = db()
    cur.execute("SELECT ID FROM User WHERE Username = ?", [username])
    row = cur.fetchone()
    if row is None:
        return []
    user_id = row.ID
    cur.execute(
        """
        SELECT
        S.ID,
        S.Name,
        S.Description,
        S.MissionStatement,
        S.Offering,
        F.Path,
        S.CreatedAt
        FROM Startup AS S
        INNER JOIN Founder ON Founder.Startup = S.ID
        LEFT JOIN File as F ON S.Picture = F.ID
        WHERE Founder.Founder = ?
        """,
        [user_id],
    )
    startups = []
    for row in cur.fetchall():
        cur.execute(
            """
        SELECT
        U.Username,
        U.Name,
        Z.Path,
        F.CreatedAt
        FROM Founder AS F
        INNER JOIN User as U ON U.ID = F.Founder
        LEFT JOIN File as Z ON U.Picture = Z.ID
        WHERE F.Startup = ?
        """,
            [row.ID],
        )
        founders = [
            Founder(
                username=row.Username,
                name=row.Name,
                picture=row.Path,
                created_at=row.CreatedAt,
            )
            for row in cur.fetchall()
        ]
        cur.execute(
            """
            SELECT Username, Name
            FROM User
            INNER JOIN FollowStartup
            WHERE Following = ? AND User.ID = Follower
            """,
            [row.ID],
        )
        followers = [(row.Username, row.Name) for row in cur.fetchall()]
        startups.append(
            Startup(
                id=row.ID,
                name=row.Name,
                description=row.Description,
                mission_statement=row.MissionStatement,
                offering=row.Offering,
                picture=row.Path,
                created_at=row.CreatedAt,
                founders=founders,
                followers=followers,
            )
        )
    return startups
