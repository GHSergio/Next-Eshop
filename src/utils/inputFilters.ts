export const onlyNumbers = (value: string) => value.replace(/\D/g, ""); // 僅保留數字
export const noSpecialChars = (value: string) =>
  value.replace(/[^a-zA-Z0-9 ]/g, ""); // 去除特殊字符
