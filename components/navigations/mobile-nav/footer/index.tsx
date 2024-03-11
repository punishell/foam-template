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
		<nav className="relative bg-primary overflow-hidden px-[21px] py-3 flex sm:hidden justify-between h-16 !z-50 w-full">
			{NavLink.map((link) => (
				<MobileNavLink key={link.label} href={link.href} label={link.label} icon={link.icon} />
			))}
		</nav>
	);
};
