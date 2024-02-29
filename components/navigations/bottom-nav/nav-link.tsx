"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { type FC } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface Props {
	href: string;
	label: string;
	icon?: React.ReactNode;
}

export const MobileNavLink: FC<Props> = ({ href, label, icon }) => {
	const pathname = usePathname();
	const parentPath = pathname.split("/")[1];
	const isActive = href.startsWith(`/${parentPath}`);

	return (
		<Link
			href={href}
			className={`flex w-full group items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-base font-normal text-white duration-200 hover:bg-transparent
      ${isActive ? "bg-emerald-900 !rounded-[100px]" : ""}
      `}
		>
			{icon}
			<span className={`hidden !text-white ${isActive && "!block"}`}>
				{label}
			</span>
		</Link>
	);
};
