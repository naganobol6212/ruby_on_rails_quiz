import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { SiteHeader } from "@/components/SiteHeader";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CodeDojo — 複数の言語/FW をクイズで横断学習",
  description:
    "Ruby/Rails・JavaScript・TypeScript・React・Next.js などをクイズで学べる学習プラットフォーム。構造化ジャーナル機能付き。",
};

const themeInitScript = `(function(){try{var t=localStorage.getItem('rrq_theme');var root=document.documentElement;if(t==='dark'){root.classList.add('dark');root.style.colorScheme='dark';}else{root.style.colorScheme='light';}}catch(e){}})();`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ja"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="relative min-h-full overflow-x-hidden bg-zinc-50 text-zinc-900 selection:bg-rose-500/30 dark:bg-zinc-950 dark:text-zinc-100">
        <script
          dangerouslySetInnerHTML={{ __html: themeInitScript }}
        />
        <ThemeProvider>
          <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
            <div className="absolute -top-40 -left-40 h-[36rem] w-[36rem] rounded-full bg-rose-300/30 blur-3xl dark:bg-rose-500/10" />
            <div className="absolute top-1/2 -right-40 h-[32rem] w-[32rem] rounded-full bg-violet-300/30 blur-3xl dark:bg-violet-500/10" />
            <div className="absolute -bottom-40 left-1/3 h-[28rem] w-[28rem] rounded-full bg-fuchsia-300/30 blur-3xl dark:bg-fuchsia-500/10" />
          </div>
          <SiteHeader />
          <main>{children}</main>
          <footer className="mt-16 border-t border-zinc-200/70 py-8 text-center text-[11px] text-zinc-500 dark:border-white/5 dark:text-zinc-500">
            <div className="mx-auto max-w-5xl px-6">
              <p>
                💎 RubyDojo · 学習データは LocalStorage に保存されます
              </p>
            </div>
          </footer>
        </ThemeProvider>
      </body>
    </html>
  );
}
