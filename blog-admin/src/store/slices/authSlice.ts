import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { authAPI } from '../../api/auth';

/**
 * 认证状态接口
 */
interface AuthState {
  isAuthenticated: boolean;
  token: string | null;
  user: {
    id: number | null;
    username: string;
    email: string;
    role: string;
  } | null;
  loading: boolean;
  error: string | null;
  loginAttempts: number; // 登录尝试次数
  lastLoginTime: number | null; // 最后登录时间
  sessionExpiry: number | null; // 会话过期时间
}

/**
 * 初始状态
 */
const initialState: AuthState = {
  isAuthenticated: !!localStorage.getItem('token'),
  token: localStorage.getItem('token'),
  user: null,
  loading: false,
  error: null,
  loginAttempts: 0,
  lastLoginTime: null,
  sessionExpiry: null,
};

/**
 * 异步登录操作
 */
export const login = createAsyncThunk(
  'auth/login',
  async (credentials: { username: string; password: string; remember: boolean }, { rejectWithValue }) => {
    try {
      const response = await authAPI.login(credentials);
      
      // 设置会话过期时间（记住我：30天，否则：24小时）
      const expiryTime = Date.now() + (credentials.remember ? 30 * 24 * 60 * 60 * 1000 : 24 * 60 * 60 * 1000);
      
      // 根据记住我选项决定存储位置
      const storage = credentials.remember ? localStorage : sessionStorage;
      storage.setItem('token', response.token);
      storage.setItem('sessionExpiry', expiryTime.toString());
      
      return {
        token: response.token,
        user: response.user,
        sessionExpiry: expiryTime,
        loginTime: Date.now()
      };
    } catch (error: any) {
      return rejectWithValue(error.message || '登录失败');
    }
  }
);

/**
 * 异步获取用户信息
 */
export const fetchUserInfo = createAsyncThunk(
  'auth/fetchUserInfo',
  async (_, { rejectWithValue }) => {
    try {
      const userInfo = await authAPI.getUserInfo();
      return userInfo;
    } catch (error: any) {
      return rejectWithValue(error.message || '获取用户信息失败');
    }
  }
);

/**
 * 异步登出操作
 */
export const logoutAsync = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      await authAPI.logout();
      // 清除所有存储的认证信息
      localStorage.removeItem('token');
      localStorage.removeItem('sessionExpiry');
      sessionStorage.removeItem('token');
      sessionStorage.removeItem('sessionExpiry');
    } catch (error: any) {
      // 即使登出API失败，也要清除本地存储
      localStorage.removeItem('token');
      localStorage.removeItem('sessionExpiry');
      sessionStorage.removeItem('token');
      sessionStorage.removeItem('sessionExpiry');
      console.warn('登出API调用失败，但已清除本地认证信息:', error);
    }
  }
);

/**
 * 刷新token
 */
export const refreshToken = createAsyncThunk(
  'auth/refreshToken',
  async (_, { rejectWithValue }) => {
    try {
      const response = await authAPI.refreshToken();
      
      // 更新token和过期时间
      const expiryTime = Date.now() + 24 * 60 * 60 * 1000; // 24小时
      const storage = localStorage.getItem('token') ? localStorage : sessionStorage;
      storage.setItem('token', response.token);
      storage.setItem('sessionExpiry', expiryTime.toString());
      
      return {
        token: response.token,
        sessionExpiry: expiryTime
      };
    } catch (error: any) {
      return rejectWithValue(error.message || '刷新token失败');
    }
  }
);

/**
 * 检查会话是否过期
 */
export const checkSessionExpiry = createAsyncThunk(
  'auth/checkSessionExpiry',
  async (_, { getState, dispatch }) => {
    const state = getState() as { auth: AuthState };
    const { sessionExpiry, token } = state.auth;
    
    if (!token || !sessionExpiry) {
      return false;
    }
    
    const now = Date.now();
    const timeUntilExpiry = sessionExpiry - now;
    
    // 如果会话已过期
    if (timeUntilExpiry <= 0) {
      dispatch(logout());
      return false;
    }
    
    // 如果会话即将过期（30分钟内），尝试刷新token
    if (timeUntilExpiry <= 30 * 60 * 1000) {
      try {
        await dispatch(refreshToken()).unwrap();
        return true;
      } catch (error) {
        dispatch(logout());
        return false;
      }
    }
    
    return true;
  }
);

