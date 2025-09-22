import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import type {
  Travel,
  TravelCreateRequest,
  TravelUpdateRequest,
  TravelQueryParams,
  TravelPaginationResponse,
  TravelStats,
} from '../../types/travel';
import { TravelStatus } from '../../types/travel';

// 定义旅行记录状态接口
interface TravelState {
  // 旅行记录列表数据
  travels: Travel[];
  // 分页信息
  pagination: {
    currentPage: number;
    totalPages: number;
    totalElements: number;
    size: number;
    hasNext: boolean;
    hasPrevious: boolean;
  };
  // 当前选中的旅行记录
  selectedTravel: Travel | null;
  // 加载状态
  loading: {
    list: boolean;
    detail: boolean;
    create: boolean;
    update: boolean;
    delete: boolean;
    batchDelete: boolean;
    batchStatusUpdate: boolean;
    stats: boolean;
  };
  // 错误信息
  error: string | null;
  // 查询参数
  queryParams: TravelQueryParams;
  // 统计信息
  stats: TravelStats | null;
  // 最近旅行记录（用于推荐）
  recentTravels: Travel[];
  // 热门目的地
  popularDestinations: Array<{
    destination: string;
    count: number;
  }>;
}

// 初始状态
const initialState: TravelState = {
  travels: [],
  pagination: {
    currentPage: 1,
    totalPages: 0,
    totalElements: 0,
    size: 10,
    hasNext: false,
    hasPrevious: false,
  },
  selectedTravel: null,
  loading: {
    list: false,
    detail: false,
    create: false,
    update: false,
    delete: false,
    batchDelete: false,
    batchStatusUpdate: false,
    stats: false,
  },
  error: null,
  queryParams: {
    page: 1,
    pageSize: 10,
    sortBy: 'startDate',
    sortOrder: 'desc',
  },
  stats: null,
  recentTravels: [],
  popularDestinations: [],
};

// 异步操作：获取旅行记录列表
export const fetchTravels = createAsyncThunk(
  'travel/fetchTravels',
  async (params: TravelQueryParams = {}, { rejectWithValue }) => {
    try {
      // TODO: 替换为实际的API调用
      // return await TravelAPI.getTravels(params);
      
      // 模拟API响应
      const mockResponse: TravelPaginationResponse = {
        content: [],
        totalElements: 0,
        totalPages: 0,
        currentPage: params.page || 1,
        size: params.pageSize || 10,
        first: true,
        last: true,
      };
      return mockResponse;
    } catch (error: any) {
      return rejectWithValue(error.message || '获取旅行记录列表失败');
    }
  }
);

// 异步操作：根据ID获取旅行记录详情
export const fetchTravelById = createAsyncThunk<Travel, number>(
  'travel/fetchTravelById',
  async (id: number, { rejectWithValue }) => {
    try {
      // TODO: 替换为实际的API调用
      // return await TravelAPI.getTravelById(id);
      
      // 模拟API响应 - 暂时返回一个模拟的旅行记录
      const mockTravel: Travel = {
        id,
        title: '模拟旅行记录',
        destination: '模拟目的地',
        startDate: '2024-01-01',
        endDate: '2024-01-07',
        status: TravelStatus.PUBLIC,
        authorId: 1,
        createTime: new Date().toISOString(),
        updateTime: new Date().toISOString(),
        isDelete: 0,
      };
      return mockTravel;
    } catch (error: any) {
      return rejectWithValue(error.message || '获取旅行记录详情失败');
    }
  }
);

// 异步操作：创建旅行记录
export const createTravel = createAsyncThunk(
  'travel/createTravel',
  async (data: TravelCreateRequest, { rejectWithValue }) => {
    try {
      // TODO: 替换为实际的API调用
      // return await TravelAPI.createTravel(data);
      
      // 模拟API响应
      const mockTravel: Travel = {
        id: Date.now(),
        ...data,
        authorId: 1,
        createTime: new Date().toISOString(),
        updateTime: new Date().toISOString(),
        isDelete: 0,
        status: data.status || TravelStatus.PRIVATE,
      };
      return mockTravel;
    } catch (error: any) {
      return rejectWithValue(error.message || '创建旅行记录失败');
    }
  }
);

