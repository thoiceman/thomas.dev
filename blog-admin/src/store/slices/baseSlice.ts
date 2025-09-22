import { createSlice, PayloadAction } from '@reduxjs/toolkit';

/**
 * 通用状态接口
 */
export interface BaseState<T, Q> {
  // 数据列表
  items: T[];
  // 分页信息
  pagination: {
    currentPage: number;
    totalPages: number;
    totalElements: number;
    size: number;
    hasNext: boolean;
    hasPrevious: boolean;
  };
  // 当前选中项
  selectedItem: T | null;
  // 加载状态
  loading: {
    list: boolean;
    detail: boolean;
    create: boolean;
    update: boolean;
    delete: boolean;
    batchDelete: boolean;
  };
  // 错误信息
  error: string | null;
  // 查询参数
  queryParams: Q;
}

/**
 * 创建通用的初始状态
 */
export function createBaseInitialState<T, Q>(defaultQueryParams: Q): BaseState<T, Q> {
  return {
    items: [],
    pagination: {
      currentPage: 1,
      totalPages: 0,
      totalElements: 0,
      size: 10,
      hasNext: false,
      hasPrevious: false,
    },
    selectedItem: null,
    loading: {
      list: false,
      detail: false,
      create: false,
      update: false,
      delete: false,
      batchDelete: false,
    },
    error: null,
    queryParams: defaultQueryParams,
  };
}

/**
 * 通用的reducers
 */
export function createBaseReducers<T, Q>() {
  return {
    // 设置查询参数
    setQueryParams: (state: BaseState<T, Q>, action: PayloadAction<Partial<Q>>) => {
      state.queryParams = { ...state.queryParams, ...action.payload };
    },
    
    // 重置查询参数
    resetQueryParams: (state: BaseState<T, Q>) => {
      state.queryParams = { ...state.queryParams, page: 1 };
    },
    
    // 设置选中项
    setSelectedItem: (state: BaseState<T, Q>, action: PayloadAction<T | null>) => {
      state.selectedItem = action.payload;
    },
    
    // 清除错误
    clearError: (state: BaseState<T, Q>) => {
      state.error = null;
    },
    
    // 重置状态
    resetState: (state: BaseState<T, Q>) => {
      state.items = [];
      state.selectedItem = null;
      state.error = null;
      state.pagination = {
        currentPage: 1,
        totalPages: 0,
        totalElements: 0,
        size: 10,
        hasNext: false,
        hasPrevious: false,
      };
    },
  };
}

/**
 * 通用的loading状态处理
 */
export function createLoadingHandlers<T, Q>() {
  return {
    // 开始加载
    setLoading: (state: BaseState<T, Q>, action: PayloadAction<keyof BaseState<T, Q>['loading']>) => {
      state.loading[action.payload] = true;
      state.error = null;
    },
    
    // 结束加载
    setLoadingComplete: (state: BaseState<T, Q>, action: PayloadAction<keyof BaseState<T, Q>['loading']>) => {
      state.loading[action.payload] = false;
    },
    
    // 设置错误
    setError: (state: BaseState<T, Q>, action: PayloadAction<string>) => {
      state.error = action.payload;
      // 重置所有loading状态
      Object.keys(state.loading).forEach(key => {
        state.loading[key as keyof BaseState<T, Q>['loading']] = false;
      });
    },
  };
}