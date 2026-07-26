"use client";

import Link from "next/link";
import Image from "next/image";
import posthog from "posthog-js";

const Navbar = () => {
    const handleNavigationClick = (destination: string) => {
        posthog.capture("navigation_clicked", {
            destination,
        });
    };

    return (
        <header>
            <nav>
                <Link href={'/'} className={"logo"} onClick={() => handleNavigationClick("home_logo")}>
                    <Image src={"/icons/logo.png"} alt={"logo"} width={24} height={24} />
                    <p>DevEvent</p>
                </Link>

                <ul>
                    <Link href={"/"} onClick={() => handleNavigationClick("home")}>Home</Link>
                    <Link href={"/"} onClick={() => handleNavigationClick("events")}>Events</Link>
                    <Link href={"/"} onClick={() => handleNavigationClick("create_event")}>Create Event</Link>
                </ul>
            </nav>
        </header>
    )
}
export default Navbar
