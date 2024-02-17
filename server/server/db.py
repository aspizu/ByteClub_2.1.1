"""Database utilities."""
from __future__ import annotations
import sqlite3
from typing import Any, LiteralString


class Row:
    """Row factory with JS like syntax."""

    def __init__(
        self, cursor: sqlite3.Cursor, row: tuple[int | float | str | bytes | None, ...]
    ) -> None:
        fields = [column[0] for column in cursor.description]
        self.row = dict(zip(fields, row))

    def __getattr__(self, key: str) -> Any:  # noqa: ANN401
        try:
            return self.row[key]
        except KeyError:
            raise AttributeError(key) from None

    def __repr__(self) -> str:
        return repr(self.row)

    def __str__(self) -> str:
        return str(self.row)


def db() -> tuple[sqlite3.Connection, sqlite3.Cursor]:
    """Connect to the default database and create a cursor."""
    con = sqlite3.connect("database.db")
    con.row_factory = Row
    return con, con.cursor()


def get_last_insert_ID(cur: sqlite3.Cursor, table_name: LiteralString) -> int | None:  # noqa: N802
    """Return the value from the ID column for the given table's last inserted row."""
    cur.execute(f"SELECT ID FROM {table_name} WHERE rowid = last_insert_rowid()")  # noqa: S608
    return (row := cur.fetchone()) and row.ID
