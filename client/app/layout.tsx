import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import QueryProvider from "@/provider/query-provider";
import ModalProvider from "@/provider/modal-provider";
import { ThemeProvider } from "@/provider/theme-provider";
import { Toaster } from "@/components/ui/sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "LLM Paglu",
  description: "A Multi LLM chat app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <QueryProvider>
      <html lang="en">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <ThemeProvider
            attribute={"class"}
            defaultTheme="dark"
            enableSystem={false}
            disableTransitionOnChange
          >
            <ModalProvider>{children}</ModalProvider>
            <Toaster
              position="top-right"
              richColors
              closeButton
              toastOptions={{
                classNames: {
                  toast: "rounded-lg shadow-xl border border-border",
                  title: "text-base font-semibold",
                  description: "text-sm opacity-90",
                },
              }}
            />
          </ThemeProvider>
        </body>
      </html>
    </QueryProvider>
  );
}
