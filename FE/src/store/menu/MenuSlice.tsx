import { UserType } from "@/types/auth/User";
import { Response } from "@/types/general";
import { MenuDataType } from "@/types/menu/menu";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
interface StateType {
  menuData: MenuDataType[] | null;
}

const initialState: StateType = {
  menuData: null,
};

export const MenuSlice = createSlice({
  name: "menu",
  initialState,
  reducers: {
    setMenuData: (
      state: StateType,
      action: PayloadAction<Response<UserType>>
    ) => {
      const userMenuData = action.payload.data?.menuData;
      if (userMenuData && Array.isArray(userMenuData)) {
        state.menuData = userMenuData;
      }
    },
    resetMenuData: (state: StateType) => {
      state.menuData = null;
    },
  },
});

export const { setMenuData, resetMenuData } = MenuSlice.actions;

export default MenuSlice.reducer;
