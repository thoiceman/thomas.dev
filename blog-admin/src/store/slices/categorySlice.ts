import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import CategoryAPI from '../../api/category';
import type {
  Category,
  CategoryCreateRequest,
  CategoryUpdateRequest,
  CategoryQueryParams,
  CategoryPageResponse
} from '../../types/category';
import { CategoryStatus } from '../../types/category';

// 定义分类状态接口
interface CategoryState {
  // 分类列表数据
  categories: Category[];
  // 分页信息
  pagination: {
    currentPage: number;
    totalPages: number;
    totalElements: number;
    size: number;
    hasNext: boolean;
    hasPrevious: boolean;
  };
  // 当前选中的分类
  selectedCategory: Category | null;
  // 加载状态
  loading: {
    list: boolean;
    detail: boolean;
    create: boolean;
    update: boolean;
    delete: boolean;
    batchDelete: boolean;
    statusUpdate: boolean;
  };
  // 错误信息
  error: string | null;
  // 查询参数
  queryParams: CategoryQueryParams;
  // 启用的分类列表（用于下拉选择）
  activeCategories: Category[];
  // 统计信息
  stats: {
    total: number;
    active: number;
    inactive: number;
    withArticles: number;
  } | null;
}

// 初始状态
const initialState: CategoryState = {
  categories: [],
  pagination: {
    currentPage: 1,
    totalPages: 0,
    totalElements: 0,
    size: 10,
    hasNext: false,
    hasPrevious: false,
  },
  selectedCategory: null,
  loading: {
    list: false,
    detail: false,
    create: false,
    update: false,
    delete: false,
    batchDelete: false,
    statusUpdate: false,
  },
  error: null,
  queryParams: {
    page: 1,
    size: 10,
    sortBy: 'createTime',
    sortOrder: 'desc',
  },
  activeCategories: [],
  stats: null,
};

// 异步操作：获取分类列表
export const fetchCategories = createAsyncThunk(
  'category/fetchCategories',
  async (params: CategoryQueryParams = {}, { rejectWithValue }) => {
    try {
      const response = await CategoryAPI.getCategories(params);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || '获取分类列表失败');
    }
  }
);

// 异步操作：获取分类详情
export const fetchCategoryById = createAsyncThunk(
  'category/fetchCategoryById',
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await CategoryAPI.getCategoryById(id);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || '获取分类详情失败');
    }
  }
);

// 异步操作：创建分类
export const createCategory = createAsyncThunk(
  'category/createCategory',
  async (data: CategoryCreateRequest, { rejectWithValue }) => {
    try {
      const response = await CategoryAPI.createCategory(data);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || '创建分类失败');
    }
  }
);

// 异步操作：更新分类
export const updateCategory = createAsyncThunk(
  'category/updateCategory',
  async ({ id, data }: { id: number; data: CategoryUpdateRequest }, { rejectWithValue }) => {
    try {
      const response = await CategoryAPI.updateCategory(id, data);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || '更新分类失败');
    }
  }
);

// 异步操作：删除分类
export const deleteCategory = createAsyncThunk(
  'category/deleteCategory',
  async (id: number, { rejectWithValue }) => {
    try {
      await CategoryAPI.deleteCategory(id);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.message || '删除分类失败');
    }
  }
);

// 异步操作：批量删除分类
export const batchDeleteCategories = createAsyncThunk(
  'category/batchDeleteCategories',
  async (ids: number[], { rejectWithValue }) => {
    try {
      await CategoryAPI.batchDeleteCategories(ids);
      return ids;
    } catch (error: any) {
      return rejectWithValue(error.message || '批量删除分类失败');
    }
  }
);

// 异步操作：更新分类状态
export const updateCategoryStatus = createAsyncThunk(
  'category/updateCategoryStatus',
  async ({ id, status }: { id: number; status: CategoryStatus }, { rejectWithValue }) => {
    try {
      // 将枚举值转换为API期望的字符串格式
      const statusString = status === CategoryStatus.ENABLED ? 'ACTIVE' : 'INACTIVE';
      const response = await CategoryAPI.updateCategoryStatus(id, statusString);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || '更新分类状态失败');
    }
  }
);

// 异步操作：批量更新分类状态
export const batchUpdateCategoryStatus = createAsyncThunk(
  'category/batchUpdateCategoryStatus',
  async ({ ids, status }: { ids: number[]; status: CategoryStatus }, { rejectWithValue }) => {
    try {
      // 将枚举值转换为API期望的字符串格式
      const statusString = status === CategoryStatus.ENABLED ? 'ACTIVE' : 'INACTIVE';
      await CategoryAPI.batchUpdateCategoryStatus(ids, statusString);
      return { ids, status };
    } catch (error: any) {
      return rejectWithValue(error.message || '批量更新分类状态失败');
    }
  }
);

// 异步操作：获取启用的分类
export const fetchActiveCategories = createAsyncThunk(
  'category/fetchActiveCategories',
  async (_, { rejectWithValue }) => {
    try {
      const response = await CategoryAPI.getActiveCategories();
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || '获取启用分类失败');
    }
  }
);

// 异步操作：获取分类统计
export const fetchCategoryStats = createAsyncThunk(
  'category/fetchCategoryStats',
  async (_, { rejectWithValue }) => {
    try {
      const response = await CategoryAPI.getCategoryStats();
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || '获取分类统计失败');
    }
  }
);