/**
 * 认证状态切片
 */
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    /**
     * 登录成功
     */
    loginSuccess: (state, action: PayloadAction<{ token: string; user: any }>) => {
      return {
        ...state,
        isAuthenticated: true,
        token: action.payload.token,
        user: action.payload.user,
        error: null,
        loginAttempts: 0,
        lastLoginTime: Date.now(),
      };
    },
    
    /**
     * 登出
     */
    logout: (state) => {
      // 清除所有存储的认证信息
      localStorage.removeItem('token');
      localStorage.removeItem('sessionExpiry');
      sessionStorage.removeItem('token');
      sessionStorage.removeItem('sessionExpiry');
      
      return {
        ...initialState,
        isAuthenticated: false,
        token: null,
        user: null,
        loginAttempts: 0,
        lastLoginTime: null,
        sessionExpiry: null,
      };
    },
    
    /**
     * 更新用户信息
     */
    updateUser: (state, action: PayloadAction<any>) => {
      return {
        ...state,
        user: { ...state.user, ...action.payload },
      };
    },
    
    /**
     * 清除错误信息
     */
    clearError: (state) => {
      return {
        ...state,
        error: null,
      };
    },
    
    /**
     * 增加登录尝试次数
     */
    incrementLoginAttempts: (state) => {
      return {
        ...state,
        loginAttempts: state.loginAttempts + 1,
      };
    },
    
    /**
     * 重置登录尝试次数
     */
    resetLoginAttempts: (state) => {
      return {
        ...state,
        loginAttempts: 0,
      };
    },
    
    /**
     * 设置会话过期时间
     */
    setSessionExpiry: (state, action: PayloadAction<number>) => {
      return {
        ...state,
        sessionExpiry: action.payload,
      };
    },
  },
  extraReducers: (builder) => {
    builder
      // 登录
      .addCase(login.pending, (state) => {
        return {
          ...state,
          loading: true,
          error: null,
        };
      })
      .addCase(login.fulfilled, (state, action) => {
        return {
          ...state,
          isAuthenticated: true,
          token: action.payload.token,
          user: action.payload.user,
          loading: false,
          error: null,
          loginAttempts: 0,
          lastLoginTime: action.payload.loginTime,
          sessionExpiry: action.payload.sessionExpiry,
        };
      })
      .addCase(login.rejected, (state, action) => {
        return {
          ...state,
          loading: false,
          error: action.payload as string,
          loginAttempts: state.loginAttempts + 1,
        };
      })
      // 获取用户信息
      .addCase(fetchUserInfo.pending, (state) => {
        return {
          ...state,
          loading: true,
        };
      })
      .addCase(fetchUserInfo.fulfilled, (state, action) => {
        return {
          ...state,
          user: action.payload,
          loading: false,
          error: null,
        };
      })
      .addCase(fetchUserInfo.rejected, (state, action) => {
        return {
          ...state,
          loading: false,
          error: action.payload as string,
        };
      })
      // 登出
      .addCase(logoutAsync.fulfilled, (state) => {
        return {
          ...initialState,
          isAuthenticated: false,
          token: null,
          user: null,
        };
      })
      // 刷新token
      .addCase(refreshToken.fulfilled, (state, action) => {
        return {
          ...state,
          token: action.payload.token,
          sessionExpiry: action.payload.sessionExpiry,
          error: null,
        };
      })
      .addCase(refreshToken.rejected, (state, action) => {
        return {
          ...state,
          error: action.payload as string,
        };
      });
  },
});

export const { 
  loginSuccess, 
  logout, 
  updateUser, 
  clearError, 
  incrementLoginAttempts, 
  resetLoginAttempts, 
  setSessionExpiry 
} = authSlice.actions;

export default authSlice.reducer;