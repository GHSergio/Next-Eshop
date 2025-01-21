"use client";
import React from "react";
import Link from "next/link";

interface NavLinksProps {
  links: { id: number; title: string; rating: number }[];
}

const NavLinks: React.FC<NavLinksProps> = React.memo(({ links }) => {
  // console.log("NavLinks rendered");

  return (
    <div className="flex space-x-4">
      {links.map((link) => (
        <Link
          key={link.id}
          href={`/products/${link.id}`}
          title={link.title}
          className="md:text-[0.8rem] lg:text-lg font-medium hover:underline truncate md:max-w-[60px] lg:max-w-[120px] whitespace-nowrap overflow-hidden"
        >
          {link.title}
        </Link>
      ))}
    </div>
  );
});

// 設置 displayName，方便在 React DevTools 中調試
NavLinks.displayName = "NavLinks";

export default NavLinks;
