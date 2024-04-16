/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import "./styles.css";
import "pakt-ui/styles.css";

import type { Metadata } from "next";
import { Toaster } from "react-hot-toast";
import Script from "next/script";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { Providers } from "@/app/providers";
import { circularStd } from "./font";

export const metadata: Metadata = {
	title: "Afrofund",
	description: "",
};

interface Props {
	children: React.ReactNode;
}

export default function RootLayout({ children }: Props): React.JSX.Element {
	return (
		<html lang="en" suppressHydrationWarning className="h-screen">
			<Script type="module" src="https://cdn.jsdelivr.net/npm/ldrs/dist/auto/zoomies.js" defer />
			<head />

			<body className={`${circularStd.variable} min-h-screen font-sans antialiased`}>
				<Toaster position="top-right" gutter={8} />
				<Providers>{children}</Providers>
			</body>
		</html>
	);
}
