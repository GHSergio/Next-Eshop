// import { createSlice, PayloadAction } from "@reduxjs/toolkit";
// import cStoresLists from "@/assets/data/mock_store_data.json";

// interface StoreLocationState {
//   cStores: string[]; // 超商類型
//   cities: string[]; // 可用的城市列表
//   districts: string[]; // 可用的地區列表
//   roadSections: string[]; // 可用的路段列表
//   stores: { store_name: string; store_address: string }[];
//   selectedCStore: string; // 當前選中的超商類型
// }

// const initialState: StoreLocationState = {
//   cStores: ["7-Eleven", "FamilyMart"], // 假設超商列表
//   cities: [],
//   districts: [],
//   roadSections: [],
//   stores: [],
//   selectedCStore: "",
// };

// const storeLocationSlice = createSlice({
//   name: "storeLocation",
//   initialState,
//   reducers: {
//     // 根據選擇的超商類型更新城市列表
//     updateStoreCities(state, action: PayloadAction<string>) {
//       const selectedCStore = action.payload;
//       state.selectedCStore = selectedCStore;

//       // 篩選對應的超商資料
//       const allStores = cStoresLists.filter(
//         (store) => store.c_store === selectedCStore
//       );

//       // 更新城市列表
//       state.cities = Array.from(new Set(allStores.map((store) => store.city)));
//       state.districts = [];
//       state.roadSections = [];
//       state.stores = [];
//     },

//     // 根據選擇的城市更新地區列表
//     updateStoreDistricts(state, action: PayloadAction<string>) {
//       const selectedCity = action.payload;

//       // 篩選當前超商和城市的資料
//       const allStores = cStoresLists.filter(
//         (store) =>
//           store.c_store === state.selectedCStore && store.city === selectedCity
//       );

//       // 更新地區列表
//       state.districts = Array.from(
//         new Set(allStores.map((store) => store.district))
//       );
//       state.roadSections = [];
//       state.stores = [];
//     },

//     // 根據選擇的地區更新路段列表
//     updateStoreRoadSections(state, action: PayloadAction<string>) {
//       const selectedDistrict = action.payload;

//       // 篩選當前超商、城市和地區的資料
//       const allStores = cStoresLists.filter(
//         (store) =>
//           store.c_store === state.selectedCStore &&
//           store.district === selectedDistrict
//       );

//       // 更新路段列表
//       state.roadSections = Array.from(
//         new Set(allStores.map((store) => store.road_section))
//       );
//       state.stores = [];
//     },

//     // 根據選擇的路段更新門市列表
//     updateStores(state, action: PayloadAction<string>) {
//       const selectedRoadSection = action.payload;

//       // 篩選當前超商、城市、地區和路段的資料
//       const allStores = cStoresLists.filter(
//         (store) =>
//           store.c_store === state.selectedCStore &&
//           store.road_section === selectedRoadSection
//       );

//       // 更新門市列表
//       state.stores = allStores.flatMap((store) => store.store_name);
//     },
//   },
// });

// // const storeLocationSlice = createSlice({
// //   name: "storeLocation",
// //   initialState,
// //   reducers: {
// //     // 選擇支付方式後更新城市列表
// //     updateStoreCities(state, action: PayloadAction<string>) {
// //       const payment = action.payload;
// //       const allStores =
// //         payment === "7-11" ? sevenElevenStores : familyMartStores;

// //       state.cities = Array.from(new Set(allStores.map((store) => store.city)));
// //       state.districts = [];
// //       state.stores = [];
// //     },
// //     // 根據選擇的城市更新地區列表
// //     updateStoreDistricts(state, action: PayloadAction<string>) {
// //       const selectedCity = action.payload;
// //       const allStores =
// //         state.selectedPayment === "7-11" ? sevenElevenStores : familyMartStores;

// //       state.districts = Array.from(
// //         new Set(
// //           allStores
// //             .filter((store) => store.city === selectedCity)
// //             .map((store) => store.district)
// //         )
// //       );
// //       state.stores = [];
// //     },
// //     // 根據選擇的地區更新門市列表
// //     updateStores(state, action: PayloadAction<string>) {
// //       const selectedDistrict = action.payload;
// //       const allStores =
// //         state.selectedPayment === "7-11" ? sevenElevenStores : familyMartStores;

