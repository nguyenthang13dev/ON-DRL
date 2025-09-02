import { createSlice } from "@reduxjs/toolkit";
interface StateType {
  isLoading?: boolean;
  showMessage?: boolean;
}

const initialState: StateType = {
  isLoading: false,
  showMessage: false,
};

export const GeneralSlice = createSlice({
  name: "customizer",
  initialState,
  reducers: {
    setIsLoading: (state: StateType, action) => {
      state.isLoading = action.payload;
    },
    setShowMessage: (state: StateType, action) => {
      state.showMessage = action.payload;
    },
  },
});

export const {
    setIsLoading,
    setShowMessage
} = GeneralSlice.actions;

export default GeneralSlice.reducer;
