"use client";
import Link from "next/link";
import Image from "next/image";

interface ProductCardProps {
  id: number;
  image: string;
  title: string;
  price: number;
  discountPrice: number | undefined;
}

const ProductCard: React.FC<ProductCardProps> = ({
  id,
  image,
  title,
  price,
  discountPrice,
}) => {
  return (
    // onClick 商品Card 導航到商品的詳細頁
    // id 通過 URL 動態參數傳遞
    <Link href={`/products/${id}`} passHref title={title}>
      <div className="card p-6 rounded-lg shadow-md transition-all duration-300 hover:shadow-lg hover:bg-cardHoverBgc cursor-pointer">
        <div className="w-full h-48 overflow-hidden">
          {/* 使用 Next.js 的 Image 來優化圖片 */}
          <Image
            src={image || "/path/to/default-image.jpg"}
            alt={title || "Default Title"}
            width={300}
            height={200}
            className="object-contain w-full h-full"
            priority
          />
        </div>

        {/* 內容區域 */}
        <div className="p-4 flex-1">
          {/* 顯示產品標題，並設置溢出效果 */}
          <div
            // title={title}
            className="text-sm font-semibold truncate text-foreground"
          >
            {title}
          </div>

          {/* 價格顯示，區分是否有折扣價格 */}
          <p className="text-xs mt-2 text-secondary">
            {discountPrice ? (
              <>
                <span className="line-through text-gray-500">
                  ${price.toFixed()}
                </span>{" "}
                <span className="text-accent">${discountPrice}</span>
              </>
            ) : (
              `$${price.toFixed()}`
            )}
          </p>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