// //       // 找到匹配的地區
// //       const districtData = allStores.find(
// //         (store) => store.district === selectedDistrict
// //       );

// //       // 如果找到，提取門市數據；否則設置為空數組
// //       state.stores = districtData ? districtData.stores : [];
// //     },
// //   },
// //   // 間接 等於訂閱 userSlice 的 selectedPayment state
// //   extraReducers: (builder) => {
// //     // 訂閱 userSlice 的 setSelectedPayment action
// //     builder.addCase(setSelectedPayment, (state, action) => {
// //       // 這裡獲取 `selectedPayment` 的值
// //       const payment = action.payload;
// //       // 將 `selectedPayment` 值存到 `storeLocationSlice` 的 state 中
// //       state.selectedPayment = payment;

// //       // 更新可用的城市列表
// //       state.cities =
// //         payment === "7-11"
// //           ? Array.from(new Set(sevenElevenStores.map((store) => store.city)))
// //           : payment === "family"
// //           ? Array.from(new Set(familyMartStores.map((store) => store.city)))
// //           : [];

// //       // 清空用戶選擇，但保留 cities 數據
// //       state.districts = [];
// //       state.stores = [];
// //     });
// //   },
// // });

// export const {
//   updateStoreCities,
//   updateStoreDistricts,
//   updateStoreRoadSections,
//   updateStores,
// } = storeLocationSlice.actions;

// export default storeLocationSlice.reducer;
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import cStoresLists from "@/assets/data/mock_store_data.json";

interface StoreLocationState {
  cStores: string[]; // 超商類型
  cities: string[]; // 可用的城市列表
  districts: string[]; // 可用的地區列表
  roadSections: string[]; // 可用的路段列表
  stores: { store_name: string; store_address: string }[];
  selectedCStore: string; // 當前選中的超商類型
  selectedCity: string; // 當前選中的城市
  selectedDistrict: string; // 當前選中的地區
}

const initialState: StoreLocationState = {
  cStores: ["7-Eleven", "FamilyMart"], // 假設超商列表
  cities: [],
  districts: [],
  roadSections: [],
  stores: [],
  selectedCStore: "",
  selectedCity: "",
  selectedDistrict: "",
};

const storeLocationSlice = createSlice({
  name: "storeLocation",
  initialState,
  reducers: {
    updateStoreCities(state, action: PayloadAction<string>) {
      state.selectedCStore = action.payload;
      state.cities = Array.from(
        new Set(
          cStoresLists
            .filter((store) => store.c_store === state.selectedCStore)
            .map((store) => store.city)
        )
      );
      state.districts = [];
      state.roadSections = [];
      state.stores = [];
    },
    updateStoreDistricts(state, action: PayloadAction<string>) {
      state.selectedCity = action.payload;
      state.districts = Array.from(
        new Set(
          cStoresLists
            .filter(
              (store) =>
                store.c_store === state.selectedCStore &&
                store.city === state.selectedCity
            )
            .map((store) => store.district)
        )
      );
      state.roadSections = [];
      state.stores = [];
    },
    updateStoreRoadSections(state, action: PayloadAction<string>) {
      state.selectedDistrict = action.payload;
      state.roadSections = Array.from(
        new Set(
          cStoresLists
            .filter(
              (store) =>
                store.c_store === state.selectedCStore &&
                store.city === state.selectedCity &&
                store.district === state.selectedDistrict
            )
            .map((store) => store.road_section)
        )
      );
      state.stores = [];
    },
    updateStores(state, action: PayloadAction<string>) {
      const selectedRoadSection = action.payload;
      state.stores = cStoresLists
        .filter(
          (store) =>
            store.c_store === state.selectedCStore &&
            store.city === state.selectedCity &&
            store.district === state.selectedDistrict &&
            store.road_section === selectedRoadSection
        )
        .map((store) => ({
          store_name: store.store_name,
          store_address: store.store_address,
        }));
    },
  },
});

export const {
  updateStoreCities,
  updateStoreDistricts,
  updateStoreRoadSections,
  updateStores,
} = storeLocationSlice.actions;

export default storeLocationSlice.reducer;
