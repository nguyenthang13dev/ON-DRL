import { LoginResponseType, UserType } from "@/types/auth/User";
import { Response } from "@/types/general";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { setAccessToken, removeAccessToken } from "@/utils/authUtils";

interface StateType {
  AccessToken?: string;
  User: UserType | null;
  ListRole: string[] | null;
}

const initialState: StateType = {
  AccessToken: "",
  User: null,
  ListRole: [],

};

export const AuthSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setLogin: (
      state: StateType,
      action: PayloadAction<Response<LoginResponseType>>
    ) => {
      if (action.payload.data && action.payload.data != null) {
        const data = action.payload.data;
        state.AccessToken = data.token;
        // Sử dụng function mới để lưu token vào cả localStorage và cookie
        setAccessToken(data.token || "");
        state.User = data.user || null;
      }
    },
    setUserInfo: (
      state: StateType,
      action: PayloadAction<Response<UserType>>
    ) => {
      if (action.payload.data != null) {
        state.User = action.payload.data || null;
      }
    },
    setListRole: (state: StateType, action: PayloadAction<Response>) => {
      if (action.payload.data != null) {
        state.ListRole = action.payload.data?.user?.listRole || [];
      }
    },
    setLogout: (state: StateType) => {
      // Sử dụng function mới để xóa token khỏi cả localStorage và cookie
      removeAccessToken();
      state.AccessToken = "";
      state.User = null;
      state.ListRole = null;
    },
  },
});

export const { setLogin, setUserInfo, setLogout } = AuthSlice.actions;

export default AuthSlice.reducer;
