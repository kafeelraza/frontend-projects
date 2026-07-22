import { createSlice } from "@reduxjs/toolkit";

const CART_KEY = "sm_cart";

const safeParse = (value, fallback) => {
  try {
    return JSON.parse(value) ?? fallback;
  } catch {
    return fallback;
  }
};

const loadCart = () => safeParse(localStorage.getItem(CART_KEY), []);
const persist = (items) => localStorage.setItem(CART_KEY, JSON.stringify(items));

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    items: loadCart(),
    isOpen: false,
  },
  reducers: {
    addToCart: (state, action) => {
      const product = action.payload;
      const existing = state.items.find((item) => item.id === product.id);
      if (existing) existing.quantity += 1;
      else state.items.push({ ...product, quantity: 1 });
      persist(state.items);
    },
    removeFromCart: (state, action) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
      persist(state.items);
    },
    increment: (state, action) => {
      const item = state.items.find((cartItem) => cartItem.id === action.payload);
      if (item) item.quantity += 1;
      persist(state.items);
    },
    decrement: (state, action) => {
      const item = state.items.find((cartItem) => cartItem.id === action.payload);
      if (!item) return;
      item.quantity -= 1;
      if (item.quantity <= 0) {
        state.items = state.items.filter((cartItem) => cartItem.id !== action.payload);
      }
      persist(state.items);
    },
    clearCart: (state) => {
      state.items = [];
      persist(state.items);
    },
    openCart: (state) => {
      state.isOpen = true;
    },
    closeCart: (state) => {
      state.isOpen = false;
    },
    toggleCart: (state) => {
      state.isOpen = !state.isOpen;
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  increment,
  decrement,
  clearCart,
  openCart,
  closeCart,
  toggleCart,
} = cartSlice.actions;

export const selectCartItems = (state) => state.cart.items;
export const selectCartOpen = (state) => state.cart.isOpen;
export const selectTotalQty = (state) =>
  state.cart.items.reduce((sum, item) => sum + item.quantity, 0);
export const selectTotalPrice = (state) =>
  state.cart.items.reduce((sum, item) => sum + item.quantity * item.price, 0);
export const selectInCart = (id) => (state) => state.cart.items.some((item) => item.id === id);

export default cartSlice.reducer;
