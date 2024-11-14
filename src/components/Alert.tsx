// components/Alert.tsx
import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store/store";
import { clearAlert } from "@/store/slice/userSlice";

const Alert: React.FC = () => {
  const dispatch = useDispatch();
  const { open, message, severity } = useSelector(
    (state: RootState) => state.user.alert
  );

  // 自動消失邏輯;
  useEffect(() => {
    if (open) {
      const timer = setTimeout(() => {
        dispatch(clearAlert());
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [open, dispatch]);

  // 如果 open 為 false，不顯示元件
  if (!open) return null;

  return (
    <>
      {open && (
        <div className="fixed top-[10%] left-[50%] transform -translate-x-1/2 z-50 ">
          <div
            className={`alert alert-${severity} shadow-lg text-center flex justify-center items-center`}
          >
            <p>{message.toString()}</p>
          </div>
        </div>
      )}
    </>
  );
};

export default Alert;
