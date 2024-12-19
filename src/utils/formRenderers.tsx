// src/utils/formRenderers.tsx
import React from "react";
import InputMask from "react-input-mask";

// 一般 input
export const renderInput = ({
  type,
  id,
  name,
  label,
  placeholder,
  value,
  onChange,
  error,
  errorMessage,
  submitted,
  minLength, // 支援最小長度限制
  maxLength, // 支援最大長度限制
  pattern, // 支援輸入模式
  onInput, // 即時過濾函式
}: {
  type: string;
  id: string;
  name: string;
  label: string;
  placeholder: string;
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  error: boolean;
  errorMessage?: string;
  submitted: boolean;
  minLength?: number; // 可選的最小長度
  maxLength?: number; // 可選的最大長度
  pattern?: string; // 可選的正則模式
  onInput?: (event: React.FormEvent<HTMLInputElement>) => void; // 可選的過濾函式
}) => (
  <div className="mb-4">
    <label className="block font-medium mb-1" htmlFor={id}>
      {label}
    </label>
    <input
      type={type}
      id={id}
      name={name}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      onInput={onInput} // 添加即時過濾
      minLength={minLength}
      maxLength={maxLength}
      pattern={pattern}
      className={`w-full px-3 py-2 border ${
        submitted && error ? "border-red-500" : "border-gray-300"
      } rounded`}
    />
    {submitted && error && (
      <p className="text-red-500 font-semibold text-md mt-1">{errorMessage}</p>
    )}
  </div>
);

// 特殊格式 input
export const renderMaskedInput = ({
  mask,
  id,
  name,
  label,
  placeholder,
  value,
  onChange,
  error,
  errorMessage,
  submitted,
}: {
  mask: string; // 指定輸入格式，例如 "99/99" 或 "+886 9xx xxx xxx"
  id: string;
  name: string;
  label: string;
  placeholder: string;
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  error: boolean;
  errorMessage?: string;
  submitted: boolean;
}) => (
  <div className="mb-4">
    <label className="block font-medium mb-1" htmlFor={id}>
      {label}
    </label>
    <InputMask
      mask={mask}
      value={value}
      // onChange={onChange}
      onChange={(e) => {
        const cleanValue = e.target.value.replace(/[^0-9/]/g, ""); // 僅保留數字和 "/"
        onChange({ ...e, target: { ...e.target, value: cleanValue } });
      }}
    >
      {(inputProps) => (
        <input
          {...inputProps}
          id={id}
          name={name}
          placeholder={placeholder}
          className={`w-full px-3 py-2 border ${
            submitted && error ? "border-red-500" : "border-gray-300"
          } rounded`}
        />
      )}
    </InputMask>
    {submitted && error && (
      <p className="text-red-500 font-semibold text-md mt-1">{errorMessage}</p>
    )}
  </div>
);

export const renderSelect = ({
  id,
  name,
  label,
  value,
  onChange,
  options,
  error,
  // errorMessage, // 可選的自定義錯誤訊息
  submitted,
}: {
  id: string;
  name: string;
  label: string;
  value: string;
  options: string[]; // 改為單純的字符串數組
  onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  error: boolean;
  submitted: boolean;
}) => (
  <div className="mb-4">
    <label className="block font-medium mb-1" htmlFor={id}>
      {label}
    </label>
    <select
      id={id}
      name={name}
      value={value}
      onChange={onChange}
      className={`w-full px-3 py-2 border ${
        submitted && error ? "border-3 border-red-500" : "border-gray-300"
      } rounded`}
    >
      <option value="">{`選擇${label}`}</option>
      {options.map((option, index) => (
        <option key={index} value={option}>
          {option}
        </option>
      ))}
    </select>
    {submitted && error && (
      <p className="text-red-500 font-semibold text-md mt-1">{`請選擇${label}`}</p>
    )}
  </div>
);

// type SelectOption = string | { name: string; address?: string }; // 替換成你預期的 object 結構

// // 嵌套的物件
// export const renderSelectWithObjects = ({
//   id,
//   name,
//   label,
//   value,
//   options,
//   // 預設函式 -> 用來判斷options內容 顯示什麼格式
//   // 沒有顯式傳入 getOptionLabel 時，這個預設函式會自動被使用。
//   getOptionLabel = (option) =>
//     typeof option === "string" ? option : (option as { name: string }).name,
//   onChange,
//   error,
//   submitted,
// }: {
//   id: string;
//   name: string;
//   label: string;
//   value: string;
//   options: SelectOption[];
//   //  確保無論是簡單的 string[] 還是結構化的 object[]，都可以正確渲染。
//   getOptionLabel?: (option: SelectOption) => string; // 可選，當 options 為 object[] 時需要
//   onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
//   error: boolean;
//   submitted: boolean;
// }) => (
//   <div className="mb-4">
//     <label className="block font-medium mb-1" htmlFor={id}>
//       {label}
//     </label>
//     <select
//       id={id}
//       name={name}
//       value={value}
//       onChange={onChange}
//       className={`w-full px-3 py-2 border ${
//         submitted && error ? "border-3 border-red-500" : "border-gray-300"
//       } rounded`}
//     >
//       <option value="">{`選擇${label}`}</option>
//       {options.map((option, index) => (
//         <option key={index} value={getOptionLabel(option)}>
//           {getOptionLabel(option)}
//         </option>
//       ))}
//     </select>
//     {submitted && error && (
//       <p className="text-red-500 text-sm mt-1">{`請選擇${label}`}</p>
//     )}
//   </div>
// );
