import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import TagAPI from '../../api/tag';
import type {
  Tag,
  TagCreateRequest,
  TagUpdateRequest,
  TagQueryParams,
  TagPageResponse
} from '../../types/tag';

// 定义标签状态接口
interface TagState {
  // 标签列表数据
  tags: Tag[];
  // 分页信息
  pagination: {
    currentPage: number;
    totalPages: number;
    totalElements: number;
    size: number;
    hasNext: boolean;
    hasPrevious: boolean;
  };
  // 当前选中的标签
  selectedTag: Tag | null;
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
  queryParams: TagQueryParams;
  // 热门标签列表（用于推荐）
  popularTags: Tag[];
  // 统计信息
  stats: {
    total: number;
    totalUseCount: number;
    averageUseCount: number;
    mostUsedTag: Tag | null;
  } | null;
}

// 初始状态
const initialState: TagState = {
  tags: [],
  pagination: {
    currentPage: 1,
    totalPages: 0,
    totalElements: 0,
    size: 10,
    hasNext: false,
    hasPrevious: false,
  },
  selectedTag: null,
  loading: {
    list: false,
    detail: false,
    create: false,
    update: false,
    delete: false,
    batchDelete: false,
  },
  error: null,
  queryParams: {
    page: 1,
    size: 10,
    sortBy: 'createTime',
    sortOrder: 'desc',
  },
  popularTags: [],
  stats: null,
};

// 异步操作：获取标签列表
export const fetchTags = createAsyncThunk(
  'tag/fetchTags',
  async (params: TagQueryParams = {}, { rejectWithValue }) => {
    try {
      return await TagAPI.getTags(params);
    } catch (error: any) {
      return rejectWithValue(error.message || '获取标签列表失败');
    }
  }
);

// 异步操作：根据ID获取标签详情
export const fetchTagById = createAsyncThunk(
  'tag/fetchTagById',
  async (id: number, { rejectWithValue }) => {
    try {
      return await TagAPI.getTagById(id);
    } catch (error: any) {
      return rejectWithValue(error.message || '获取标签详情失败');
    }
  }
);

// 异步操作：创建标签
export const createTag = createAsyncThunk(
  'tag/createTag',
  async (data: TagCreateRequest, { rejectWithValue }) => {
    try {
      return await TagAPI.createTag(data);
    } catch (error: any) {
      return rejectWithValue(error.message || '创建标签失败');
    }
  }
);

// 异步操作：更新标签
export const updateTag = createAsyncThunk(
  'tag/updateTag',
  async ({ id, data }: { id: number; data: TagUpdateRequest }, { rejectWithValue }) => {
    try {
      return await TagAPI.updateTag(id, data);
    } catch (error: any) {
      return rejectWithValue(error.message || '更新标签失败');
    }
  }
);

// 异步操作：删除标签
export const deleteTag = createAsyncThunk(
  'tag/deleteTag',
  async (id: number, { rejectWithValue }) => {
    try {
      await TagAPI.deleteTag(id);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.message || '删除标签失败');
    }
  }
);

// 异步操作：批量删除标签
export const batchDeleteTags = createAsyncThunk(
  'tag/batchDeleteTags',
  async (ids: number[], { rejectWithValue }) => {
    try {
      await TagAPI.batchDeleteTags(ids);
      return ids;
    } catch (error: any) {
      return rejectWithValue(error.message || '批量删除标签失败');
    }
  }
);

// 异步操作：获取热门标签
export const fetchPopularTags = createAsyncThunk(
  'tag/fetchPopularTags',
  async (limit: number = 10, { rejectWithValue }) => {
    try {
      return await TagAPI.getPopularTags(limit);
    } catch (error: any) {
      return rejectWithValue(error.message || '获取热门标签失败');
    }
  }
);

// 异步操作：获取标签统计信息
export const fetchTagStats = createAsyncThunk(
  'tag/fetchTagStats',
  async (_, { rejectWithValue }) => {
    try {
      return await TagAPI.getTagStats();
    } catch (error: any) {
      return rejectWithValue(error.message || '获取标签统计失败');
    }
  }
);

