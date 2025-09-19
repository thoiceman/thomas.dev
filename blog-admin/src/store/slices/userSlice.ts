import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// 定义用户状态接口
interface UserState {
  userList: any[];
  currentUser: any | null;
  loading: boolean;
  error: string | null;
}

// 初始状态
const initialState: UserState = {
  userList: [],
  currentUser: null,
  loading: false,
  error: null,
};

// 创建用户slice
const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    // 设置加载状态
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    // 设置错误信息
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    // 设置用户列表
    setUserList: (state, action: PayloadAction<any[]>) => {
      state.userList = action.payload;
    },
    // 设置当前用户
    setCurrentUser: (state, action: PayloadAction<any>) => {
      state.currentUser = action.payload;
    },
    // 添加用户
    addUser: (state, action: PayloadAction<any>) => {
      state.userList.push(action.payload);
    },
    // 更新用户
    updateUser: (state, action: PayloadAction<{ id: number; data: any }>) => {
      const index = state.userList.findIndex(user => user.id === action.payload.id);
      if (index !== -1) {
        state.userList[index] = { ...state.userList[index], ...action.payload.data };
      }
    },
    // 删除用户
    deleteUser: (state, action: PayloadAction<number>) => {
      state.userList = state.userList.filter(user => user.id !== action.payload);
    },
  },
});

export const {
  setLoading,
  setError,
  setUserList,
  setCurrentUser,
  addUser,
  updateUser,
  deleteUser,
} = userSlice.actions;

export default userSlice.reducer;