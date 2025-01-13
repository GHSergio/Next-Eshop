"use client";

import React, { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
// import debounce from "lodash.debounce";

interface SearchBarProps {
  placeholder?: string;
  height?: string | number;
  width?: string | number;
}

const SearchBar: React.FC<SearchBarProps> = ({
  placeholder = "Search for products...",
  height,
  width,
}) => {
  const router = useRouter();
  const [inputValue, setInputValue] = useState<string>("");

  // 通用搜索邏輯
  const executeSearch = useCallback(() => {
    if (inputValue.trim()) {
      router.push(`/search?q=${encodeURIComponent(inputValue.trim())}`);
    }
  }, [inputValue, router]);

  // 按下 "Enter" 鍵處理
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      executeSearch();
    }
  };

  return (
    <div
      className={`relative flex items-center rounded-md shadow-md bg-white ${
        width ? `w-${width}` : "w-full"
      } ${height ? `h-${height}` : "h-auto"} sm:mt-0 p-2`}
    >
      <input
        type="text"
        placeholder={placeholder}
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        className="flex-grow bg-transparent outline-none text-gray-700 placeholder-gray-400 text-sm sm:text-lg"
        aria-label="Search"
      />
      <button
        className="absolute right-3 text-gray-500 cursor-pointer px-2 py-1"
        onClick={executeSearch} // 使用通用搜索邏輯
        aria-label="Search"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="M10 2a8 8 0 105.5 13.65l5.85 5.85a1 1 0 101.4-1.4l-5.85-5.85A8 8 0 0010 2zm0 2a6 6 0 110 12 6 6 0 010-12z" />
        </svg>
      </button>
    </div>
  );
};

export default SearchBar;
