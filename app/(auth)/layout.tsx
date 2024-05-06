"use client";

/* -------------------------------------------------------------------------- */
/*                             External Dependency                            */
/* -------------------------------------------------------------------------- */

import { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

/* -------------------------------------------------------------------------- */
/*                             Internal Dependency                            */
/* -------------------------------------------------------------------------- */

import { Container } from "@/components/common/container";

// import { getCookie } from "cookies-next";
// import { useRouter } from "next/navigation";

// import { AUTH_TOKEN_KEY } from "@/lib/utils";

interface Props {
    children: React.ReactNode;
}

export default function AuthLayout({ children }: Props): React.JSX.Element {
    // const token = getCookie(AUTH_TOKEN_KEY);
    // const router = useRouter();

    // useEffect(() => {
    //   if (token) {
    //     router.push("/overview");
    //   }
    // }, [])
    useEffect(() => {
        // https://css-tricks.com/the-trick-to-viewport-units-on-mobile/
        const onWindowResize = (): void => {
            document.documentElement.style.setProperty(
                "--vh",
                `${window.innerHeight * 0.01}px`
            );
        };

        window.addEventListener("resize", onWindowResize, false);
        onWindowResize();

        return () => {
            window.removeEventListener("resize", onWindowResize, false);
        };
    }, []);
    return (
        <div className="h-full w-full overflow-auto">
            <div className="fixed inset-0 bg-auth-gradient" />
            <div className="fixed inset-0 bg-[url(/images/cardboard.png)] opacity-40" />
            <div className="relative flex h-full w-full flex-col p-4 sm:p-5">
                <Container className="mt-8 flex items-center justify-between 2xl:mt-16">
                    <Link className="max-w-[200px]" href="/">
                        <Image
                            src="/images/logo.svg"
                            alt="Logo"
                            width={250}
                            height={60}
                        />
                    </Link>
                </Container>
                {children}
            </div>
        </div>
    );
}
