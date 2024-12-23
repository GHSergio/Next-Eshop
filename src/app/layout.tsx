import { ReactNode } from "react";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import "@/styles/globals.css";
import ClientProvider from "@/components/ClientProvider"; // 使用客戶端的 Provider
import ClientLayout from "@/components/ClientLayout";
// 必須命名為 metadata：這是 Next.js 定義的特定名稱，系統會自動尋找並應用這個變數到SEO。
export const metadata = {
  title: "My App",
  description: "Welcome to my Next.js app!",
  keywords: ["Next.js", "SEO", "App"],
  author: "Ming Hsu",
  openGraph: {
    title: "My App",
    description: "Welcome to my Next.js app!",
    type: "website",
  },
};

// 為 children 指定 ReactNode 類型
export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        {/* 添加視窗適配的 meta */}
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
        />
      </head>
      <body className="min-h-screen flex flex-col">
        <ClientProvider>
          <header className="sticky top-0 z-50">
            <NavBar />
          </header>

          {/* 小螢幕專屬 ClientLayout & 全局AuthModal */}
          <ClientLayout>
            {/* 根據路徑 顯示pages內容 */}
            <main>{children}</main>
          </ClientLayout>

          <footer className="xs:hidden sm:block">
            <Footer />
          </footer>
        </ClientProvider>
      </body>
    </html>
  );
}
