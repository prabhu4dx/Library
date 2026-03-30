import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";
import HomeButton from "@/app/components/HomeButton";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700", "800", "900"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    template: "%s | Library",
    default: "Library — Research & Interactive Visualizations",
  },
  description:
    "A personal knowledge library of research and interactive visualizations on AI, design systems, and technology.",
  openGraph: {
    title: "Library — Research & Interactive Visualizations",
    description:
      "A personal knowledge library of research and interactive visualizations on AI and design systems.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${playfair.variable} ${inter.variable}`}
    >
      <body>
        <HomeButton />
        {children}
      </body>
    </html>
  );
}
