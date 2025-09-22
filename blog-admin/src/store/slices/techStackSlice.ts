/**
 * 技术栈状态管理切片
 */

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { message } from 'antd';
import type {
  TechStack,
  TechStackCreateRequest,
  TechStackUpdateRequest,
  TechStackQueryParams,
  TechStackPageResponse,
  TechStackStats,
} from '../../types/techStack';
import * as techStackAPI from '../../api/techStack';

/**
 * 技术栈状态接口
 */
interface TechStackState {
  // 技术栈列表
  techStacks: TechStack[];
  // 分页信息
  pagination: {
    current: number;
    pageSize: number;
    total: number;
  };
  // 加载状态
  loading: boolean;
  // 查询参数
  queryParams: TechStackQueryParams;
  // 统计信息
  stats: TechStackStats | null;
  // 热门技术栈
  popularTechStacks: TechStack[];
  // 错误信息
  error: string | null;
}

/**
 * 初始状态
 */
const initialState: TechStackState = {
  techStacks: [],
  pagination: {
    current: 1,
    pageSize: 10,
    total: 0,
  },
  loading: false,
  queryParams: {},
  stats: null,
  popularTechStacks: [],
  error: null,
};

/**
 * 异步操作：获取技术栈列表
 */
export const fetchTechStacks = createAsyncThunk(
  'techStack/fetchTechStacks',
  async (params: TechStackQueryParams = {}, { rejectWithValue }) => {
    try {
      const response = await techStackAPI.fetchTechStackList(params);
      return response;
    } catch (error: any) {
      message.error(error.message || '获取技术栈列表失败');
      return rejectWithValue(error.message);
    }
  }
);

/**
 * 异步操作：创建技术栈
 */
export const createTechStack = createAsyncThunk(
  'techStack/createTechStack',
  async (data: TechStackCreateRequest, { rejectWithValue }) => {
    try {
      const response = await techStackAPI.createTechStack(data);
      message.success('技术栈创建成功');
      return response;
    } catch (error: any) {
      message.error(error.message || '创建技术栈失败');
      return rejectWithValue(error.message);
    }
  }
);

/**
 * 异步操作：更新技术栈
 */
export const updateTechStack = createAsyncThunk(
  'techStack/updateTechStack',
  async (data: TechStackUpdateRequest, { rejectWithValue }) => {
    try {
      const response = await techStackAPI.updateTechStack(data);
      message.success('技术栈更新成功');
      return response;
    } catch (error: any) {
      message.error(error.message || '更新技术栈失败');
      return rejectWithValue(error.message);
    }
  }
);

/**
 * 异步操作：删除技术栈
 */
export const deleteTechStack = createAsyncThunk(
  'techStack/deleteTechStack',
  async (id: number, { rejectWithValue }) => {
    try {
      await techStackAPI.deleteTechStack(id);
      message.success('技术栈删除成功');
      return id;
    } catch (error: any) {
      message.error(error.message || '删除技术栈失败');
      return rejectWithValue(error.message);
    }
  }
);

/**
 * 异步操作：批量删除技术栈
 */
export const batchDeleteTechStacks = createAsyncThunk(
  'techStack/batchDeleteTechStacks',
  async (ids: number[], { rejectWithValue }) => {
    try {
      await techStackAPI.batchDeleteTechStacks(ids);
      message.success(`成功删除 ${ids.length} 个技术栈`);
      return ids;
    } catch (error: any) {
      message.error(error.message || '批量删除技术栈失败');
      return rejectWithValue(error.message);
    }
  }
);

/**
 * 异步操作：更新技术栈状态
 */
export const updateTechStackStatus = createAsyncThunk(
  'techStack/updateTechStackStatus',
  async ({ id, status }: { id: number; status: number }, { rejectWithValue }) => {
    try {
      const response = await techStackAPI.updateTechStackStatus(id, status);
      message.success('技术栈状态更新成功');
      return response;
    } catch (error: any) {
      message.error(error.message || '更新技术栈状态失败');
      return rejectWithValue(error.message);
    }
  }
);

/**
 * 异步操作：批量更新技术栈状态
 */
