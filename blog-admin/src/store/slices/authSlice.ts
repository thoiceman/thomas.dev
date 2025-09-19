import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// 定义认证状态接口
interface AuthState {
  isAuthenticated: boolean;
  token: string | null;
  user: {
    id: number | null;
    username: string;
    email: string;
    role: string;
  } | null;
}

// 初始状态
const initialState: AuthState = {
  isAuthenticated: false,
  token: localStorage.getItem('token'),
  user: null,
};

// 创建认证slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // 登录成功
    loginSuccess: (state, action: PayloadAction<{ token: string; user: any }>) => {
      state.isAuthenticated = true;
      state.token = action.payload.token;
      state.user = action.payload.user;
      localStorage.setItem('token', action.payload.token);
    },
    // 登出
    logout: (state) => {
      state.isAuthenticated = false;
      state.token = null;
      state.user = null;
      localStorage.removeItem('token');
    },
    // 更新用户信息
    updateUser: (state, action: PayloadAction<any>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    },
  },
});

export const { loginSuccess, logout, updateUser } = authSlice.actions;
export default authSlice.reducer;