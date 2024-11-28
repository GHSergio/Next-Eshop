// src/app/page.tsx
"use client";
import React from "react";
import MainContent from "../components/MainContent";
import "../styles/globals.css";

const HomePage: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen w-full">
      <MainContent />
    </div>
  );
};

export default HomePage;
