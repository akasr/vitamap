import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "VitaMap",
  description: "An app for users to find availability of medicine in nearby pharmacies and for pharmacies to manage their inventory.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
