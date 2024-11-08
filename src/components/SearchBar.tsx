"use client";

import React, { useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../store/store";
import { setSearchQuery } from "../store/slice/productSlice";
import debounce from "lodash.debounce";

interface SearchBarProps {
  height?: string | number;
  width?: string | number;
}

const SearchBar: React.FC<SearchBarProps> = ({ height, width }) => {
  const dispatch = useDispatch();
  const searchQuery = useSelector(
    (state: RootState) => state.products.searchQuery
  );

  // // 清除搜尋框內容的函數
  // const handleClearSearch = useCallback(() => {
  //   dispatch(setSearchQuery(""));
  // }, [dispatch]);

  // 使用 lodash 的 debounce 函數
  const debounceSearch = debounce((query: string) => {
    dispatch(setSearchQuery(query));
  }, 100);

  // 當輸入內容變更時觸發 debounce 搜尋
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      debounceSearch(e.target.value);
    },
    [debounceSearch]
  );

  return (
    <div
      className={`relative flex items-center rounded-md shadow-md bg-white ${
        width ? `w-${width}` : "w-full"
      } ${height ? `h-${height}` : "h-auto"} mt-10 sm:mt-0 p-2`}
    >
      <input
        type="text"
        placeholder="Search"
        value={searchQuery}
        onChange={handleChange}
        className="flex-grow bg-transparent outline-none text-gray-700 placeholder-gray-400"
        aria-label="Search"
      />
      <div className="absolute right-3 text-gray-500">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="M10 2a8 8 0 105.5 13.65l5.85 5.85a1 1 0 101.4-1.4l-5.85-5.85A8 8 0 0010 2zm0 2a6 6 0 110 12 6 6 0 010-12z" />
        </svg>
      </div>
    </div>
  );
};

export default SearchBar;
