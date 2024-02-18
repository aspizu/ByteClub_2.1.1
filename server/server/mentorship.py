"""Mentor related methods."""
from __future__ import annotations
from . import User, reproca
from .db import db


@reproca.method
async def get_mentorship(mentor_id: int, session: User) -> bool:
    """Get Mentorship."""
    con, cur = db()
    cur.execute(
        "INSERT INTO Mentorship (user_id, mentor_id) VALUES (?, ?)",
        [session.id, mentor_id],
    )
    con.commit()
    return True


@reproca.method
async def delete_mentorship(mentor_id: int, session: User) -> bool:
    """Delete Mentorship."""
    con, cur = db()
    cur.execute(
        "DELETE FROM Mentorship WHERE user_id = ? AND mentor_id = ?",
        [session.id, mentor_id],
    )
    con.commit()
    return True
