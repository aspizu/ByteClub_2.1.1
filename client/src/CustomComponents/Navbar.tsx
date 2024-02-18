import {Link} from "react-router-dom"
import {buttonVariants} from "~/Components/ui/button"
import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuList,
} from "~/Components/ui/navigation-menu"

export function Navbar() {
    let backgroundColor = "black"
    let iconColor: string = "white"
    return (
        <header className="sticky border-b-[1px] top-0 z-40 w-full bg-black dark:bg-background">
            <NavigationMenu className="mx-auto bg-black">
                <NavigationMenuList className="container h-14 px-4 w-screen flex justify-between bg-black text-white">
                    <NavigationMenuItem className="font-bold flex bg-black hover:cursor-pointer">
                        <Link to="#">
                            <svg
                                width="30"
                                height="32"
                                viewBox="0 0 30 32"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    d="M0 0V4.5911H30V0H0ZM0 13.6356V18.2267H30V13.6356H0ZM0 27.4089V32H30V27.4089H0Z"
                                    fill={`${iconColor}`}
                                />
                            </svg>
                        </Link>
                    </NavigationMenuItem>

                    <NavigationMenuItem className="font-bold flex bg-black hover:cursor-pointer">
                        <Link to="login">
                            <span>
                                <svg
                                    width="42"
                                    height="40"
                                    viewBox="0 0 42 40"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <g clip-path="url(#clip0_213_7269)">
                                        <path
                                            d="M21.0976 16.3334C20.3394 16.3543 19.5988 16.4458 18.8818 16.6005C15.9131 17.4441 13.7349 20.1528 13.7349 23.3552C13.7349 27.2299 16.9236 30.3821 20.8431 30.3821C24.7626 30.3821 27.9512 27.2298 27.9512 23.3552C27.9513 19.5649 24.8996 16.4663 21.0976 16.3334Z"
                                            fill={`${iconColor}`}
                                        />
                                        <path
                                            d="M35.1401 5.85417C31.3212 2.07906 26.2438 0 20.8431 0C15.4425 0 10.3651 2.07906 6.54629 5.85417C3.71219 8.65577 1.82419 12.1429 1.03833 15.937C3.69561 11.168 8.83026 7.92933 14.7163 7.92933C23.2389 7.92933 30.1865 14.7189 30.3177 23.1138C30.3197 23.194 30.3208 23.2745 30.3208 23.3553C30.3208 28.5214 26.0691 32.7244 20.8431 32.7244C15.6172 32.7244 11.3655 28.5213 11.3655 23.3552C11.3655 22.7204 11.4301 22.1003 11.5523 21.5006C10.2423 23.3968 9.47524 25.6872 9.47524 28.1517C9.47524 34.5758 14.6849 39.8195 21.1471 39.9714C26.4339 39.8948 31.393 37.8251 35.14 34.1208C38.9589 30.3457 41.0621 25.3264 41.0621 19.9875C41.0621 14.6486 38.9589 9.62937 35.1401 5.85417Z"
                                            fill={`${iconColor}`}
                                        />
                                        <path
                                            d="M24.7318 14.8115C22.303 12.0329 18.7139 10.2716 14.7163 10.2716C7.41846 10.2716 1.4812 16.1409 1.4812 23.3552C1.4812 25.1813 1.85924 26.9593 2.58714 28.6008C3.56545 30.6235 4.89512 32.4887 6.54628 34.1208C7.68941 35.2509 8.94603 36.2277 10.2896 37.0434C8.29972 34.6107 7.10588 31.5167 7.10588 28.1516C7.10588 21.4017 11.9066 15.7402 18.3098 14.3264C19.1165 14.105 19.9661 13.9861 20.8431 13.9861C20.9336 13.9861 21.0236 13.9876 21.1134 13.9901C21.2205 13.9878 21.3278 13.9861 21.4354 13.9861V14.0049C22.6036 14.0765 23.7153 14.3575 24.7318 14.8115Z"
                                            fill={`${iconColor}`}
                                        />
                                    </g>
                                    <defs>
                                        <clipPath id="clip0_213_7269">
                                            <rect
                                                width="40.4341"
                                                height="39.9714"
                                                fill={`${iconColor}`}
                                                transform="translate(0.833252)"
                                            />
                                        </clipPath>
                                    </defs>
                                </svg>
                            </span>
                            <span
                                className={`text-[17px] ${buttonVariants({
                                    variant: "ghost",
                                })}`}
                            >
                                StartupCircle
                            </span>
                        </Link>
                    </NavigationMenuItem>

                    <nav className="hidden md:flex gap-10 bg-black hover:cursor-pointer">
                        <Link to="#">
                            <span
                                className={`text-[17px] ${buttonVariants({
                                    variant: "ghost",
                                })}`}
                            >
                                Explore
                            </span>
                        </Link>

                        <Link to="#">
                            <span
                                className={`text-[17px] ${buttonVariants({
                                    variant: "ghost",
                                })}`}
                            >
                                Mentorship
                            </span>
                        </Link>
                    </nav>
                    <Link to="#">
                        <div className="hidden md:flex gap-2 bg-black hover:cursor-pointer">
                            <svg
                                width="32"
                                height="33"
                                viewBox="0 0 32 33"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    d="M0 0V23.5714L4 18.8571H8V4.71429H20V0H0ZM12 9.42857V28.2857H28L32 33V9.42857H12Z"
                                    fill={`${iconColor}`}
                                />
                            </svg>
                        </div>
                    </Link>
                </NavigationMenuList>
            </NavigationMenu>
        </header>
    )
}
