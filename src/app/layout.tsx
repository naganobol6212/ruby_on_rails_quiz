import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "RubyDojo — Ruby on Rails をクイズで極める",
  description:
    "初学者から上級者まで。Ruby と Rails の本質をクイズで学べる学習プラットフォーム。",
};

// localStorage から theme を読み出して、ハイドレーション前に html に class を付ける (FOUC 回避)
const themeInitScript = `
(function () {
  try {
    var t = localStorage.getItem('rrq_theme');
    if (t === 'dark') {
      document.documentElement.classList.add('dark');
    }
  } catch (e) {}
})();
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ja"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <Script
          id="theme-init"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{ __html: themeInitScript }}
        />
      </head>
      <body className="relative min-h-full overflow-x-hidden bg-zinc-50 text-zinc-900 selection:bg-rose-500/30 dark:bg-zinc-950 dark:text-zinc-100">
        <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
          <div className="absolute -top-40 -left-40 h-[36rem] w-[36rem] rounded-full bg-rose-300/30 blur-3xl dark:bg-rose-500/10" />
          <div className="absolute top-1/2 -right-40 h-[32rem] w-[32rem] rounded-full bg-violet-300/30 blur-3xl dark:bg-violet-500/10" />
          <div className="absolute -bottom-40 left-1/3 h-[28rem] w-[28rem] rounded-full bg-fuchsia-300/30 blur-3xl dark:bg-fuchsia-500/10" />
        </div>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
