"""Mentor related methods."""
from __future__ import annotations
from math import exp, pi

import msgspec
from . import User, reproca
from .db import db


class Mentor(msgspec.Struct):
    """Mentor structure."""

    user_id: int
    username: str
    expertise: str
    availability: int
    picture: str

@reproca.method
async def become_mentor(session: User, expertise: str, availability: int) -> bool:
    """Become a mentor."""
    con, cur = db()
    cur.execute("SELECT user_id FROM Mentor WHERE user_id = ?", [session.id])
    if cur.fetchone():
        return False
    cur.execute(
        "INSERT INTO Mentor (user_id, expertise, availability) VALUES (?, ?, ?)",
        [session.id, expertise, availability],
    )
    con.commit()
    return True


@reproca.method
async def find_mentors() -> list[Mentor]:
    """Return all mentors."""
    con, cur = db()
    cur.execute(
        """
        SELECT User.ID, Username, Expertise, Availability, Picture
        FROM Mentor
        INNER JOIN User
        WHERE Mentor.user_id = User.ID
        """
    )
    return [
        Mentor(row.ID, row.Username, row.expertise, row.availability, row.Picture)
        for row in cur.fetchall()
    ]


@reproca.method
async def filter_mentors(expertise: str, availability: int) -> list[Mentor]:
    """Return filtered mentors."""
    con, cur = db()
    cur.execute(
        """
        SELECT User.ID, Username, Expertise, Availability, Picture
        FROM Mentor
        INNER JOIN User
        WHERE Mentor.user_id = User.ID
        AND Expertise = ?
        AND Availability = ?
        """,
        [expertise, availability],
    )
    return [
        Mentor(row.ID, row.Username, row.expertise, row.availability, row.Picture)
        for row in cur.fetchall()
    ]


@reproca.method
async def update_mentor(session: User, expertise: str, availability: int) -> bool:
    """Update mentor."""
    con, cur = db()
    cur.execute(
        "UPDATE Mentor SET expertise = ?, availability = ? WHERE user_id = ?",
        [expertise, availability, session.id],
    )
    con.commit()
    return True


@reproca.method
async def delete_mentor(session: User) -> None:
    """Delete mentor."""
    con, cur = db()
    cur.execute("DELETE FROM Mentor WHERE user_id = ?", [session.id])
    con.commit()
