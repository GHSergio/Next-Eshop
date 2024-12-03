import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { setSelectedPayment } from "@/store/slice/userSlice";
import sevenElevenStores from "@/assets/data/7-11-locations.json";
import familyMartStores from "@/assets/data/familymart-locations.json";

interface StoreLocationState {
  cities: string[]; // 可用的城市列表
  districts: string[]; // 可用的地區列表
  stores: { name: string; address: string }[]; // 可用的門市列表
  selectedCity: string; // 選擇的城市
  selectedDistrict: string; // 選擇的地區
  selectedStore: string; // 選擇的門市
  selectedPayment: string; // 當前的支付方式
}

const initialState: StoreLocationState = {
  cities: [],
  districts: [],
  stores: [],
  selectedCity: "",
  selectedDistrict: "",
  selectedStore: "",
  selectedPayment: "", // 初始化為空
};

const storeLocationSlice = createSlice({
  name: "storeLocation",
  initialState,
  reducers: {
    // 選擇城市
    setStoreCity(state, action: PayloadAction<string>) {
      state.selectedCity = action.payload;
      state.selectedDistrict = "";
      state.selectedStore = "";

      // 根據當前支付方式選擇數據源
      const allStores =
        state.selectedPayment === "7-11" ? sevenElevenStores : familyMartStores;

      // 根據選擇的城市篩選地區
      state.districts = Array.from(
        new Set(
          allStores
            .filter((store) => store.city === action.payload)
            .map((store) => store.district)
        )
      );

      state.stores = []; // 清空門市
    },
    // 選擇地區
    setStoreDistrict(state, action: PayloadAction<string>) {
      state.selectedDistrict = action.payload;
      state.selectedStore = "";

      // 根據當前支付方式選擇數據源
      const allStores =
        state.selectedPayment === "7-11" ? sevenElevenStores : familyMartStores;

      // 根據選擇的地區篩選門市
      const filteredDistrict = allStores.find(
        (store) =>
          store.city === state.selectedCity && store.district === action.payload
      );

      // 將篩選出的 `stores` 設置為 state.stores，如果找不到則設置為空陣列
      state.stores = filteredDistrict ? filteredDistrict.stores : [];
    },
    // 選擇門市
    setStore(state, action: PayloadAction<string>) {
      state.selectedStore = action.payload;
    },
  },
  // 間接 等於訂閱 userSlice 的 selectedPayment state
  extraReducers: (builder) => {
    // 訂閱 userSlice 的 setSelectedPayment action
    builder.addCase(setSelectedPayment, (state, action) => {
      // 這裡獲取 `selectedPayment` 的值
      const payment = action.payload;
      // 清空選擇
      state.selectedCity = "";
      state.selectedDistrict = "";
      state.selectedStore = "";

      // 將 `selectedPayment` 值存到 `storeLocationSlice` 的 state 中
      state.selectedPayment = payment;

      // 更新可用的城市列表
      state.cities =
        payment === "7-11"
          ? Array.from(new Set(sevenElevenStores.map((store) => store.city)))
          : payment === "family"
          ? Array.from(new Set(familyMartStores.map((store) => store.city)))
          : [];

      // 清空用戶選擇，但保留 cities 數據
      state.districts = [];
      state.stores = [];
    });
  },
});

export const { setStoreCity, setStoreDistrict, setStore } =
  storeLocationSlice.actions;

export default storeLocationSlice.reducer;