// 创建分类slice
const categorySlice = createSlice({
  name: 'category',
  initialState,
  reducers: {
    // 设置查询参数
    setQueryParams: (state, action: PayloadAction<Partial<CategoryQueryParams>>) => {
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
    // 设置选中的分类
    setSelectedCategory: (state, action: PayloadAction<Category | null>) => {
      state.selectedCategory = action.payload;
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
    // 获取分类列表
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.loading.list = true;
        state.error = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.loading.list = false;
        state.categories = action.payload.content;
        state.pagination = {
          currentPage: action.payload.currentPage,
          totalPages: action.payload.totalPages,
          totalElements: action.payload.totalElements,
          size: action.payload.size,
          hasNext: action.payload.hasNext,
          hasPrevious: action.payload.hasPrevious,
        };
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading.list = false;
        state.error = action.payload as string;
      });

    // 获取分类详情
    builder
      .addCase(fetchCategoryById.pending, (state) => {
        state.loading.detail = true;
        state.error = null;
      })
      .addCase(fetchCategoryById.fulfilled, (state, action) => {
        state.loading.detail = false;
        state.selectedCategory = action.payload;
      })
      .addCase(fetchCategoryById.rejected, (state, action) => {
        state.loading.detail = false;
        state.error = action.payload as string;
      });

    // 创建分类
    builder
      .addCase(createCategory.pending, (state) => {
        state.loading.create = true;
        state.error = null;
      })
      .addCase(createCategory.fulfilled, (state, action) => {
        state.loading.create = false;
        state.categories.unshift(action.payload);
        state.pagination.totalElements += 1;
      })
      .addCase(createCategory.rejected, (state, action) => {
        state.loading.create = false;
        state.error = action.payload as string;
      });

    // 更新分类
    builder
      .addCase(updateCategory.pending, (state) => {
        state.loading.update = true;
        state.error = null;
      })
      .addCase(updateCategory.fulfilled, (state, action) => {
        state.loading.update = false;
        const index = state.categories.findIndex(cat => cat.id === action.payload.id);
        if (index !== -1) {
          state.categories[index] = action.payload;
        }
        if (state.selectedCategory?.id === action.payload.id) {
          state.selectedCategory = action.payload;
        }
      })
      .addCase(updateCategory.rejected, (state, action) => {
        state.loading.update = false;
        state.error = action.payload as string;
      });

    // 删除分类
    builder
      .addCase(deleteCategory.pending, (state) => {
        state.loading.delete = true;
        state.error = null;
      })
      .addCase(deleteCategory.fulfilled, (state, action) => {
        state.loading.delete = false;
        state.categories = state.categories.filter(cat => cat.id !== action.payload);
        state.pagination.totalElements -= 1;
        if (state.selectedCategory?.id === action.payload) {
          state.selectedCategory = null;
        }
      })
      .addCase(deleteCategory.rejected, (state, action) => {
        state.loading.delete = false;
        state.error = action.payload as string;
      });

    // 批量删除分类
    builder
      .addCase(batchDeleteCategories.pending, (state) => {
        state.loading.batchDelete = true;
        state.error = null;
      })
      .addCase(batchDeleteCategories.fulfilled, (state, action) => {
        state.loading.batchDelete = false;
        state.categories = state.categories.filter(cat => !action.payload.includes(cat.id));
        state.pagination.totalElements -= action.payload.length;
      })
      .addCase(batchDeleteCategories.rejected, (state, action) => {
        state.loading.batchDelete = false;
        state.error = action.payload as string;
      });

    // 更新分类状态
    builder
      .addCase(updateCategoryStatus.pending, (state) => {
        state.loading.statusUpdate = true;
        state.error = null;
      })
      .addCase(updateCategoryStatus.fulfilled, (state, action) => {
        state.loading.statusUpdate = false;
        const index = state.categories.findIndex(cat => cat.id === action.payload.id);
        if (index !== -1) {
          state.categories[index] = action.payload;
        }
      })
      .addCase(updateCategoryStatus.rejected, (state, action) => {
        state.loading.statusUpdate = false;
        state.error = action.payload as string;
      });

    // 批量更新分类状态
    builder
      .addCase(batchUpdateCategoryStatus.pending, (state) => {
        state.loading.statusUpdate = true;
        state.error = null;
      })
      .addCase(batchUpdateCategoryStatus.fulfilled, (state, action) => {
        state.loading.statusUpdate = false;
        const { ids, status } = action.payload;
        state.categories.forEach(cat => {
          if (ids.includes(cat.id)) {
            cat.status = status;
          }
        });
      })
      .addCase(batchUpdateCategoryStatus.rejected, (state, action) => {
        state.loading.statusUpdate = false;
        state.error = action.payload as string;
      });

    // 获取启用的分类
    builder
      .addCase(fetchActiveCategories.fulfilled, (state, action) => {
        state.activeCategories = action.payload;
      });

    // 获取分类统计
    builder
      .addCase(fetchCategoryStats.fulfilled, (state, action) => {
        state.stats = action.payload;
      });
  },
});

// 导出actions
export const {
  setQueryParams,
  resetQueryParams,
  setSelectedCategory,
  clearError,
  resetState,
} = categorySlice.actions;

// 导出reducer
export default categorySlice.reducer;