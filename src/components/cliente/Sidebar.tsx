"use client";

import { usePathname } from "next/navigation";

import { CLIENT_MENU } from "./menu";
import NavItem from "./NavItem";

export default function Sidebar() {

    const pathname = usePathname();

    return (

        <aside>

            {/* Logo */}

            {/* Menú */}

            <nav>

                {CLIENT_MENU.map((item) => (

                    <NavItem

                        key={item.id}

                        item={item}

                        isActive={pathname === item.href}

                    />

                ))}

            </nav>

            {/* Logout */}

        </aside>

    );

}