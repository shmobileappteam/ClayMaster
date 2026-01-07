// import AsyncStorage from '@react-native-async-storage/async-storage';
import { createSlice } from '@reduxjs/toolkit';
//----------
import { storage } from '../../api/api';
import { KEYS } from '../../constants';

const initialState = {
  user: null,
  isLogged: false,
  trackLocation: null,
  subscriptionEnabled: true,
};

const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
      state.isLogged = true;
    },
    handleLogout: state => {
      storage.delete(KEYS.CREDENTIALS);
      storage.delete(KEYS.ACCESS_TOKEN);
      storage.delete(KEYS.SOCIAL_TOKEN);
      storage.delete(KEYS.LOGIN_TYPE);

      state.user = null;
      state.isLogged = false;
    },
    setTrackLocation: (state, action) => {
      state.trackLocation = action.payload;
    },
    setSubscriptionEnabled: (state, action) => {
      state.subscriptionEnabled = action.payload;
    },
  },
});

export const {
  setUser,
  handleLogout,
  setTrackLocation,
  setSubscriptionEnabled,
} = appSlice.actions;
export default appSlice.reducer;