// 异步操作：更新旅行记录
export const updateTravel = createAsyncThunk<Travel, { id: number; data: TravelUpdateRequest }>(
  'travel/updateTravel',
  async ({ id, data }: { id: number; data: TravelUpdateRequest }, { rejectWithValue }) => {
    try {
      // TODO: 替换为实际的API调用
      // return await TravelAPI.updateTravel(id, data);
      
      // 模拟API响应 - 返回更新后的旅行记录
      const mockUpdatedTravel: Travel = {
        id,
        title: data.title || '更新的旅行记录',
        destination: data.destination || '更新的目的地',
        startDate: data.startDate || '2024-01-01',
        endDate: data.endDate || '2024-01-07',
        status: data.status || TravelStatus.PUBLIC,
        authorId: 1,
        createTime: '2024-01-01T00:00:00Z',
        updateTime: new Date().toISOString(),
        isDelete: 0,
        ...data, // 合并其他更新的字段
      };
      return mockUpdatedTravel;
    } catch (error: any) {
      return rejectWithValue(error.message || '更新旅行记录失败');
    }
  }
);

// 异步操作：删除旅行记录
export const deleteTravel = createAsyncThunk(
  'travel/deleteTravel',
  async (id: number, { rejectWithValue }) => {
    try {
      // TODO: 替换为实际的API调用
      // await TravelAPI.deleteTravel(id);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.message || '删除旅行记录失败');
    }
  }
);

// 异步操作：批量删除旅行记录
export const batchDeleteTravels = createAsyncThunk(
  'travel/batchDeleteTravels',
  async (ids: number[], { rejectWithValue }) => {
    try {
      // TODO: 替换为实际的API调用
      // await TravelAPI.batchDeleteTravels(ids);
      return ids;
    } catch (error: any) {
      return rejectWithValue(error.message || '批量删除旅行记录失败');
    }
  }
);

// 异步操作：批量更新旅行记录状态
export const batchUpdateTravelStatus = createAsyncThunk(
  'travel/batchUpdateTravelStatus',
  async ({ ids, status }: { ids: number[]; status: TravelStatus }, { rejectWithValue }) => {
    try {
      // TODO: 替换为实际的API调用
      // await TravelAPI.batchUpdateTravelStatus(ids, status);
      return { ids, status };
    } catch (error: any) {
      return rejectWithValue(error.message || '批量更新状态失败');
    }
  }
);

// 异步操作：获取旅行统计信息
export const fetchTravelStats = createAsyncThunk(
  'travel/fetchTravelStats',
  async (_, { rejectWithValue }) => {
    try {
      // TODO: 替换为实际的API调用
      // return await TravelAPI.getTravelStats();
      
      // 模拟API响应
      const mockStats: TravelStats = {
        total: 0,
        publicCount: 0,
        privateCount: 0,
        thisYearCount: 0,
        thisMonthCount: 0,
        totalDays: 0,
        totalBudget: 0,
        averageRating: 0,
        countryStats: [],
        ratingStats: [],
        transportationStats: [],
      };
      return mockStats;
    } catch (error: any) {
      return rejectWithValue(error.message || '获取统计信息失败');
    }
  }
);

// 异步操作：获取最近旅行记录
export const fetchRecentTravels = createAsyncThunk(
  'travel/fetchRecentTravels',
  async (limit: number = 5, { rejectWithValue }) => {
    try {
      // TODO: 替换为实际的API调用
      // return await TravelAPI.getRecentTravels(limit);
      
      // 模拟API响应
      return [];
    } catch (error: any) {
      return rejectWithValue(error.message || '获取最近旅行记录失败');
    }
  }
);

// 异步操作：获取热门目的地
export const fetchPopularDestinations = createAsyncThunk(
  'travel/fetchPopularDestinations',
  async (limit: number = 10, { rejectWithValue }) => {
    try {
      // TODO: 替换为实际的API调用
      // return await TravelAPI.getPopularDestinations(limit);
      
      // 模拟API响应
      return [];
    } catch (error: any) {
      return rejectWithValue(error.message || '获取热门目的地失败');
    }
  }
);

