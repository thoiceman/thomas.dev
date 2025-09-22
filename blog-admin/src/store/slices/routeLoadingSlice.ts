import { createSlice, PayloadAction } from '@reduxjs/toolkit';

/**
 * 路由加载状态接口
 */
interface RouteLoadingState {
  /** 是否正在加载 */
  loading: boolean;
  /** 当前加载的路由路径 */
  currentPath: string;
  /** 加载开始时间 */
  startTime: number | null;
  /** 加载进度（0-100） */
  progress: number;
  /** 加载配置 */
  config: {
    minLoadingTime: number;
    maxLoadingTime: number;
    delayStart: number;
  };
}

/**
 * 初始状态
 */
const initialState: RouteLoadingState = {
  loading: false,
  currentPath: '',
  startTime: null,
  progress: 0,
  config: {
    minLoadingTime: 300,
    maxLoadingTime: 5000,
    delayStart: 100,
  },
};

/**
 * 路由加载状态管理slice
 */
const routeLoadingSlice = createSlice({
  name: 'routeLoading',
  initialState,
  reducers: {
    /**
     * 开始路由加载
     */
    startRouteLoading: (state, action: PayloadAction<{ path: string }>) => {
      return {
        ...state,
        loading: true,
        currentPath: action.payload.path,
        startTime: Date.now(),
        progress: 0,
      };
    },

    /**
     * 更新加载进度
     */
    updateProgress: (state, action: PayloadAction<number>) => {
      return {
        ...state,
        progress: Math.min(Math.max(action.payload, 0), 100),
      };
    },

    /**
     * 完成路由加载
     */
    completeRouteLoading: (state) => {
      return {
        ...state,
        progress: 100,
        loading: false,
        currentPath: '',
        startTime: null,
      };
    },

    /**
     * 取消路由加载
     */
    cancelRouteLoading: (state) => {
      return {
        ...state,
        loading: false,
        currentPath: '',
        startTime: null,
        progress: 0,
      };
    },

    /**
     * 更新加载配置
     */
    updateConfig: (state, action: PayloadAction<Partial<RouteLoadingState['config']>>) => {
      return {
        ...state,
        config: { ...state.config, ...action.payload },
      };
    },

    /**
     * 重置状态
     */
    resetRouteLoading: () => {
      return initialState;
    },
  },
});

export const {
  startRouteLoading,
  updateProgress,
  completeRouteLoading,
  cancelRouteLoading,
  updateConfig,
  resetRouteLoading,
} = routeLoadingSlice.actions;

export default routeLoadingSlice.reducer;

// 选择器
export const selectRouteLoading = (state: { routeLoading: RouteLoadingState }) => state.routeLoading.loading;
export const selectRouteProgress = (state: { routeLoading: RouteLoadingState }) => state.routeLoading.progress;
export const selectCurrentPath = (state: { routeLoading: RouteLoadingState }) => state.routeLoading.currentPath;
export const selectLoadingConfig = (state: { routeLoading: RouteLoadingState }) => state.routeLoading.config;