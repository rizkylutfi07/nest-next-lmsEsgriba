import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import { Providers } from "./providers";
import { cn } from "@/lib/utils";
import { RoleProvider } from "./(dashboard)/role-context";

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta",
  display: "swap",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
});

export const metadata: Metadata = {
  title: "Egriba | Frontend",
  description:
    "LMS & school management front-end dengan tema elegan modern berbasis Next.js.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body
        className={cn(
          "min-h-screen bg-background text-foreground antialiased",
          plusJakarta.variable,
          geistMono.variable,
        )}
      >
        <RoleProvider>
          <Providers>{children}</Providers>
        </RoleProvider>
      </body>
    </html>
  );
}
