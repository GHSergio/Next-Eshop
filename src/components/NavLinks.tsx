"use client";
import React from "react";
import Link from "next/link";

interface NavLinksProps {
  links: string[];
}

const NavLinks: React.FC<NavLinksProps> = ({ links }) => {
  return (
    <div className="flex">
      <>
        {links.map((link, index) => (
          <React.Fragment key={link}>
            <Link
              href={`/category/${link.toUpperCase()}`}
              className="no-underline flex items-center justify-center h-full xs:px-1 xs1:px-1.5 xs2:px-2  md:px-4 lg:px-5 xl:px-6"
            >
              <span className="font-bold text-xs sm:text-xs md:text-xs lg:text-xl">
                {link.includes("women's")
                  ? "WOMEN"
                  : link.includes("men's")
                  ? "MEN"
                  : link.toUpperCase()}
              </span>
            </Link>
            {index < links.length - 1 && <span className="xs:mx-0">|</span>}
          </React.Fragment>
        ))}
      </>
    </div>
  );
};

export default NavLinks;
