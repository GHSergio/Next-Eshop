import { createSlice } from "@reduxjs/toolkit";
import { CityOptions, DistrictOptions } from "@/types/locationTypes";
import twZipcodeData from "@/assets/data/tw-zipcode-data.json";

const allData = twZipcodeData.data;

interface DeliveryLocationState {
  cities: CityOptions[];
  districts: DistrictOptions[];
}

const initialState: DeliveryLocationState = {
  cities: Array.from(new Set(allData.map((item) => item.city))).map((city) => ({
    name: city,
  })),
  districts: [],
};

const deliveryLocationSlice = createSlice({
  name: "location",
  initialState,
  reducers: {
    UpdateDeliveryCity(state, action) {
      // 根據選擇的城市篩選地區
      state.districts = allData
        .filter((item) => item.city === action.payload)
        .map((item) => ({
          name: item.district,
          zip_code: item.zip_code,
        }));
    },
  },
});

export const { UpdateDeliveryCity } = deliveryLocationSlice.actions;
export default deliveryLocationSlice.reducer;
