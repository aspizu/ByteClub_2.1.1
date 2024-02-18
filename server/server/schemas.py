from __future__ import annotations


class User:
    id: int
    name: str
    email: str
    link: str
    bio: str
    profile_pic: str
    skills: str
    experience: str


class Mentor(User):
    user_id: int
    user: User
    expertiese: str
    availability: bool


class Blog:
    id: int
    title: str
    content: str
    created_at: str
    user_id: int


class Startup:
    id: int
    name: str
    mission_statement: str
    offering: str
    description: str
    logo: str
    founder: User
