import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { setSelectedPayment } from "@/store/slice/userSlice";
import sevenElevenStores from "@/assets/data/7-11-locations.json";
import familyMartStores from "@/assets/data/familymart-locations.json";

interface StoreLocationState {
  cities: string[]; // 可用的城市列表
  districts: string[]; // 可用的地區列表
  stores: { name: string; address: string }[]; // 可用的門市列表
  selectedPayment: string; // 用來儲存 userSlice.setselectedPayment ation 接收到的 value
}

const initialState: StoreLocationState = {
  cities: [],
  districts: [],
  stores: [],
  selectedPayment: "",
};

const storeLocationSlice = createSlice({
  name: "storeLocation",
  initialState,
  reducers: {
    // 選擇支付方式後更新城市列表
    updateStoreCities(state, action: PayloadAction<string>) {
      const payment = action.payload;
      const allStores =
        payment === "7-11" ? sevenElevenStores : familyMartStores;

      state.cities = Array.from(new Set(allStores.map((store) => store.city)));
      state.districts = [];
      state.stores = [];
    },
    // 根據選擇的城市更新地區列表
    updateStoreDistricts(state, action: PayloadAction<string>) {
      const selectedCity = action.payload;
      const allStores =
        state.selectedPayment === "7-11" ? sevenElevenStores : familyMartStores;

      state.districts = Array.from(
        new Set(
          allStores
            .filter((store) => store.city === selectedCity)
            .map((store) => store.district)
        )
      );
      state.stores = [];
    },
    // 根據選擇的地區更新門市列表
    updateStores(state, action: PayloadAction<string>) {
      const selectedDistrict = action.payload;
      const allStores =
        state.selectedPayment === "7-11" ? sevenElevenStores : familyMartStores;

      // 找到匹配的地區
      const districtData = allStores.find(
        (store) => store.district === selectedDistrict
      );

      // 如果找到，提取門市數據；否則設置為空數組
      state.stores = districtData ? districtData.stores : [];
    },
  },
  // 間接 等於訂閱 userSlice 的 selectedPayment state
  extraReducers: (builder) => {
    // 訂閱 userSlice 的 setSelectedPayment action
    builder.addCase(setSelectedPayment, (state, action) => {
      // 這裡獲取 `selectedPayment` 的值
      const payment = action.payload;
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

export const { updateStoreCities, updateStoreDistricts, updateStores } =
  storeLocationSlice.actions;

export default storeLocationSlice.reducer;