export const batchUpdateTechStackStatus = createAsyncThunk(
  'techStack/batchUpdateTechStackStatus',
  async ({ ids, status }: { ids: number[]; status: number }, { rejectWithValue }) => {
    try {
      await techStackAPI.batchUpdateTechStackStatus(ids, status);
      message.success(`成功更新 ${ids.length} 个技术栈状态`);
      return { ids, status };
    } catch (error: any) {
      message.error(error.message || '批量更新技术栈状态失败');
      return rejectWithValue(error.message);
    }
  }
);

/**
 * 异步操作：获取技术栈统计信息
 */
export const fetchTechStackStats = createAsyncThunk(
  'techStack/fetchTechStackStats',
  async (_, { rejectWithValue }) => {
    try {
      const response = await techStackAPI.fetchTechStackStats();
      return response;
    } catch (error: any) {
      message.error(error.message || '获取技术栈统计信息失败');
      return rejectWithValue(error.message);
    }
  }
);

/**
 * 异步操作：获取热门技术栈
 */
export const fetchPopularTechStacks = createAsyncThunk(
  'techStack/fetchPopularTechStacks',
  async (limit: number = 10, { rejectWithValue }) => {
    try {
      const response = await techStackAPI.fetchPopularTechStacks(limit);
      return response;
    } catch (error: any) {
      message.error(error.message || '获取热门技术栈失败');
      return rejectWithValue(error.message);
    }
  }
);

/**
 * 技术栈切片
 */
const techStackSlice = createSlice({
  name: 'techStack',
  initialState,
  reducers: {
    // 设置查询参数
    setQueryParams: (state, action: PayloadAction<TechStackQueryParams>) => {
      state.queryParams = { ...state.queryParams, ...action.payload };
    },
    // 重置查询参数
    resetQueryParams: (state) => {
      state.queryParams = {};
    },
    // 清除错误信息
    clearError: (state) => {
      state.error = null;
    },
    // 重置状态
    resetState: (state) => {
      Object.assign(state, initialState);
    },
  },
  extraReducers: (builder) => {
    builder
      // 获取技术栈列表
      .addCase(fetchTechStacks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTechStacks.fulfilled, (state, action) => {
        state.loading = false;
        state.techStacks = action.payload.list;
        state.pagination = {
          current: action.payload.page,
          pageSize: action.payload.pageSize,
          total: action.payload.total,
        };
      })
      .addCase(fetchTechStacks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // 创建技术栈
      .addCase(createTechStack.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createTechStack.fulfilled, (state, action) => {
        state.loading = false;
        state.techStacks.unshift(action.payload);
        state.pagination.total += 1;
      })
      .addCase(createTechStack.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // 更新技术栈
      .addCase(updateTechStack.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateTechStack.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.techStacks.findIndex(item => item.id === action.payload.id);
        if (index !== -1) {
          state.techStacks[index] = action.payload;
        }
      })
      .addCase(updateTechStack.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // 删除技术栈
      .addCase(deleteTechStack.fulfilled, (state, action) => {
        state.techStacks = state.techStacks.filter(item => item.id !== action.payload);
        state.pagination.total -= 1;
      })
      // 批量删除技术栈
      .addCase(batchDeleteTechStacks.fulfilled, (state, action) => {
        state.techStacks = state.techStacks.filter(item => !action.payload.includes(item.id));
        state.pagination.total -= action.payload.length;
      })
      // 更新技术栈状态
      .addCase(updateTechStackStatus.fulfilled, (state, action) => {
        const index = state.techStacks.findIndex(item => item.id === action.payload.id);
        if (index !== -1) {
          state.techStacks[index] = action.payload;
        }
      })
      // 批量更新技术栈状态
      .addCase(batchUpdateTechStackStatus.fulfilled, (state, action) => {
        const { ids, status } = action.payload;
        state.techStacks.forEach(item => {
          if (ids.includes(item.id)) {
            item.status = status;
          }
        });
      })
      // 获取技术栈统计信息
      .addCase(fetchTechStackStats.fulfilled, (state, action) => {
        state.stats = action.payload;
      })
      // 获取热门技术栈
      .addCase(fetchPopularTechStacks.fulfilled, (state, action) => {
        state.popularTechStacks = action.payload;
      });
  },
});

// 导出actions
export const {
  setQueryParams,
  resetQueryParams,
  clearError,
  resetState,
} = techStackSlice.actions;

// 导出reducer
export default techStackSlice.reducer;