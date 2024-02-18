"""Mentor related methods."""
from __future__ import annotations
from . import User, reproca
from .db import db


@reproca.method
async def become_mentor(session: User, expertise: str, availability: int) -> bool:
    """Become a mentor."""
    con, cur = db()
    cur.execute("SELECT ID FROM Mentor WHERE user_id = ?", [session.id])
    if cur.fetchone():
        return False
    cur.execute(
        "INSERT INTO Mentor (user_id, expertise, availability) VALUES (?, ?, ?)",
        [session.id, expertise, availability],
    )
    con.commit()
    return True


@reproca.method
async def find_mentors() -> list[dict]:
    """Return all mentors."""
    con, cur = db()
    cur.execute(
        """
        SELECT User.ID, Username, Picture, Expertise, Availability
        FROM Mentor
        INNER JOIN User
        WHERE Mentor.user_id = User.ID
        """
    )
    return [dict(row) for row in cur.fetchall()]


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
async def delete_mentor(session: User) -> bool:
    """Delete mentor."""
    con, cur = db()
    cur.execute("DELETE FROM Mentor WHERE user_id = ?", [session.id])
    con.commit()
    return True
