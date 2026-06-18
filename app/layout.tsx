import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "Developer Studio",
    template: "%s | Developer Studio",
  },
  description:
    "A personal software studio platform — projects, journey, and creations by a self-taught Fullstack Developer.",
  openGraph: {
    title: "Developer Studio",
    description:
      "A personal software studio platform — projects, journey, and creations.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} antialiased`}>
        {children}
        <Toaster theme="dark" />
      </body>
    </html>
  );
}
