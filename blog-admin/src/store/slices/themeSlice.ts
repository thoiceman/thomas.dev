import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// 主题类型定义
export type ThemeMode = 'light' | 'dark';

// 主题状态接口
interface ThemeState {
  mode: ThemeMode;
  isTransitioning: boolean;
  systemPreference: ThemeMode;
  followSystem: boolean;
}

// 获取系统主题偏好
const getSystemTheme = (): ThemeMode => {
  if (typeof window !== 'undefined' && window.matchMedia) {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  return 'light';
};

// 从localStorage获取保存的主题设置
const getSavedTheme = (): ThemeMode => {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('theme-mode');
    if (saved === 'light' || saved === 'dark') {
      return saved;
    }
  }
  return getSystemTheme();
};

// 从localStorage获取是否跟随系统设置
const getSavedFollowSystem = (): boolean => {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('theme-follow-system');
    return saved === 'true';
  }
  return false;
};

// 初始状态
const initialState: ThemeState = {
  mode: getSavedTheme(),
  isTransitioning: false,
  systemPreference: getSystemTheme(),
  followSystem: getSavedFollowSystem(),
};

// 主题切片
const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    // 设置主题模式
    setThemeMode: (state, action: PayloadAction<ThemeMode>) => {
      state.mode = action.payload;
      state.followSystem = false;
      
      // 持久化存储
      if (typeof window !== 'undefined') {
        localStorage.setItem('theme-mode', action.payload);
        localStorage.setItem('theme-follow-system', 'false');
      }
    },

    // 切换主题模式
    toggleTheme: (state) => {
      const newMode = state.mode === 'light' ? 'dark' : 'light';
      state.mode = newMode;
      state.followSystem = false;
      
      // 持久化存储
      if (typeof window !== 'undefined') {
        localStorage.setItem('theme-mode', newMode);
        localStorage.setItem('theme-follow-system', 'false');
      }
    },

    // 设置过渡状态
    setTransitioning: (state, action: PayloadAction<boolean>) => {
      state.isTransitioning = action.payload;
    },

    // 更新系统偏好
    updateSystemPreference: (state, action: PayloadAction<ThemeMode>) => {
      state.systemPreference = action.payload;
      
      // 如果跟随系统设置，则更新当前主题
      if (state.followSystem) {
        state.mode = action.payload;
        if (typeof window !== 'undefined') {
          localStorage.setItem('theme-mode', action.payload);
        }
      }
    },

    // 设置是否跟随系统
    setFollowSystem: (state, action: PayloadAction<boolean>) => {
      state.followSystem = action.payload;
      
      // 如果启用跟随系统，则使用系统偏好
      if (action.payload) {
        state.mode = state.systemPreference;
      }
      
      // 持久化存储
      if (typeof window !== 'undefined') {
        localStorage.setItem('theme-follow-system', action.payload.toString());
        if (action.payload) {
          localStorage.setItem('theme-mode', state.systemPreference);
        }
      }
    },

    // 重置主题设置
    resetTheme: (state) => {
      state.mode = 'light';
      state.followSystem = false;
      state.isTransitioning = false;
      
      // 清除持久化存储
      if (typeof window !== 'undefined') {
        localStorage.removeItem('theme-mode');
        localStorage.removeItem('theme-follow-system');
      }
    },
  },
});

// 导出actions
export const {
  setThemeMode,
  toggleTheme,
  setTransitioning,
  updateSystemPreference,
  setFollowSystem,
  resetTheme,
} = themeSlice.actions;

// 导出reducer
export default themeSlice.reducer;

// 选择器
export const selectTheme = (state: { theme: ThemeState }) => state.theme;
export const selectThemeMode = (state: { theme: ThemeState }) => state.theme.mode;
export const selectIsTransitioning = (state: { theme: ThemeState }) => state.theme.isTransitioning;