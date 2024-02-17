from .server import reproca
from .server import schemas as sc


@reproca.method
async def register(
    username: str,
    password: str,
) -> bool:
    return True


@reproca.method
async def login(
    username: str,
    password: str,
) -> bool:
    return True


@reproca.method
async def get_user(id: int) -> sc.User:
    user = sc.User()
    return user


# Can also create update and delete user methods


@reproca.method
async def follow_user(id: int) -> bool:
    return True


# Can also create unfollow user method


@reproca.method
async def find_mentors(id: int) -> list[sc.Mentor]:
    mentor = sc.Mentor()
    return [mentor]


@reproca.method
async def become_mentor(id: int, expertiese: str, availability: bool) -> bool:
    return True


@reproca.method
async def get_mentorship(id: int) -> bool:
    return True


@reproca.method
async def get_blog(id: int) -> sc.Blog:
    blog = sc.Blog()
    return blog


@reproca.method
async def create_blog(title: str, content: str, user_id: int) -> bool:
    return True
