import { createSlice } from "@reduxjs/toolkit";
import twZipcodeData from "@/assets/data/tw-zipcode-data.json";

export interface CityData {
  zip_code: string; // 郵遞區號
  district: string; // 地區名稱 (如：中正區)
  city: string; // 城市名稱 (如：台北市)
  lat: number; // 緯度
  lng: number; // 經度
}

const allData = twZipcodeData.data;

interface DeliveryLocationState {
  cities: string[];
  districts: string[];
}

const initialState: DeliveryLocationState = {
  cities: Array.from(new Set(allData.map((item) => item.city))),
  districts: [],
};

const deliveryLocationSlice = createSlice({
  name: "location",
  initialState,
  reducers: {
    updateDeliveryCity(state, action) {
      // 根據選擇的城市篩選地區
      state.districts = allData
        .filter((item) => item.city === action.payload)
        .map((item) => item.district);
    },
  },
});

export const { updateDeliveryCity } = deliveryLocationSlice.actions;
export default deliveryLocationSlice.reducer;