// 创建标签slice
const tagSlice = createSlice({
  name: 'tag',
  initialState,
  reducers: {
    // 设置查询参数
    setQueryParams: (state, action: PayloadAction<Partial<TagQueryParams>>) => {
      state.queryParams = { ...state.queryParams, ...action.payload };
    },
    // 重置查询参数
    resetQueryParams: (state) => {
      state.queryParams = {
        page: 1,
        size: 10,
        sortBy: 'createTime',
        sortOrder: 'desc',
      };
    },
    // 设置选中的标签
    setSelectedTag: (state, action: PayloadAction<Tag | null>) => {
      state.selectedTag = action.payload;
    },
    // 清除错误信息
    clearError: (state) => {
      state.error = null;
    },
    // 重置状态
    resetState: (state) => {
      return initialState;
    },
  },
  extraReducers: (builder) => {
    // 获取标签列表
    builder
      .addCase(fetchTags.pending, (state) => {
        state.loading.list = true;
        state.error = null;
      })
      .addCase(fetchTags.fulfilled, (state, action) => {
        state.loading.list = false;
        const response = action.payload as TagPageResponse;
        state.tags = response.content;
        state.pagination = {
          currentPage: response.currentPage,
          totalPages: response.totalPages,
          totalElements: response.totalElements,
          size: response.size,
          hasNext: response.hasNext,
          hasPrevious: response.hasPrevious,
        };
      })
      .addCase(fetchTags.rejected, (state, action) => {
        state.loading.list = false;
        state.error = action.payload as string;
      });

    // 获取标签详情
    builder
      .addCase(fetchTagById.pending, (state) => {
        state.loading.detail = true;
        state.error = null;
      })
      .addCase(fetchTagById.fulfilled, (state, action) => {
        state.loading.detail = false;
        state.selectedTag = action.payload as Tag;
      })
      .addCase(fetchTagById.rejected, (state, action) => {
        state.loading.detail = false;
        state.error = action.payload as string;
      });

    // 创建标签
    builder
      .addCase(createTag.pending, (state) => {
        state.loading.create = true;
        state.error = null;
      })
      .addCase(createTag.fulfilled, (state, action) => {
        state.loading.create = false;
        const newTag = action.payload as Tag;
        state.tags.unshift(newTag);
        state.pagination.totalElements += 1;
      })
      .addCase(createTag.rejected, (state, action) => {
        state.loading.create = false;
        state.error = action.payload as string;
      });

    // 更新标签
    builder
      .addCase(updateTag.pending, (state) => {
        state.loading.update = true;
        state.error = null;
      })
      .addCase(updateTag.fulfilled, (state, action) => {
        state.loading.update = false;
        const updatedTag = action.payload as Tag;
        const index = state.tags.findIndex(tag => tag.id === updatedTag.id);
        if (index !== -1) {
          state.tags[index] = updatedTag;
        }
        if (state.selectedTag?.id === updatedTag.id) {
          state.selectedTag = updatedTag;
        }
      })
      .addCase(updateTag.rejected, (state, action) => {
        state.loading.update = false;
        state.error = action.payload as string;
      });

    // 删除标签
    builder
      .addCase(deleteTag.pending, (state) => {
        state.loading.delete = true;
        state.error = null;
      })
      .addCase(deleteTag.fulfilled, (state, action) => {
        state.loading.delete = false;
        const deletedId = action.payload as number;
        state.tags = state.tags.filter(tag => tag.id !== deletedId);
        state.pagination.totalElements -= 1;
        if (state.selectedTag?.id === deletedId) {
          state.selectedTag = null;
        }
      })
      .addCase(deleteTag.rejected, (state, action) => {
        state.loading.delete = false;
        state.error = action.payload as string;
      });

    // 批量删除标签
    builder
      .addCase(batchDeleteTags.pending, (state) => {
        state.loading.batchDelete = true;
        state.error = null;
      })
      .addCase(batchDeleteTags.fulfilled, (state, action) => {
        state.loading.batchDelete = false;
        const deletedIds = action.payload as number[];
        state.tags = state.tags.filter(tag => !deletedIds.includes(tag.id));
        state.pagination.totalElements -= deletedIds.length;
        if (state.selectedTag && deletedIds.includes(state.selectedTag.id)) {
          state.selectedTag = null;
        }
      })
      .addCase(batchDeleteTags.rejected, (state, action) => {
        state.loading.batchDelete = false;
        state.error = action.payload as string;
      });

    // 获取热门标签
    builder
      .addCase(fetchPopularTags.fulfilled, (state, action) => {
        state.popularTags = action.payload as Tag[];
      });

    // 获取标签统计
    builder
      .addCase(fetchTagStats.fulfilled, (state, action) => {
        state.stats = action.payload as TagState['stats'];
      });
  },
});

// 导出actions
export const {
  setQueryParams,
  resetQueryParams,
  setSelectedTag,
  clearError,
  resetState,
} = tagSlice.actions;

// 导出reducer
export default tagSlice.reducer;