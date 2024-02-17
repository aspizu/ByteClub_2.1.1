from .server import reproca
from .server import schemas as sc


@reproca.method
async def create_startup(
    name: str, description: str, mission_statement: str, logo: str
) -> bool:
    return True


@reproca.method
async def get_startup(id: int) -> sc.Startup:
    startup = sc.Startup()
    return startup


@reproca.method
async def get_startups() -> list[sc.Startup]:
    startup = sc.Startup()
    return [startup]


@reproca.method
async def become_founder(id: int) -> bool:
    return True
