import localFont from "next/font/local";
import { Rubik } from "next/font/google";

export const circularStd = localFont({
    src: [
        {
            path: "../fonts/CircularStd-Book.woff2",
            weight: "400",
            style: "normal",
        },
        {
            path: "../fonts/CircularStd-Medium.woff2",
            weight: "500",
            style: "normal",
        },
        {
            path: "../fonts/CircularStd-Bold.woff2",
            weight: "700",
            style: "normal",
        },
    ],
    variable: "--circular-std-font",
});

export const rubik = Rubik({
    subsets: ["latin"],
    display: "swap",
});
