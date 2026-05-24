import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { BASE_URL } from "../server/api";
import Cookies from "js-cookie";

const initialState = {
  userInfo: [],
  products: [],
};

console.log("BASE_URL", BASE_URL);

const token = Cookies.get("token");

export const ecommSlice = createSlice({
  name: "ecomm",
  initialState,
  reducers: {
    addToCart: async (state, action) => {
      console.log("action", action, state);
      const response = await axios
        .post(
          `${BASE_URL}cart/add`,
          { product_id: action.payload._id },
          { withCredentials: true },
        )
        .catch((error) => {
          console.log(error);
        });

      console.log('response', response.status, state)
      if (response.status == 200) {
        const item = state.products.find(
          (item) => item._id === action.payload._id,
        );
        console.log("item", state.products);
        if (item) {
          console.log("in item");
          item.quantity += action.payload.quantity;
        } else {
          console.log("no item");
          state.products.push(action.payload);
          console.log("products", state.products);
        }
      }
    },
    increaseQuantity: (state, action) => {
      const item = state.products.find(
        (item) => item._id === action.payload._id,
      );
      if (item) {
        console.log("item", state.products);
        item.quantity++;
      }
    },
    decreaseQuantity: (state, action) => {
      const item = state.products.find(
        (item) => item._id === action.payload._id,
      );
      console.log('item.quantity', item.quantity)
      if (item.quantity === 1) {
        item.quantity = 1;
      } else {
        item.quantity--;
      }
    },
    deleteItem: (state, action) => {
      state.products = state.products.filter(
        (item) => item._id !== action.payload,
      );
    },
    resetCart: (state) => {
      console.log('state', state.products)
      state.products = [];
    },
  },
});

export const {
  addToCart,
  increaseQuantity,
  decreaseQuantity,
  deleteItem,
  resetCart,
} = ecommSlice.actions;
export default ecommSlice.reducer;
