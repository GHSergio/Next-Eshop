"use client";
import React, { useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch, RootState } from "@/store/store";
import {
  updateCartItemThunk,
  deleteCartItemThunk,
  setSelectedItems,
} from "@/store/slice/userSlice";
import Image from "next/image";
import { CartItem } from "@/types";
import CartFooter from "./CartFooter";

const CartSummary = () => {
  const dispatch: AppDispatch = useDispatch();
  const cart = useSelector((state: RootState) => state.user.cart || []);
  const selectedItems = useSelector(
    (state: RootState) => state.user.selectedItems
  );

  // 判斷商品是否被選中
  const isItemSelected = useCallback(
    (id: string) => selectedItems.some((item) => item.id === id),
    [selectedItems]
  );

  // 判斷是否Cart內商品 全被選中
  const allItemsSelected =
    selectedItems.length === cart.length && cart.length > 0;

  const handleSelectAll = useCallback(() => {
    const updatedItems = allItemsSelected ? [] : cart; // 全選或取消全選
    dispatch(setSelectedItems(updatedItems));
  }, [cart, allItemsSelected, dispatch]);

  // 處理單個商品選擇
  const handleSelectItem = useCallback(
    (item: CartItem) => {
      const isSelected = isItemSelected(item.id);
      const updatedItems = isSelected
        ? selectedItems.filter((i) => i.id !== item.id)
        : [...selectedItems, item];
      dispatch(setSelectedItems(updatedItems));
    },
    [selectedItems, dispatch, isItemSelected]
  );

  // 改變商品數量;
  const handleQuantityChange = useCallback(
    async (item: CartItem, newQuantity: number) => {
      if (newQuantity > 0) {
        await dispatch(updateCartItemThunk({ ...item, quantity: newQuantity }));
      }
    },
    [dispatch]
  );

  // 改變商品數量;
  const handleDeleteItem = useCallback(
    async (itemId: string) => {
      // 移除該商品 DB
      await dispatch(deleteCartItemThunk(itemId));

      // 同時從 selectedItems 中移除該商品
      const updatedSelectedItems = selectedItems.filter(
        (item) => item.id !== itemId
      );
      dispatch(setSelectedItems(updatedSelectedItems));
    },
    [dispatch, selectedItems]
  );

  //單個商品總額
  const singleProductTotal = (price: number, quantity: number) => {
    return price * quantity;
  };

  // console.log(cart);
  // console.log(cartItems);
  return (
    <div className="xs:p-0 md:p-4">
      {/* Header */}
      <div className="flex items-center mb-2">
        <input
          type="checkbox"
          onChange={handleSelectAll}
          className="xs:h-3 xs:w-3 md:h-4 md:w-4 rounded"
        />
        <span className="xs:ml-1 md:ml-2 xs:text-xs md:text-lg font-semibold text-textColor">
          全選
        </span>
      </div>

      {/* Main Content */}
      <div className="grid gap-4 xs:text-start  md:text-center">
        {cart.map((item) => (
          <div
            key={item.id}
            className={`grid xs:grid-cols-5 xs:grid-rows-4 md:grid-cols-12 md:grid-rows-1 items-center p-2 rounded-lg relative ${
              isItemSelected(item.id)
                ? "border-2 border-borderChecked"
                : "border border-gray-300"
            }`}
          >
            {/* Checkbox */}
            <div className="xs:col-start-1 xs:row-start-1 md:col-span-1 md:row-star-auto xs:text-start md:text-center">
              <input
                type="checkbox"
                checked={selectedItems.some(
                  (selectedItem) =>
                    selectedItem.id === item.id &&
                    selectedItem.color === item.color &&
                    selectedItem.size === item.size
                )}
                onChange={() => handleSelectItem(item)}
                className="xs:h-3 xs:w-3 md:h-4 md:w-4 focus:ring-blue-500 border-gray-300 rounded checked:border-borderChecked"
              />
            </div>

            {/* Product Image */}
            <div className="xs:col-start-1 xs:row-start-2 xs:row-span-2 xs:col-span-2 md:col-span-2 md:col-start-auto md:row-start-auto">
              <Image
                src={item.product_image}
                alt={item.product_name}
                width="300"
                height="200"
                className="object-contain h-16 w-16 sm:h-20 sm:w-20"
                priority // 優化圖片的加載 提高LCP性能
              />
            </div>

            {/* Product Info */}
            <div className="xs:col-start-3 xs:row-start-2 xs:row-span-2 xs:col-span-2 md:col-span-4 md:col-start-auto md:row-start-auto flex flex-col justify-center ">
              <h4
                className="xs:text-[0.8rem] md:text-lg font-semibold truncate"
                title={item.product_name}
              >
                {item.product_name}
              </h4>
              <p className="xs:text-[0.6rem] md:text-lg">
                {item.color || "N/A"} - {item.size || "N/A"}
              </p>
            </div>

            {/* Quantity Control */}
            <div className="xs:col-start-5 xs:row-start-4 xs:col-span-2 md:col-span-3 md:col-start-auto md:row-start-auto flex justify-center items-center xs:gap-1 md:gap-4">
              <button
                className="xs:p-[0.35rem] md:p-[0.6rem] w-2 h-2 flex justify-center items-center border rounded text-xs"
                onClick={() => handleQuantityChange(item, item.quantity - 1)}
                disabled={item.quantity <= 1}
              >
                <span className="xs:text-sm md:text-lg">-</span>
              </button>
              <span className="xs:text-[0.5rem] md:text-lg text-textColor">
                {item.quantity}
              </span>
              <button
                className="xs:p-[0.35rem] md:p-[0.6rem] w-2 h-2 flex justify-center items-center border rounded text-xs"
                onClick={() => handleQuantityChange(item, item.quantity + 1)}
              >
                <span className="xs:text-sm md:text-lg">+</span>
              </button>
            </div>

            {/* Price */}
            <p className="xs:col-start-3 xs:row-start-4  md:col-span-2 xs:text-[0.5rem] md:text-sm md:col-start-auto md:row-start-auto font-semibold">
              ${" "}
              {singleProductTotal(item.product_price, item.quantity).toFixed()}
            </p>

            {/* Remove Button */}
            <div
              onClick={() => handleDeleteItem(item.id)}
              className="absolute top-0 right-2 text-red-500 cursor-pointer"
            >
              <span className="xs:text-xs md:text-xl lg:text-3xl">×</span>
            </div>
          </div>
        ))}
      </div>

      {/* Footer 顯示數量 總價*/}
      <CartFooter />
    </div>
  );
};

export default CartSummary;
