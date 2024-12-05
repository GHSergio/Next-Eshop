import { useSelector, useDispatch } from "react-redux";
import { useMemo, useEffect } from "react";
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
  const shippingCost = useSelector(
    (state: RootState) => state.user.shippingCost
  );

  // 計算總數量
  const calculateItemsCount = useMemo(
    () => selectedItems.reduce((count, item) => count + item.quantity, 0),
    [selectedItems]
  );

  // 計算總金額
  const totalAmount = useMemo(
    () =>
      selectedItems.reduce(
        (sum, item) => sum + Math.ceil(item.product_price) * item.quantity,
        0
      ),
    [selectedItems]
  );

  // 動態調整運費折抵
  useEffect(() => {
    let adjustedShippingCost = shippingCost;

    switch (selectedPayment) {
      case "7-11":
      case "family":
        adjustedShippingCost = totalAmount > 100 ? 0 : shippingCost;
        break;
      case "delivery":
      case "credit":
        adjustedShippingCost = totalAmount > 120 ? 0 : shippingCost;
        break;
      default:
        adjustedShippingCost = shippingCost;
    }

    dispatch(setShippingCost(adjustedShippingCost));
  }, [selectedPayment, totalAmount, shippingCost, dispatch]);

  // 計算最終金額
  const finalTotal = useMemo(
    () => totalAmount + shippingCost,
    [totalAmount, shippingCost]
  );

  return {
    calculateItemsCount,
    totalAmount,
    shippingCost,
    finalTotal,
  };
};

export default useCartCalculations;
