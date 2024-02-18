
import {
    Avatar,
    Button,
    Dropdown,
    DropdownItem,
    DropdownMenu,
    DropdownTrigger,
    Link,
    NavbarBrand,
    NavbarContent,
    NavbarItem,
    Navbar as NextUINavbar,
} from "@nextui-org/react"
import toast from "react-hot-toast"
import {useNavigate} from "react-router-dom"
import {fetchSession, session} from "~/globalState"
import reproca from "~/reproca_config"

export function Navbar() {
    const navigate = useNavigate()
    async function onLogOutClick() {
        await reproca.logout()
        await fetchSession()
        toast.success("Logged out")
        navigate("/login")
    }
    return (
        <NextUINavbar>
            <NavbarBrand>
                <p className="font-bold">BYTE CLUB</p>
            </NavbarBrand>
            <NavbarContent justify="center">
                <NavbarItem>
                    <Link color="foreground" href="/explore">
                        Explore
                    </Link>
                </NavbarItem>
                <NavbarItem>
                    <Link color="foreground" href="/mentorship">
                        Mentorship
                    </Link>
                </NavbarItem>
            </NavbarContent>
            <NavbarContent justify="end">
                {session.value == null ? (
                    <Button as="a" href="/login" variant="shadow" color="primary">
                        Log in
                    </Button>
                ) : (
                    <Dropdown placement="bottom-end">
                        <DropdownTrigger>
                            <Avatar
                                isBordered
                                as="button"
                                name={session.value.username}
                            />
                        </DropdownTrigger>
                        <DropdownMenu variant="flat">
                            <DropdownItem key="profile" className="h-14 gap-2">
                                <p className="font-semibold">Signed in as</p>
                                <p className="font-semibold">
                                    {session.value.username}
                                </p>
                            </DropdownItem>
                            <DropdownItem
                                as="a"
                                href={`/user/${session.value.username}`}
                            >
                                View my profile
                            </DropdownItem>
                            <DropdownItem as="a" href="/messages">
                                Messages
                            </DropdownItem>
                            <DropdownItem as="a" href="/dashboard">
                                Dashboard
                            </DropdownItem>
                            <DropdownItem
                                key="logout"
                                color="danger"
                                onClick={onLogOutClick}
                            >
                                Log Out
                            </DropdownItem>
                        </DropdownMenu>
                    </Dropdown>
                )}
            </NavbarContent>
        </NextUINavbar>
    )

import React from "react"

function Navbar() {
    return <div>Navbar</div>

}

export default Navbar
