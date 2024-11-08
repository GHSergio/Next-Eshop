"use client";
import React, { useCallback, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../store/store";
import {
  removeFromCart,
  updateCartItemQuantity,
} from "../../store/slice/productSlice";
import Image from "next/image";
import { SelectedItem } from "./types";

interface CartSummaryProps {
  selectAll: boolean;
  setSelectAll: (value: boolean) => void;
  selectedItems: SelectedItem[];
  setSelectedItems: (items: SelectedItem[]) => void;
}

const CartSummary: React.FC<CartSummaryProps> = ({
  selectAll,
  setSelectAll,
  selectedItems,
  setSelectedItems,
}) => {
  const dispatch = useDispatch();
  const cart = useSelector((state: RootState) => state.products.cart);

  // 購物車的商品
  const cartItems = useMemo(
    () =>
      cart.map((item) => ({
        id: item.id,
        title: item.title,
        image: item.image,
        color: item.color,
        size: item.size,
        quantity: item.quantity,
        price: item.price,
      })),
    [cart]
  );

  // 判斷商品是否被選中
  const isItemSelected = useCallback(
    (id: string, color: string, size: string) =>
      selectedItems.some(
        (item) => item.id === id && item.color === color && item.size === size
      ),
    [selectedItems]
  );

  // 清空/全選 Cart 中的所有項目
  const handleSelectAll = useCallback(() => {
    setSelectAll(!selectAll);
    setSelectedItems(selectAll ? [] : cartItems);
  }, [selectAll, setSelectAll, setSelectedItems, cartItems]);

  // 處理單個商品選擇
  // const handleSelectItem = useCallback(
  //   (id: string, color: string, size: string) => {
  //     const isSelected = isItemSelected(id, color, size);
  //     setSelectedItems(
  //       isSelected
  //         ? selectedItems.filter(
  //             (item: SelectedItem) =>
  //               !(item.id === id && item.color === color && item.size === size)
  //           )
  //         : [
  //             ...selectedItems,
  //             {
  //               id: item.id,
  //               title: item.title,
  //               image: item.image,
  //               color: item.color,
  //               size: item.size,
  //               quantity: item.quantity,
  //               price: item.price,
  //             },
  //           ]
  //     );
  //   },
  //   [isItemSelected, selectedItems, setSelectedItems]
  // );
  const handleSelectItem = useCallback(
    (item: SelectedItem) => {
      const isSelected = isItemSelected(item.id, item.color, item.size);
      setSelectedItems(
        isSelected
          ? selectedItems.filter(
              (selectedItem) =>
                !(
                  selectedItem.id === item.id &&
                  selectedItem.color === item.color &&
                  selectedItem.size === item.size
                )
            )
          : [...selectedItems, item]
      );
    },
    [isItemSelected, selectedItems, setSelectedItems]
  );

  //單個商品總額
  const singleProductTotal = (price: number, quantity: number) => {
    return (price * quantity).toFixed(2);
  };

  // 改變商品數量
  // const handleQuantityChange = useCallback(
  //   (id: string, color: string, size: string, newQuantity: number) => {
  //     if (newQuantity > 0) {
  //       dispatch(
  //         updateCartItemQuantity({ id, color, size, quantity: newQuantity })
  //       );
  //     }
  //   },
  //   [dispatch]
  // );
  const handleQuantityChange = useCallback(
    (id: string, color: string, size: string, newQuantity: number) => {
      if (newQuantity > 0) {
        dispatch(
          updateCartItemQuantity({ id, color, size, quantity: newQuantity })
        );
        setSelectedItems(
          selectedItems.map((item) =>
            item.id === id && item.color === color && item.size === size
              ? { ...item, quantity: newQuantity }
              : item
          )
        );
      }
    },
    [dispatch, setSelectedItems, selectedItems]
  );

  // 計算總金額
  const calculateTotal = useMemo(
    () =>
      cart
        .filter((item) => isItemSelected(item.id, item.color, item.size))
        .reduce((total, item) => total + item.price * item.quantity, 0),
    [cart, isItemSelected]
  );

  // 計算總數量
  const calculateItemsCount = useMemo(
    () =>
      cart
        .filter((item) => isItemSelected(item.id, item.color, item.size))
        .reduce((count, item) => count + item.quantity, 0),
    [cart, isItemSelected]
  );

  const totalAmount = Math.floor(calculateTotal);
  const shippingCost = 2;
  const discount = totalAmount > 30 ? shippingCost : 0;
  const finalTotal = totalAmount + shippingCost - discount;
  // console.log(cart);
  // console.log(cartItems);
  return (
    <div className="xs:p-0 md:p-4">
      {/* Header */}
      <div className="flex items-center mb-2">
        <input
          type="checkbox"
          checked={selectAll}
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
              isItemSelected(item.id, item.color, item.size)
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
                src={item.image}
                alt={item.title}
                width="300"
                height="200"
                className="object-contain h-16 w-16 sm:h-20 sm:w-20"
              />
            </div>

            {/* Product Info */}
            <div className="xs:col-start-3 xs:row-start-2 xs:row-span-2 xs:col-span-2 md:col-span-4 md:col-start-auto md:row-start-auto flex flex-col justify-center xs:item-start md:items-center">
              <h4
                className="xs:text-[0.8rem] md:text-lg font-semibold truncate"
                title={item.title}
              >
                {item.title}
              </h4>
              <p className="xs:text-[0.6rem] md:text-lg">
                {item.color || "N/A"} - {item.size || "N/A"}
              </p>
            </div>

            {/* Quantity Control */}
            <div className="xs:col-start-5 xs:row-start-4 xs:col-span-2 md:col-span-3 md:col-start-auto md:row-start-auto flex justify-center items-center xs:gap-1 md:gap-4">
              <button
                className="xs:p-[0.35rem] md:p-[0.6rem] w-2 h-2 flex justify-center items-center border rounded text-xs"
                onClick={() =>
                  handleQuantityChange(
                    item.id,
                    item.color,
                    item.size,
                    item.quantity - 1
                  )
                }
                disabled={item.quantity <= 1}
              >
                <span className="xs:text-sm md:text-lg">-</span>
              </button>
              <span className="xs:text-[0.5rem] md:text-lg text-textColor">
                {item.quantity}
              </span>
              <button
                className="xs:p-[0.35rem] md:p-[0.6rem] w-2 h-2 flex justify-center items-center border rounded text-xs"
                onClick={() =>
                  handleQuantityChange(
                    item.id,
                    item.color,
                    item.size,
                    item.quantity + 1
                  )
                }
              >
                <span className="xs:text-sm md:text-lg">+</span>
              </button>
            </div>

            {/* Price */}
            <p className="xs:col-start-3 xs:row-start-4  md:col-span-2 xs:text-[0.5rem] md:text-sm md:col-start-auto md:row-start-auto font-semibold">
              $ {singleProductTotal(item.price, item.quantity)}
            </p>

            {/* Remove Button */}
            <div
              onClick={() =>
                dispatch(
                  removeFromCart({
                    id: item.id,
                    color: item.color,
                    size: item.size,
                  })
                )
              }
              className="absolute top-0 right-2 text-red-500 cursor-pointer"
            >
              <span className="xs:text-xs md:text-xl lg:text-3xl">×</span>
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="mt-4 space-y-3 text-right text-sm">
        <p>共 {calculateItemsCount} 件商品</p>
        <p>商品金額：${totalAmount}</p>
        <p>運費：${shippingCost}</p>
        <p>運費折抵：-${discount}</p>
        <hr className="my-2" />
        <h4 className="text-lg font-semibold">小計：${finalTotal}</h4>
      </div>
    </div>
  );
};

export default CartSummary;
