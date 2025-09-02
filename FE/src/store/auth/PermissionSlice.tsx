import { UserType } from "@/types/auth/User";
import { Response } from "@/types/general";
import { PermissionType } from "@/types/role/role";

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
interface StateType {
  permissions: PermissionType[] | null;
}

const initialState: StateType = {
  permissions: null,
};

export const PermissionSlice = createSlice({
  name: "permission",
  initialState,
  reducers: {
    setPermission: (
      state: StateType,
      action: PayloadAction<Response<UserType>>
    ) => {
      const userPermissions = action.payload.data?.permissions || [];
      state.permissions = userPermissions; 
    },
    resetPermission: (state: StateType) => {
      state.permissions = null;
    },
  },
});

export const { setPermission, resetPermission } = PermissionSlice.actions;

export default PermissionSlice.reducer;
