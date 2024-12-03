export interface CityData {
  zip_code: string; // 郵遞區號
  district: string; // 地區名稱 (如：中正區)
  city: string; // 城市名稱 (如：台北市)
  lat: number; // 緯度
  lng: number; // 經度
}

export interface CityOptions {
  name: string; // 城市名稱
}

export interface DistrictOptions {
  name: string; // 地區名稱
}

export interface LocationStoreInfo {
  city: string;
  district: string;
  stores: { name: string; address: string }[];
}
