"use client";
import React, { useEffect, useState, useCallback } from "react";
import { Product, CartItem } from "@/types";
import { fetchProductById } from "@/api";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import { addToCartThunk, setAlert } from "@/store/slice/userSlice";
import Image from "next/image";

interface ProductDetailProps {
  params: {
    id: string;
  };
}

const ProductDetail: React.FC<ProductDetailProps> = ({ params }) => {
  // id 自動由 Next.js 的動態路由系統注入到 params。
  // 通過 params.id 提取該 id。
  const { id } = params;
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [quantity, setQuantity] = useState<number>(1);
  // 從使用者資訊 獲取使用者user_id
  const userId =
    useSelector((state: RootState) => state.user.userInfo?.id) ||
    JSON.parse(localStorage.getItem("userData") || "{}").id;
  const dispatch: AppDispatch = useDispatch();

  useEffect(() => {
    const loadProduct = async () => {
      try {
        const fetchedProduct = await fetchProductById(Number(id));
        // 模擬新增 sizes 和 colors 屬性
        const updatedProduct = {
          ...fetchedProduct,
          sizes: ["S", "M", "L", "XL"],
          colors: ["Red", "Blue", "Green", "Yellow"],
        };
        setProduct(updatedProduct);
        setSelectedColor(updatedProduct.colors[0]);
        setSelectedSize(updatedProduct.sizes[0]);
      } catch (err: unknown) {
        setError("商品資訊獲取失敗");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [id]);

  const handleAddToCart = useCallback(() => {
    if (!userId) {
      // console.error("無法獲取用戶ID，請先登入！");
      dispatch(
        setAlert({
          open: true,
          message: "請先登入，才能添加至購物車",
          severity: "warning",
        })
      );
      return;
    }

    if (product && userId) {
      const cartItem: CartItem = {
        id: `${product.id}-${selectedColor}-${selectedSize}`, // 用於區分不同的顏色和尺寸
        user_id: userId, // 確保這裡傳入當前登入用戶的 ID
        product_id: String(product.id),
        product_name: product.title,
        product_price: product.price,
        product_image: product.images[0],
        color: selectedColor,
        size: selectedSize,
        quantity,
        stock: product.stock,
        rating: product.rating,
        added_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      console.log("即將添加至購物車的商品:", cartItem);
      // 將完整數據傳遞給 Thunk
      dispatch(addToCartThunk(cartItem));
    }
  }, [userId, product, selectedColor, selectedSize, quantity, dispatch]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent border-solid rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen text-xl text-red-500">
        {error}
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex justify-center items-center h-screen text-xl text-gray-700">
        找不到該商品資訊
      </div>
    );
  }

  const stockOptions =
    product.stock > 0
      ? Array.from({ length: product.stock }, (_, i) => i + 1)
      : [];

  const commonStyles = "mb-4 text-textColor";
  const labelStyles = "mr-2 font-semibold xs:text-[0.8rem] sm:text-lg";
  const selectStyles =
    "text-black mt-2 w-full p-2 border rounded-md cursor-pointer";

  return (
    <div className="max-w-5xl mx-auto p-4">
      {/* <AuthModal /> */}
      <div className="flex flex-col md:flex-row gap-6">
        {/* Image */}
        <div className="flex-1 flex justify-center items-center border-2 border-yellow-100 rounded-lg">
          <Image
            src={product.images[0] || "https://via.placeholder.com/150"}
            alt={product.title || "Default Title"}
            width={500}
            height={400}
            style={{ width: "auto", height: "100%" }}
            className="object-contain bg-[#DDF0E9]"
            // priority // 優化圖片的加載 提高LCP性能
          />
        </div>

        {/* Product Content */}
        <div className="flex-1">
          <h1 className="font-bold mb-4 xs:text-[1rem] sm:text-xl">
            {product.title}
          </h1>
          <hr className="my-4" />

          {/* color */}
          <div className={commonStyles}>
            <label className={labelStyles}>Color</label>
            <select
              value={selectedColor}
              onChange={(e) => setSelectedColor(e.target.value)}
              className={selectStyles}
            >
              {product.colors?.map((color) => (
                <option key={color} value={color}>
                  {color}
                </option>
              ))}
            </select>
          </div>

          {/* Size */}
          <div className="mb-4">
            <label className={labelStyles}>Size</label>
            <select
              value={selectedSize}
              onChange={(e) => setSelectedSize(e.target.value)}
              className={selectStyles}
            >
              {product.sizes?.map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
          </div>

          {/* Price */}
          <div className={commonStyles}>
            <span className={labelStyles}>Price</span>
            <span className="text-red-500 text-xl">
              ${product.price.toFixed()}
            </span>
          </div>

          {/* Stock */}
          <div className={commonStyles}>
            <span className={labelStyles}>Stock</span>
            <span className="text-yellow-200 text-xl">{product.stock} 件</span>
          </div>

          {/* Rating */}
          <div className={commonStyles}>
            <span className={labelStyles}>Rating</span>
            <span className="text-yellow-500 text-xl">★</span>
            <span className="text-black-500 text-xl">
              {product.rating.toFixed(1)}
            </span>{" "}
          </div>

          <hr className="my-4" />

          {/* Quantity */}
          <div className={commonStyles}>
            <label className={labelStyles}>Quantity</label>
            <select
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              className={selectStyles}
              disabled={stockOptions.length === 0}
            >
              {stockOptions.length > 0 ? (
                stockOptions.map((num) => (
                  <option key={num} value={num}>
                    {num}
                  </option>
                ))
              ) : (
                <option value={0}>Out of Stock</option>
              )}
            </select>
          </div>

          {/* Add to Cart Button */}
          <button
            onClick={handleAddToCart}
            className="bg-blue-500 text-white py-2 px-4 rounded-md w-full hover:bg-blue-600 transition duration-300"
          >
            {product.stock > 0 ? "Add to Cart" : "Out of Stock"}
          </button>
        </div>
      </div>
      <div className="mt-8">
        <h3 className="font-semibold mb-2">Product Description</h3>
        <p className="text-textColor">{product.description}</p>
      </div>

      <hr className="my-4" />

      {/* Reviews Section */}
      <div className="mt-8">
        <h3 className="font-semibold text-xl mb-4">Customer Reviews</h3>
        {product.reviews && product.reviews.length > 0 ? (
          <div>
            <p className="mb-4">
              <span className="font-semibold">Average Rating:</span>{" "}
              {(
                product.reviews.reduce(
                  (sum, review) => sum + review.rating,
                  0
                ) / product.reviews.length
              ).toFixed(1)}{" "}
              ({product.reviews.length} Reviews)
            </p>

            {/* 評論 */}
            <ul className="space-y-4">
              {product.reviews.map((review, index) => (
                <li key={index} className="border p-4 rounded-md shadow-sm">
                  <div className="flex items-center mb-2">
                    <span className="text-yellow-500 mr-2">★</span>
                    <span className="text-white font-medium">
                      {review.rating}
                    </span>
                  </div>
                  <p className="text-white-700">{review.comment}</p>
                  <p className="text-white-500 text-sm mt-1">
                    - {review.reviewerName},{" "}
                    {new Date(review.date).toLocaleDateString()}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <p className="text-white">No reviews yet for this product.</p>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;
