import { createSlice } from '@reduxjs/toolkit';
import { parseUnitPrice } from '../../utils/shopHelpers';

const initialState = {
  items: [],
  totalAmount: 0,
  totalItems: 0,
};

const recalcTotals = state => {
  state.totalItems = state.items.reduce((sum, item) => sum + item.quantity, 0);
  state.totalAmount = state.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const payload = {
        ...action.payload,
        price: parseUnitPrice(action.payload.price),
      };
      const existingItem = state.items.find(item => item.id === payload.id);
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        state.items.push({ ...payload, quantity: 1 });
      }
      recalcTotals(state);
    },
    removeFromCart: (state, action) => {
      state.items = state.items.filter(item => item.id !== action.payload);
      recalcTotals(state);
    },
    updateQuantity: (state, action) => {
      const { id, quantity } = action.payload;
      if (quantity <= 0) {
        state.items = state.items.filter(item => item.id !== id);
      } else {
        const existingItem = state.items.find(item => item.id === id);
        if (existingItem) {
          existingItem.quantity = quantity;
        }
      }
      recalcTotals(state);
    },
    clearCart: state => {
      state.items = [];
      state.totalAmount = 0;
      state.totalItems = 0;
    },
  },
});

export const { addToCart, removeFromCart, updateQuantity, clearCart } =
  cartSlice.actions;
export default cartSlice.reducer;
