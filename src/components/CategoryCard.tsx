import React from "react";
// import { Category } from "@/types/productTypes";
import Link from "next/link";
import Image from "next/image";

interface CategoryCardProps {
  name: string;
  slug: string;
  url: string;
  image?: string; // 接收圖片 URL
}

const CategoryCard: React.FC<CategoryCardProps> = ({ name, slug, image }) => {
  return (
    <Link href={`/category/${slug}`} passHref title={name}>
      <div className="bg-[#5D91A8] overflow-hidden hover:shadow-md border-2 border-yellow-100 rounded-lg ">
        {/* 分類圖片 */}
        <div className="h-36 sm:h-48 lg:h-56 xl:h-64 overflow-hidden p-4 border-b-2 border-yellow-100">
          <Image
            src={image || "https://via.placeholder.com/150?text=No+Image"}
            alt={name || "Default Title"}
            width={500}
            height={500}
            // style={{ width: "auto" }} // 添加自適應樣式
            className="object-contain w-full h-full bg-[#DDF0E9]"
            priority
          />
        </div>
        {/* 分類名稱 */}
        <div className="p-4 text-center">
          <h2 className="xs:text-[0.6rem] sm:text-lg font-semibold capitalize">
            {name}
          </h2>
        </div>
      </div>
    </Link>
  );
};

export default CategoryCard;
