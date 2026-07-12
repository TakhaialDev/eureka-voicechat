import { Geist } from "next/font/google";
import { Cairo } from "next/font/google";
import { ThemeProvider } from "next-themes";
import "./globals.css";
import "@fortawesome/fontawesome-svg-core/styles.css";
import { config } from "@fortawesome/fontawesome-svg-core";
config.autoAddCss = false;

const geist = Geist({
    subsets: ["latin"],
    variable: "--font-geist-sans",
    display: "swap",
});

const cairo = Cairo({
    subsets: ["latin", "arabic"],
    variable: "--font-cairo",
    display: "swap",
});

export const metadata = {
    title: "Eureka Kuwait — Voice Assistant",
    description: "Speak with Eureka's AI voice assistant. Discover electronics, home appliances and offers.",
    icons: {
        icon: "/favicon.png",
    },
};

export default function RootLayout({ children }) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body className={`${geist.variable} ${cairo.variable} font-geist antialiased`}>
                <ThemeProvider
                    attribute="class"
                    defaultTheme="dark"
                    enableSystem={false}
                    disableTransitionOnChange={false}
                >
                    {children}
                </ThemeProvider>
            </body>
        </html>
    );
}
