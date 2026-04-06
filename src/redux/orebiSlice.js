import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { BASE_URL } from "../server/api";

const initialState = {
  userInfo: [],
  products: [],
};

console.log('BASE_URL', BASE_URL)

export const orebiSlice = createSlice({
  name: "orebi",
  initialState,
  reducers: {
    addToCart: async (state, action) => {
      await axios.get(`${BASE_URL}cart/add/` + action.payload._id)
          .then(result => {
            if(result.status === 200){
              const item = state.products.find(
                (item) => item._id === action.payload._id
              );
              if (item) {
                    item.quantity += action.payload.quantity;
              } else {
                state.products.push(action.payload);
              }

            }
          })
          .catch(error => {
            console.log(error)
          })
    },
    increaseQuantity: (state, action) => {
      const item = state.products.find(
        (item) => item._id === action.payload._id
      );
      if (item) {
        item.quantity++;
      }
    },
    drecreaseQuantity: (state, action) => {
      const item = state.products.find(
        (item) => item._id === action.payload._id
      );
      if (item.quantity === 1) {
        item.quantity = 1;
      } else {
        item.quantity--;
      }
    },
    deleteItem: (state, action) => {
      state.products = state.products.filter(
        (item) => item._id !== action.payload
      );
    },
    resetCart: (state) => {
      state.products = [];
    },
  },
});

export const {
  addToCart,
  increaseQuantity,
  drecreaseQuantity,
  deleteItem,
  resetCart,
} = orebiSlice.actions;
export default orebiSlice.reducer;
