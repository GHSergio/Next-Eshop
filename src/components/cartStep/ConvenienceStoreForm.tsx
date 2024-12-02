"use client";
import React, { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { setStoreInfo, setErrors } from "@/store/slice/userSlice";
interface ConvenienceStoreFormProps {
  submitted: boolean;
}

const ConvenienceStoreForm: React.FC<ConvenienceStoreFormProps> = ({
  submitted,
}) => {
  const dispatch = useDispatch();

  const storeInfo = useSelector((state: RootState) => state.user.storeInfo);
  const errors = useSelector((state: RootState) => state.user.errors);

  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = event.target;
      console.log(name, value);
      dispatch(setStoreInfo({ ...storeInfo, [name]: value }));
      // 動態地設置 name 對應的錯誤狀態，判斷該輸入框的值是否為空
      dispatch(
        setErrors({
          ...errors,
          store: { ...errors.store, [name]: value.trim() === "" },
        })
      );
    },
    [dispatch, errors, storeInfo]
  );

  const handleSelectChange = useCallback(
    (event: React.ChangeEvent<HTMLSelectElement>) => {
      const { name, value } = event.target;

      // 深拷貝當前的 `errors` 並修改其中的 `store`
      // 動態地設置 name 對應的錯誤狀態，判斷該輸入框的值是否為空
      const newStoreErrors = {
        ...errors.store,
        [name]: value.trim() === "",
      };
      dispatch(
        setErrors({
          ...errors, // 保留其他錯誤
          store: newStoreErrors, // 僅更新 delivery 部分
        })
      );

      dispatch(setStoreInfo({ ...storeInfo, [name]: value }));
    },
    [errors, storeInfo, dispatch]
  );

  return (
    <>
      <h2 className="text-lg font-semibold mb-4">超商取貨資訊</h2>
      <div className="mb-4">
        <label className="block font-medium mb-1" htmlFor="fullName">
          姓名
        </label>
        <input
          type="text"
          id="fullName"
          name="fullName"
          placeholder="請輸入取件人姓名"
          value={storeInfo.fullName}
          onChange={handleChange}
          className={`w-full px-3 py-2 border ${
            submitted && errors.store.fullName
              ? "border-red-500"
              : "border-gray-300"
          } rounded`}
        />
        {submitted && errors.store.fullName && (
          <p className="text-red-500 text-sm mt-1">姓名為必填項</p>
        )}
      </div>

      {/* 手機號碼 */}
      <div className="mb-4">
        <label className="block font-medium mb-1" htmlFor="phone">
          手機
        </label>
        <input
          type="tel"
          id="phone"
          name="phone"
          placeholder="請輸入聯絡電話"
          value={storeInfo.phone}
          onChange={handleChange}
          className={`w-full px-3 py-2 border ${
            submitted && errors.store.phone
              ? "border-red-500"
              : "border-gray-300"
          } rounded`}
        />
        {submitted && errors.store.phone && (
          <p className="text-red-500 text-sm mt-1">請輸入有效的手機號碼</p>
        )}
      </div>

      {/* 超商取貨地址選擇 */}
      <div className="mb-4">
        <label className="block font-medium mb-1" htmlFor="store">
          取貨門市
        </label>
        <select
          id="store"
          name="store"
          value={storeInfo.store}
          onChange={handleSelectChange}
          className={`w-full px-3 py-2 border ${
            submitted && errors.store.store
              ? "border-red-500"
              : "border-gray-300"
          } rounded`}
        >
          <option value="">選擇門市</option>
          <option value="7-11 永康店">7-11 永康店</option>
          <option value="7-11 忠孝店">7-11 忠孝店</option>
        </select>
        {submitted && errors.store.store && (
          <p className="text-red-500 text-sm mt-1">取貨門市為必填項</p>
        )}
      </div>
    </>
  );
};

export default ConvenienceStoreForm;
