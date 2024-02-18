"""Mentor related methods."""
from __future__ import annotations
from server.misc import seconds_since_1970
from . import User, reproca
from .db import db


@reproca.method
async def start_mentorship(session: User, mentee_id: int) -> bool:
    """Get Mentorship."""
    con, cur = db()
    cur.execute(
        "INSERT INTO Mentorship (Mentor, Mentee, CreatedAt) VALUES (?, ?, ?)",
        [session.id, mentee_id, seconds_since_1970()],
    )
    con.commit()
    return True


@reproca.method
async def stop_mentorship(session: User, mentee_id: int) -> None:
    """Stop Mentorship."""
    con, cur = db()
    cur.execute(
        "UPDATE Mentorship SET EndedAt = ? WHERE Mentor = ? AND Mentee = ?",
        [seconds_since_1970(), session.id, mentee_id],
    )
    con.commit()
