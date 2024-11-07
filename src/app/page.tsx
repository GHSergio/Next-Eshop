// src/app/page.tsx
import React from "react";
import MainContent from "../components/MainContent";
import "../styles/globals.css";
// import LoginPage from "./login/page"; // 引入登入頁面組件

const HomePage: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen w-full">
      <MainContent />
      {/* <LoginPage /> */}
    </div>
  );
};

export default HomePage;
