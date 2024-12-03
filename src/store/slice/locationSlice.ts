import { createSlice } from "@reduxjs/toolkit";
import { CityOptions, DistrictOptions } from "@/types/locationTypes";
import twZipcodeData from "@/assets/data/tw-zipcode-data.json";

const allData = twZipcodeData.data;

interface LocationState {
  cities: CityOptions[];
  districts: DistrictOptions[];
  selectedCity: string;
  selectedDistrict: string;
  address: string;
}

const initialState: LocationState = {
  cities: Array.from(new Set(allData.map((item) => item.city))).map((city) => ({
    name: city,
  })),
  districts: [],
  selectedCity: "",
  selectedDistrict: "",
  address: "",
};

const locationSlice = createSlice({
  name: "location",
  initialState,
  reducers: {
    setSelectedCity(state, action) {
      state.selectedCity = action.payload;

      // 根據選擇的城市篩選地區
      state.districts = allData
        .filter((item) => item.city === action.payload)
        .map((item) => ({
          name: item.district,
          zip_code: item.zip_code,
        }));
    },
    setSelectedDistrict(state, action) {
      state.selectedDistrict = action.payload;
    },
    setAddress(state, action) {
      state.address = action.payload;
    },
  },
});

export const { setSelectedCity, setSelectedDistrict, setAddress } =
  locationSlice.actions;
export default locationSlice.reducer;
