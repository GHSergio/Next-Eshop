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
      <body className="min-h-screen flex flex-col">
        <ClientProvider>
          <header className="sticky top-0 z-50">
            <NavBar />
          </header>

          {/* 部份小螢幕專屬 ClientLayout */}
          <ClientLayout>
            {/* 切換路徑 頁面被渲染的位置 */}
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
