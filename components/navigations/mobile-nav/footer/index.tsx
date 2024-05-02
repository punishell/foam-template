/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { Briefcase, LayoutDashboard, MessageSquare, Users } from "lucide-react";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { MobileNavLink } from "./nav-link";

const NavLink = [
    {
        href: "/overview",
        label: "Dashboard",
        icon: <LayoutDashboard />,
    },
    {
        href: "/jobs",
        label: "Jobs",
        icon: <Briefcase />,
    },
    {
        href: "/talents",
        label: "Talents",
        icon: <Users />,
    },
    {
        href: "/messages",
        label: "Messaging",
        icon: <MessageSquare />,
    },
];

export const BottomNav = (): JSX.Element => {
    return (
        <nav className="relative !z-50 flex h-16 w-full justify-between overflow-hidden bg-primary px-[21px] py-3 sm:hidden">
            {NavLink.map((link) => (
                <MobileNavLink
                    key={link.label}
                    href={link.href}
                    label={link.label}
                    icon={link.icon}
                />
            ))}
        </nav>
    );
};
