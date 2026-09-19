import type { Metadata, Viewport } from "next";
import "./globals.css";
import SessionProvider from "@/components/SessionProvider";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Software Development — Open-Source Organization",
  description:
    "Official website of the Software Development organization — we build open-source tools, plugins and utilities.",
  openGraph: {
    title: "Software Development — Open-Source Organization",
    description:
      "Official website of the Software Development organization — we build open-source tools, plugins and utilities.",
    url: "https://github.com/0softwaredevelopment0",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#00d4ff",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css"
        />
      </head>
      <body>
        <SessionProvider>
          <Navbar />
          <main className="pt-[70px]">{children}</main>
          <Footer />
        </SessionProvider>
      </body>
    </html>
  );
}
