// "use client";
// import React, { useState } from "react";
// import { useSelector, useDispatch } from "react-redux";
// import { RootState, AppDispatch } from "@/store/store";
// import {
//   fetchUserData,
//   setAlert,
//   updateUserDataThunk,
// } from "@/store/slice/userSlice";

// const UserProfile: React.FC = () => {
//   const dispatch: AppDispatch = useDispatch();
//   const userInfo = useSelector((state: RootState) => state.user.userInfo);
//   const addresses = useSelector((state: RootState) => state.user.addresses);
//   const stores = useSelector((state: RootState) => state.user.stores);

//   // console.log("使用者資訊: ", userInfo);
//   // console.log("常用收件地址: ", addresses, "常用取貨門市: ", stores);

//   // 本地狀態管理編輯模式
//   const [editingField, setEditingField] = useState<string | null>(null);
//   const [tempValue, setTempValue] = useState<string>("");
//   const [error, setError] = useState<string | null>(null);

//   // 驗證input
//   const validateInput = (field: string, value: string): string | null => {
//     switch (field) {
//       case "user_name":
//         return value.trim() === "" ? "姓名不能為空" : null;
//       case "phone":
//         return /^\d{10}$/.test(value) ? null : "請輸入有效的10位手機號碼";
//       default:
//         return null;
//     }
//   };

//   // 切換為編輯模式
//   const handleEdit = (field: string, currentValue: string) => {
//     setEditingField(field);
//     setTempValue(currentValue);
//     setError(null);
//   };

//   // 提交修改
//   const handleSave = async (field: string) => {
//     // 檢查 field 與 value 是否通過驗證
//     const validationError = validateInput(field, tempValue);
//     if (validationError) {
//       setError(validationError);
//       return;
//     }

//     setError(null);

//     try {
//       await dispatch(updateUserDataThunk({ field, value: tempValue }));
//       dispatch(
//         setAlert({ open: true, message: "修改成功！", severity: "success" })
//       );
//       dispatch(fetchUserData()); // 重新拉取最新數據
//       setEditingField(null);
//     } catch (error) {
//       console.error("更新失敗：", error);
//       dispatch(
//         setAlert({ open: true, message: "修改發生錯誤！", severity: "error" })
//       );
//     }
//   };

//   // 退出編輯模式
//   const handleCancelClick = () => {
//     setEditingField(null);
//     setError(null);
//   };

//   // // 渲染 input 編輯模式
//   const renderEditableField = (
//     label: string,
//     field: string,
//     value: string | null
//   ) => (
//     // <div className="flex items-center space-x-2">
//     <div className="flex flex-col space-y-1 mb-4">
//       <label className="xs:text-sm md:text-md font-semibold text-textColor">
//         {label}：
//       </label>
//       {editingField === field ? (
//         <div className="flex items-center space-x-2">
//           <div className="flex flex-col space-y-1">
//             <input
//               type="text"
//               value={tempValue}
//               onChange={(e) => {
//                 const inputValue = e.target.value;
//                 setTempValue(inputValue);
//                 setError(validateInput(field, inputValue));
//               }}
//               className={`border p-1 rounded w-full max-w-md xs:max-w-[80%] ${
//                 error ? "border-red-500" : "border-gray-300"
//               }`}
//             />
//             {/* Save / Cancel */}
//             <div className="flex space-x-2 mt-2">
//               <button
//                 onClick={() => handleSave(field)}
//                 className="xs:text-sm md:text-md bg-blue-500 text-white px-2 py-1 rounded"
//               >
//                 保存
//               </button>
//               <button
//                 onClick={handleCancelClick}
//                 className="xs:text-sm md:text-md bg-gray-300 px-2 py-1 rounded"
//               >
//                 取消
//               </button>
//             </div>
//           </div>

