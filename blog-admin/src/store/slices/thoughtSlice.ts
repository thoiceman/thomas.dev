/**
 * 想法管理状态管理切片
 */

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { message } from 'antd';
import type {
  Thought,
  ThoughtCreateRequest,
  ThoughtUpdateRequest,
  ThoughtQueryParams,
  ThoughtPaginationResponse,
  ThoughtStats,
} from '../../types/thought';
import * as thoughtAPI from '../../api/thought';

// 异步操作：获取想法列表
export const fetchThoughts = createAsyncThunk(
  'thought/fetchThoughts',
  async (params: ThoughtQueryParams = {}) => {
    const response = await thoughtAPI.getThoughts(params);
    return response;
  }
);

// 异步操作：创建想法
export const createThought = createAsyncThunk(
  'thought/createThought',
  async (thoughtData: ThoughtCreateRequest) => {
    const response = await thoughtAPI.createThought(thoughtData);
    return response;
  }
);

// 异步操作：更新想法
export const updateThought = createAsyncThunk(
  'thought/updateThought',
  async (params: { id: number; data: ThoughtUpdateRequest }) => {
    const response = await thoughtAPI.updateThought(params.id, params.data);
    return response;
  }
);

// 异步操作：删除想法
export const deleteThought = createAsyncThunk(
  'thought/deleteThought',
  async (id: number) => {
    await thoughtAPI.deleteThought(id);
    return id;
  }
);

// 异步操作：批量删除想法
export const batchDeleteThoughts = createAsyncThunk(
  'thought/batchDeleteThoughts',
  async (ids: number[]) => {
    await thoughtAPI.batchDeleteThoughts(ids);
    return ids;
  }
);

// 异步操作：获取想法统计信息
export const fetchThoughtStats = createAsyncThunk(
  'thought/fetchThoughtStats',
  async () => {
    const response = await thoughtAPI.getThoughtStats();
    return response;
  }
);

// 异步操作：上传图片
export const uploadThoughtImage = createAsyncThunk(
  'thought/uploadThoughtImage',
  async (file: File) => {
    const response = await thoughtAPI.uploadThoughtImage(file);
    return response;
  }
);

// 状态接口定义
interface ThoughtState {
  // 想法列表数据
  thoughts: Thought[];
  // 分页信息
  pagination: {
    current: number;
    pageSize: number;
    total: number;
  };
  // 加载状态
  loading: boolean;
  // 统计信息
  stats: ThoughtStats | null;
  // 错误信息
  error: string | null;
}

// 初始状态
const initialState: ThoughtState = {
  thoughts: [],
  pagination: {
    current: 1,
    pageSize: 10,
    total: 0,
  },
  loading: false,
  stats: null,
  error: null,
};

// 创建切片
const thoughtSlice = createSlice({
  name: 'thought',
  initialState,
  reducers: {
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
    // 获取想法列表
    builder
      .addCase(fetchThoughts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchThoughts.fulfilled, (state, action: PayloadAction<ThoughtPaginationResponse>) => {
        state.loading = false;
        state.thoughts = action.payload.content;
        state.pagination = {
          current: action.payload.currentPage,
          pageSize: action.payload.size,
          total: action.payload.totalElements,
        };
      })
      .addCase(fetchThoughts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || '获取想法列表失败';
        message.error('获取想法列表失败');
      });

    // 创建想法
    builder
      .addCase(createThought.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createThought.fulfilled, (state, action: PayloadAction<Thought>) => {
        state.loading = false;
        state.thoughts.unshift(action.payload);
        state.pagination.total += 1;
        message.success('想法创建成功');
      })
      .addCase(createThought.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || '创建想法失败';
        message.error('创建想法失败');
      });

    // 更新想法
    builder
      .addCase(updateThought.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateThought.fulfilled, (state, action: PayloadAction<Thought>) => {
        state.loading = false;
        const index = state.thoughts.findIndex(thought => thought.id === action.payload.id);
        if (index !== -1) {
          state.thoughts[index] = action.payload;
        }
        message.success('想法更新成功');
      })
      .addCase(updateThought.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || '更新想法失败';
        message.error('更新想法失败');
      });

    // 删除想法
    builder
      .addCase(deleteThought.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteThought.fulfilled, (state, action: PayloadAction<number>) => {
        state.loading = false;
        state.thoughts = state.thoughts.filter(thought => thought.id !== action.payload);
        state.pagination.total -= 1;
        message.success('想法删除成功');
      })
      .addCase(deleteThought.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || '删除想法失败';
        message.error('删除想法失败');
      });

    // 批量删除想法
    builder
      .addCase(batchDeleteThoughts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(batchDeleteThoughts.fulfilled, (state, action: PayloadAction<number[]>) => {
        state.loading = false;
        state.thoughts = state.thoughts.filter(thought => !action.payload.includes(thought.id));
        state.pagination.total -= action.payload.length;
        message.success(`成功删除 ${action.payload.length} 个想法`);
      })
      .addCase(batchDeleteThoughts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || '批量删除想法失败';
        message.error('批量删除想法失败');
      });

    // 获取统计信息
    builder
      .addCase(fetchThoughtStats.pending, (state) => {
        state.error = null;
      })
      .addCase(fetchThoughtStats.fulfilled, (state, action: PayloadAction<ThoughtStats>) => {
        state.stats = action.payload;
      })
      .addCase(fetchThoughtStats.rejected, (state, action) => {
        state.error = action.error.message || '获取统计信息失败';
        message.error('获取统计信息失败');
      });

    // 上传图片
    builder
      .addCase(uploadThoughtImage.pending, (state) => {
        state.error = null;
      })
      .addCase(uploadThoughtImage.fulfilled, (state, action: PayloadAction<string>) => {
        message.success('图片上传成功');
      })
      .addCase(uploadThoughtImage.rejected, (state, action) => {
        state.error = action.error.message || '图片上传失败';
        message.error('图片上传失败');
      });
  },
});

// 导出actions
export const { clearError, resetState } = thoughtSlice.actions;

// 导出reducer
export default thoughtSlice.reducer;