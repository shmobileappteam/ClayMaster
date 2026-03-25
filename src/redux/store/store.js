import {configureStore} from '@reduxjs/toolkit';

import appReducer from '../slices/appSlice';
import cartReducer from '../slices/cartSlice';

const store = configureStore({
  reducer: {
    app: appReducer,
    cart: cartReducer,
  },
});

export default store;
