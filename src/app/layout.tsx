import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "STDA Drive Hub | Secure Neomorphic Workspace",
  description: "Enterprise SDTA drive repository with dual Admin & Staff consoles, Neomorphism theme, and Neon PostgreSQL database.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased min-h-screen">
        {children}
      </body>
    </html>
  );
}
