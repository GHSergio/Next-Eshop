"use client";
import React from "react";
import Link from "next/link";

interface NavLinksProps {
  links: { id: number; title: string; rating: number }[];
}

const NavLinks: React.FC<NavLinksProps> = ({ links }) => {
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
};

export default NavLinks;
