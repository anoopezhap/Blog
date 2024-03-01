import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentUser: null,
};
const userSlice = createSlice({
  name: "user",
  initialState: initialState,
  reducers: {
    signInDetails(state, action) {
      state.currentUser = action.payload.data;
    },
  },
});

export const { signInDetails } = userSlice.actions;

export default userSlice.reducer;
