// "use client";

import React, { Suspense } from "react";
import SearchPageContent from "@/components/SearchPageContent";

const SearchPage: React.FC = () => (
  <Suspense fallback={<p>Loading search results...</p>}>
    <SearchPageContent />
  </Suspense>
);

export default SearchPage;