//           {/* 錯誤提示 */}
//           {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
//         </div>
//       ) : (
//         <div>
//           <span className="text-textColor">{value || "未設定"}</span>
//           <button
//             onClick={() => handleEdit(field, value || "")}
//             className="text-blue-500 ml-2 px-1 py-0.5"
//           >
//             修改
//           </button>
//         </div>
//       )}
//     </div>
//   );

//   // 渲染 select 編輯模式
//   const renderEditableSelect = (
//     label: string,
//     field: string,
//     value: string | null, // 添加 value 參數
//     options: Array<{ id: string; displayText: string }>
//   ) => (
//     // <div className="flex items-center space-x-2">
//     <div className="flex flex-col xs:space-y-1 md:space-x-2 mb-4">
//       <label className="xs:text-sm md:text-md font-semibold text-textColor">
//         {label}：
//       </label>
//       {editingField === field ? (
//         <div className="flex items-center space-x-2">
//           <select
//             value={tempValue}
//             onChange={(e) => setTempValue(e.target.value)}
//             className="border p-1 rounded w-full max-w-md xs:max-w-[80%]"
//           >
//             {options.map((option) => (
//               <option key={option.id} value={option.id}>
//                 {option.displayText}
//               </option>
//             ))}
//           </select>
//           <button
//             onClick={() => handleSave(field)}
//             className="xs:text-sm md:text-md bg-blue-500 text-white px-1 py-0.5 rounded"
//           >
//             保存
//           </button>
//           <button
//             onClick={handleCancelClick}
//             className="xs:text-sm md:text-md bg-gray-300 px-2 py-1 rounded"
//           >
//             取消
//           </button>
//         </div>
//       ) : (
//         <div>
//           <span className="text-textColor">
//             {options.find((o) => o.id === value)?.displayText || "未設定"}
//           </span>
//           <button
//             onClick={() => handleEdit(field, value || "")}
//             className="text-blue-500 ml-2 px-1 py-0.5"
//           >
//             修改
//           </button>
//         </div>
//       )}
//     </div>
//   );

//   return (
//     <div className="space-y-4">
//       <h2 className="xs:text-sm md:text-lg font-semibold mb-4">個人資料</h2>
//       <div>
//         {renderEditableField(
//           "全名",
//           "user_name",
//           userInfo?.user_name || "未提供"
//         )}
//       </div>
//       <div>
//         {renderEditableField("電話號碼", "phone", userInfo?.phone || "未提供")}
//       </div>
//       {/* 常用收件地址select */}
//       <div>
//         {renderEditableSelect(
//           "收件地址",
//           "default_shipping_address",
//           userInfo?.default_shipping_address?.id || null,
//           addresses.map((address) => ({
//             id: address.id,
//             displayText: `${address.city} ${address.district} ${address.address_line}`,
//           }))
//         )}
//       </div>
//       {/* 常用取貨門市select */}
//       <div>
//         {renderEditableSelect(
//           "取貨門市",
//           "default_pickup_store",
//           userInfo?.default_pickup_store?.id || null,
//           stores.map((store) => ({
//             id: store.id,
//             displayText: `${store.store_name} (${store.city} ${store.district} ${store.store_address})`,
//           }))
//         )}
//       </div>
//       {/* <div>
//         {renderEditableField(
//           "預設支付",
//           "default_credit_card",
//           userInfo?.default_credit_card
//         )}
//       </div> */}
//       <div>
//         <p>
//           登入方式：<span>{userInfo?.provider || "未指定"}</span>
//         </p>
//       </div>
//       <div>
//         <p>
//           電子郵件：<span>{userInfo?.email || "未提供"}</span>
//         </p>
//       </div>
//       <div>
//         <p>
//           最後修改時間：
//           <span>
//             {userInfo?.updated_at
//               ? new Date(userInfo.updated_at).toLocaleString()
//               : "尚未修改"}
//           </span>
//         </p>
//       </div>
//     </div>
//   );
// };

// export default UserProfile;