// 创建slice
const travelSlice = createSlice({
  name: 'travel',
  initialState,
  reducers: {
    // 设置查询参数
    setQueryParams: (state, action: PayloadAction<Partial<TravelQueryParams>>) => {
      state.queryParams = { ...state.queryParams, ...action.payload };
    },
    
    // 重置查询参数
    resetQueryParams: (state) => {
      state.queryParams = {
        page: 1,
        pageSize: 10,
        sortBy: 'startDate',
        sortOrder: 'desc',
      };
    },
    
    // 设置选中的旅行记录
    setSelectedTravel: (state, action: PayloadAction<Travel | null>) => {
      state.selectedTravel = action.payload;
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
    // 获取旅行记录列表
    builder
      .addCase(fetchTravels.pending, (state) => {
        state.loading.list = true;
        state.error = null;
      })
      .addCase(fetchTravels.fulfilled, (state, action) => {
        state.loading.list = false;
        state.travels = action.payload.content;
        state.pagination = {
          currentPage: action.payload.currentPage,
          totalPages: action.payload.totalPages,
          totalElements: action.payload.totalElements,
          size: action.payload.size,
          hasNext: !action.payload.last,
          hasPrevious: !action.payload.first,
        };
      })
      .addCase(fetchTravels.rejected, (state, action) => {
        state.loading.list = false;
        state.error = action.payload as string;
      });

    // 获取旅行记录详情
    builder
      .addCase(fetchTravelById.pending, (state) => {
        state.loading.detail = true;
        state.error = null;
      })
      .addCase(fetchTravelById.fulfilled, (state, action) => {
        state.loading.detail = false;
        state.selectedTravel = action.payload;
      })
      .addCase(fetchTravelById.rejected, (state, action) => {
        state.loading.detail = false;
        state.error = action.payload as string;
      });

    // 创建旅行记录
    builder
      .addCase(createTravel.pending, (state) => {
        state.loading.create = true;
        state.error = null;
      })
      .addCase(createTravel.fulfilled, (state, action) => {
        state.loading.create = false;
        state.travels.unshift(action.payload);
        state.pagination.totalElements += 1;
      })
      .addCase(createTravel.rejected, (state, action) => {
        state.loading.create = false;
        state.error = action.payload as string;
      });

    // 更新旅行记录
    builder
      .addCase(updateTravel.pending, (state) => {
        state.loading.update = true;
        state.error = null;
      })
      .addCase(updateTravel.fulfilled, (state, action) => {
        state.loading.update = false;
        const travel = action.payload;
        const index = state.travels.findIndex(t => t.id === travel.id);
        if (index !== -1) {
          state.travels[index] = travel;
        }
        if (state.selectedTravel?.id === travel.id) {
          state.selectedTravel = travel;
        }
      })
      .addCase(updateTravel.rejected, (state, action) => {
        state.loading.update = false;
        state.error = action.payload as string;
      });

    // 删除旅行记录
    builder
      .addCase(deleteTravel.pending, (state) => {
        state.loading.delete = true;
        state.error = null;
      })
      .addCase(deleteTravel.fulfilled, (state, action) => {
        state.loading.delete = false;
        state.travels = state.travels.filter(travel => travel.id !== action.payload);
        state.pagination.totalElements -= 1;
        if (state.selectedTravel?.id === action.payload) {
          state.selectedTravel = null;
        }
      })
      .addCase(deleteTravel.rejected, (state, action) => {
        state.loading.delete = false;
        state.error = action.payload as string;
      });

    // 批量删除旅行记录
    builder
      .addCase(batchDeleteTravels.pending, (state) => {
        state.loading.batchDelete = true;
        state.error = null;
      })
      .addCase(batchDeleteTravels.fulfilled, (state, action) => {
        state.loading.batchDelete = false;
        state.travels = state.travels.filter(travel => !action.payload.includes(travel.id));
        state.pagination.totalElements -= action.payload.length;
      })
      .addCase(batchDeleteTravels.rejected, (state, action) => {
        state.loading.batchDelete = false;
        state.error = action.payload as string;
      });

    // 批量更新旅行记录状态
    builder
      .addCase(batchUpdateTravelStatus.pending, (state) => {
        state.loading.batchStatusUpdate = true;
        state.error = null;
      })
      .addCase(batchUpdateTravelStatus.fulfilled, (state, action) => {
        state.loading.batchStatusUpdate = false;
        const { ids, status } = action.payload;
        state.travels.forEach(travel => {
          if (ids.includes(travel.id)) {
            travel.status = status;
            travel.updateTime = new Date().toISOString();
          }
        });
      })
      .addCase(batchUpdateTravelStatus.rejected, (state, action) => {
        state.loading.batchStatusUpdate = false;
        state.error = action.payload as string;
      });

    // 获取统计信息
    builder
      .addCase(fetchTravelStats.pending, (state) => {
        state.loading.stats = true;
        state.error = null;
      })
      .addCase(fetchTravelStats.fulfilled, (state, action) => {
        state.loading.stats = false;
        state.stats = action.payload;
      })
      .addCase(fetchTravelStats.rejected, (state, action) => {
        state.loading.stats = false;
        state.error = action.payload as string;
      });

    // 获取最近旅行记录
    builder
      .addCase(fetchRecentTravels.fulfilled, (state, action) => {
        state.recentTravels = action.payload;
      });

    // 获取热门目的地
    builder
      .addCase(fetchPopularDestinations.fulfilled, (state, action) => {
        state.popularDestinations = action.payload;
      });
  },
});

// 导出actions
export const {
  setQueryParams,
  resetQueryParams,
  setSelectedTravel,
  clearError,
  resetState,
} = travelSlice.actions;

// 导出reducer
export default travelSlice.reducer;