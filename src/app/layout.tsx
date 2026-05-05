import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { ToastProvider } from "@/components/ui/toast-provider";
import { getCurrentUser } from "@/lib/auth";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "FixLocal AI",
  description:
    "Upload a photo of a local issue and generate a polished report for the right contact in 60 seconds."
};

export default async function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getCurrentUser();

  return (
    <html lang="en">
      <body className={inter.className}>
        <ToastProvider />
        <Header user={user ? { name: user.name, email: user.email } : null} />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
