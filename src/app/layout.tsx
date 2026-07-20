import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SENSO TECH DESIGN & AUTOMATION (STDA) | Secure Workspace",
  description: "SENSO TECH DESIGN & AUTOMATION enterprise drive repository with dual Admin & Staff consoles, Neomorphism theme, and Neon PostgreSQL database.",
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
