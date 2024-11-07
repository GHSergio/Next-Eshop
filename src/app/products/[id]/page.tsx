"use client";
import React, { useEffect, useState, useCallback } from "react";
import { Product, fetchProductById } from "@/api";
import { useDispatch } from "react-redux";
import { addToCart } from "@/store/slice/productSlice";
import Image from "next/image";

interface ProductDetailProps {
  params: {
    id: string;
  };
}

const ProductDetail: React.FC<ProductDetailProps> = ({ params }) => {
  const { id } = params;
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [quantity, setQuantity] = useState<number>(1);

  const dispatch = useDispatch();

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
      } catch (err) {
        setError("商品資訊獲取失敗");
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [id]);

  const handleAddToCart = useCallback(() => {
    if (product) {
      const uniqueId = `${product.id}-${selectedColor}-${selectedSize}`;
      dispatch(
        addToCart({
          id: uniqueId,
          title: product.title,
          price: product.price,
          quantity,
          image: product.image,
          color: selectedColor,
          size: selectedSize,
        })
      );
    }
  }, [product, quantity, selectedColor, selectedSize, dispatch]);

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

  return (
    <div className="max-w-5xl mx-auto p-4">
      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex-1 flex justify-center items-center">
          <Image
            src={product.image}
            alt={product.title}
            width={500}
            height={400}
            className="object-contain"
          />
        </div>
        {/* Product Content */}
        <div className="flex-1">
          <h1 className="font-bold mb-4">{product.title}</h1>
          <hr className="my-4" />
          {/* color */}
          <div className="mb-4">
            <label className="block mb-2 font-semibold ">Color</label>
            <select
              value={selectedColor}
              onChange={(e) => setSelectedColor(e.target.value)}
              className="w-full p-2 border rounded-md"
            >
              {product.colors?.map((color) => (
                <option key={color} value={color}>
                  {color}
                </option>
              ))}
            </select>
          </div>
          {/* Size */}
          <div className="mb-4 ">
            <label className="block mb-2 font-semibold ">Size</label>
            <select
              value={selectedSize}
              onChange={(e) => setSelectedSize(e.target.value)}
              className="w-full p-2 border rounded-md "
            >
              {product.sizes?.map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
          </div>
          {/* Price */}
          <div className="text-xl font-semibold mb-4 text-textColor">
            Price: ${product.price}
          </div>
          <hr className="my-4" />
          {/* Quantity */}
          <div className="flex items-center gap-4 mb-6">
            <div>
              <label className="block mb-2 font-semibold ">Quantity</label>
              <select
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                className="w-20 p-2 border rounded-md"
              >
                {[1, 2, 3, 4, 5].map((num) => (
                  <option key={num} value={num}>
                    {num}
                  </option>
                ))}
              </select>
            </div>
          </div>
          {/* Add to Cart Button */}
          <button
            onClick={handleAddToCart}
            className="bg-blue-500 text-white py-2 px-4 rounded-md w-full hover:bg-blue-600 transition duration-300"
          >
            Add to Cart
          </button>
        </div>
      </div>
      <div className="mt-8">
        <h3 className=" font-semibold mb-2">Product Description</h3>
        <p className="text-textColor">{product.description}</p>
      </div>
    </div>
  );
};

export default ProductDetail;
