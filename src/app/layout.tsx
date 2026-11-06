import type { Metadata } from "next";
import { Suspense } from "react";
import { Fraunces, Inter } from "next/font/google";
import "./globals.css";
import { Footer } from "@/components/footer";
import { NavbarFallback } from "@/components/navbar";
import { AppNavbar } from "@/components/app-navbar";
import { Toaster } from "@/components/ui/toast";
import { site } from "@/lib/site";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: `${site.name} | A small online library`,
    template: `${site.name} | %s`,
  },
  description: site.description,
  applicationName: site.name,
  keywords: ["online library", "books", "borrow books", "BookNook"],
};

const themeScript = `(function(){try{var stored=localStorage.getItem("booknook-theme");var dark=stored?stored==="dark":true;document.documentElement.classList.toggle("dark",dark);document.documentElement.style.colorScheme=dark?"dark":"light";}catch(e){}})();`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      data-scroll-behavior="smooth"
      className={`dark ${inter.variable} ${fraunces.variable} h-full antialiased`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="flex min-h-full flex-col">
        <Suspense fallback={<NavbarFallback />}>
          <AppNavbar />
        </Suspense>
        <main className="flex flex-1 flex-col">{children}</main>
        <Footer />
        <Toaster />
      </body>
    </html>
  );
}
