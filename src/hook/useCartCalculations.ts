import { useSelector, useDispatch } from "react-redux";
import { useMemo } from "react";
import { RootState } from "@/store/store";
import { setShippingCost } from "@/store/slice/userSlice";

const useCartCalculations = () => {
  const dispatch = useDispatch();
  const selectedItems = useSelector(
    (state: RootState) => state.user.selectedItems
  );
  const selectedPayment = useSelector(
    (state: RootState) => state.user.selectedPayment
  );

  // 計算商品總數量
  const product_amount = useMemo(
    () => selectedItems.reduce((count, item) => count + item.quantity, 0),
    [selectedItems]
  );

  // 計算商品金額
  const product_price = useMemo(
    () =>
      selectedItems.reduce(
        (sum, item) => sum + Math.ceil(item.product_price) * item.quantity,
        0
      ),
    [selectedItems]
  );

  // 運費和免運條件
  const { threshold, baseShippingCost } = useMemo(() => {
    if (selectedPayment === "c_store") {
      return { threshold: 100, baseShippingCost: 10 };
    } else if (selectedPayment === "delivery" || selectedPayment === "credit") {
      return { threshold: 120, baseShippingCost: 15 };
    }
    return { threshold: 0, baseShippingCost: 0 };
  }, [selectedPayment]);

  // 判斷是否免運
  const isFreeShipping = product_price >= threshold;

  // 剩餘金額以達免運
  const remainingToFreeShipping = !isFreeShipping
    ? threshold - product_price
    : 0;

  // 實際運費
  const shippingCost = isFreeShipping ? 0 : baseShippingCost;

  // 寫入 Redux 狀態
  useMemo(() => {
    dispatch(setShippingCost(shippingCost));
  }, [shippingCost, dispatch]);

  // 最終總金額
  const finalTotal = product_price + shippingCost;

  return {
    product_amount,
    product_price,
    shippingCost,
    remainingToFreeShipping,
    finalTotal,
  };
};

export default useCartCalculations;
