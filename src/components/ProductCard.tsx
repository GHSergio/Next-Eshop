"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";

interface ProductCardProps {
  id: number;
  image: string;
  title: string;
  price: number;
  discountPrice?: number | undefined;
  rating: number;
}

const ProductCard: React.FC<ProductCardProps> = ({
  id,
  image,
  title,
  price,
  discountPrice,
  rating,
}) => {
  const renderStars = () => {
    return (
      <div className="flex items-center space-x-1">
        <span className="text-yellow-500 text-sm">★</span>
        <span className="text-black-500 text-md">{rating.toFixed(1)}</span>
      </div>
    );
  };

  return (
    // onClick 商品Card 導航到商品的詳細頁
    // id 通過 URL 動態參數傳遞
    <Link href={`/products/${id}`} passHref title={title}>
      <div className="card xs:h-60 sm:h-full p-4 rounded-lg transition-bg duration-300 hover:bg-productHoverBgc cursor-pointer">
        <div className="bg-imageBgc w-full h-40 overflow-hidden rounded-lg">
          {/* 使用 Next.js 的 Image 來優化圖片 */}
          <Image
            src={image || "https://via.placeholder.com/150"}
            alt={title || "Default Title"}
            width={500}
            height={500}
            className="object-contain w-full h-full"
            // priority
            loading="lazy"
          />
        </div>

        {/* 內容區域 */}
        <div className="xs:h-20 mt-2 flex-1">
          {/* 顯示產品標題，並設置溢出效果 */}
          <div
            // title={title}
            className="xs:text-[0.8rem] sm:text-lg font-semibold truncate text-titleColor"
          >
            {title}
          </div>

          {/* 價格顯示，區分是否有折扣價格 */}
          <p className="xs:text-[0.8rem] sm:text-lg text-priceColor font-semibold">
            {discountPrice ? (
              <>
                <span className="line-through text-gray-500">
                  ${Math.ceil(price)}
                </span>{" "}
                <span className="text-accent">${discountPrice}</span>
              </>
            ) : (
              <>
                <span className="mr-1">$</span>
                <span>{Math.ceil(price)}</span>
              </>
            )}
          </p>

          {/* 評分 */}
          <div className="flex items-center xs:text-[0.8rem] sm:text-lg text-secondary">
            {renderStars()}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
