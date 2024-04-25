import { createSlice } from "@reduxjs/toolkit";

const uiSlice = createSlice({
  name: "ui",
  initialState: {
    selectedComponent: null,
  },
  reducers: {
    selectComponent: (state, action) => {
      state.selectedComponent = action.payload;
    },
  },
});

export const { selectComponent } = uiSlice.actions;
export default uiSlice.reducer;
