import { Cairo } from "next/font/google";
import "./globals.css";
import "@fortawesome/fontawesome-svg-core/styles.css";
import { config } from "@fortawesome/fontawesome-svg-core";
config.autoAddCss = false;

const cairo = Cairo({
    subsets: ["latin", "arabic"],
    variable: "--font-cairo",
    display: "swap",
});

export const metadata = {
    title: "Eureka Kuwait — Voice",
    description:
        "Speak with Eureka's AI voice assistant.",
    icons: {
        icon: "/logo.png",
    },
};

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body className={`${cairo.variable} font-cairo`}>
                {children}
            </body>
        </html>
    );
}
