"use client";
import React from "react";
import useCartCalculations from "@/hook/useCartCalculations";

interface CartFooterProps {
  showRemainingShippingMessage?: boolean;
}

const CartFooter: React.FC<CartFooterProps> = ({
  showRemainingShippingMessage = true,
}) => {
  const {
    product_amount,
    product_price,
    shippingCost,
    remainingToFreeShipping,
    finalTotal,
  } = useCartCalculations();

  return (
    <div className="mt-4 space-y-3 text-right text-sm">
      <p>共 {product_amount} 件商品</p>
      <p>商品金額：$ {product_price.toFixed()}</p>
      <p>運費： $ {shippingCost.toFixed()}</p>
      {showRemainingShippingMessage && remainingToFreeShipping > 0 && (
        <p className="text-red-500">
          還差 $ {remainingToFreeShipping.toFixed()} 可免運費
        </p>
      )}
      {/* <p>活動折抵：-${discount}</p> */}
      <hr className="my-2" />
      <h4 className="text-lg font-semibold">小計：${finalTotal.toFixed()}</h4>
    </div>
  );
};

export default CartFooter;
