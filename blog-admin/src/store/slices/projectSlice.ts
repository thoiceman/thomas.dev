import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import type {
  Project,
  ProjectCreateRequest,
  ProjectUpdateRequest,
  ProjectQueryParams,
  ProjectPaginationResponse,
  ProjectStats,
} from '../../types/project';
import { ProjectStatus } from '../../types/project';

// 定义项目状态接口
interface ProjectState {
  // 项目列表数据
  projects: Project[];
  // 分页信息
  pagination: {
    currentPage: number;
    totalPages: number;
    totalElements: number;
    size: number;
    hasNext: boolean;
    hasPrevious: boolean;
  };
  // 当前选中的项目
  selectedProject: Project | null;
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
  queryParams: ProjectQueryParams;
  // 精选项目列表（用于推荐）
  featuredProjects: Project[];
  // 统计信息
  stats: ProjectStats | null;
  // 最近项目
  recentProjects: Project[];
  // 热门技术栈
  popularTechStack: Array<{
    tech: string;
    count: number;
  }>;
}

// 初始状态
const initialState: ProjectState = {
  projects: [],
  pagination: {
    currentPage: 1,
    totalPages: 0,
    totalElements: 0,
    size: 10,
    hasNext: false,
    hasPrevious: false,
  },
  selectedProject: null,
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
    sortBy: 'createTime',
    sortOrder: 'desc',
  },
  featuredProjects: [],
  stats: null,
  recentProjects: [],
  popularTechStack: [],
};

// 异步操作：获取项目列表
export const fetchProjects = createAsyncThunk<
  ProjectPaginationResponse,
  ProjectQueryParams,
  { rejectValue: string }
>(
  'project/fetchProjects',
  async (params: ProjectQueryParams = {}, { rejectWithValue }) => {
    try {
      // 模拟API调用 - 实际项目中应该调用真实的API
      const mockResponse: ProjectPaginationResponse = {
        content: [],
        currentPage: params.page || 1,
        totalPages: 0,
        totalElements: 0,
        size: params.pageSize || 10,
        first: true,
        last: true,
      };
      return mockResponse;
    } catch (error: any) {
      return rejectWithValue(error.message || '获取项目列表失败');
    }
  }
);

// 异步操作：根据ID获取项目详情
export const fetchProjectById = createAsyncThunk<
  Project,
  number,
  { rejectValue: string }
>(
  'project/fetchProjectById',
  async (id: number, { rejectWithValue }) => {
    try {
      // 模拟API调用 - 实际项目中应该调用真实的API
      throw new Error('项目详情API尚未实现');
    } catch (error: any) {
      return rejectWithValue(error.message || '获取项目详情失败');
    }
  }
);

// 异步操作：创建项目
export const createProject = createAsyncThunk<
  Project,
  ProjectCreateRequest,
  { rejectValue: string }
>(
  'project/createProject',
  async (data: ProjectCreateRequest, { rejectWithValue }) => {
    try {
      // 模拟API调用 - 实际项目中应该调用真实的API
      throw new Error('创建项目API尚未实现');
    } catch (error: any) {
      return rejectWithValue(error.message || '创建项目失败');
    }
  }
);

// 异步操作：更新项目
export const updateProject = createAsyncThunk<
  Project,
  { id: number; data: ProjectUpdateRequest },
  { rejectValue: string }
>(
  'project/updateProject',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      // 模拟API调用 - 实际项目中应该调用真实的API
      throw new Error('更新项目API尚未实现');
    } catch (error: any) {
      return rejectWithValue(error.message || '更新项目失败');
    }
  }
);

// 异步操作：删除项目
export const deleteProject = createAsyncThunk<
  number,
  number,
  { rejectValue: string }
>(
  'project/deleteProject',
  async (id: number, { rejectWithValue }) => {
    try {
      // 模拟API调用 - 实际项目中应该调用真实的API
      throw new Error('删除项目API尚未实现');
    } catch (error: any) {
      return rejectWithValue(error.message || '删除项目失败');
    }
  }
);

// 异步操作：批量删除项目
export const batchDeleteProjects = createAsyncThunk<
  number[],
  number[],
  { rejectValue: string }
>(
  'project/batchDeleteProjects',
  async (ids: number[], { rejectWithValue }) => {
    try {
      // 模拟API调用 - 实际项目中应该调用真实的API
      throw new Error('批量删除项目API尚未实现');
    } catch (error: any) {
      return rejectWithValue(error.message || '批量删除项目失败');
    }
  }
);

// 异步操作：批量更新项目状态
export const batchUpdateProjectStatus = createAsyncThunk<
  { ids: number[]; status: ProjectStatus },
  { ids: number[]; status: ProjectStatus },
  { rejectValue: string }
>(
  'project/batchUpdateProjectStatus',
  async ({ ids, status }, { rejectWithValue }) => {
    try {
      // 模拟API调用 - 实际项目中应该调用真实的API
      throw new Error('批量更新项目状态API尚未实现');
    } catch (error: any) {
      return rejectWithValue(error.message || '批量更新项目状态失败');
    }
  }
);

// 异步操作：获取精选项目
export const fetchFeaturedProjects = createAsyncThunk<
  Project[],
  number,
  { rejectValue: string }
>(
  'project/fetchFeaturedProjects',
  async (limit: number = 10, { rejectWithValue }) => {
    try {
      // 模拟API调用 - 实际项目中应该调用真实的API
      return [];
    } catch (error: any) {
      return rejectWithValue(error.message || '获取精选项目失败');
    }
  }
);

// 异步操作：获取项目统计信息
export const fetchProjectStats = createAsyncThunk<
  ProjectStats,
  void,
  { rejectValue: string }
>(
  'project/fetchProjectStats',
  async (_, { rejectWithValue }) => {
    try {
      // 模拟API调用 - 实际项目中应该调用真实的API
      const mockStats: ProjectStats = {
        total: 0,
        featuredCount: 0,
        openSourceCount: 0,
        thisYearCount: 0,
        thisMonthCount: 0,
        statusStats: [],
        typeStats: [],
        techStackStats: [],
      };
      return mockStats;
    } catch (error: any) {
      return rejectWithValue(error.message || '获取项目统计失败');
    }
  }
);

// 创建项目slice
const projectSlice = createSlice({
  name: 'project',
  initialState,
  reducers: {
    // 设置查询参数
    setQueryParams: (state, action: PayloadAction<Partial<ProjectQueryParams>>) => {
      state.queryParams = { ...state.queryParams, ...action.payload };
    },
    // 重置查询参数
    resetQueryParams: (state) => {
      state.queryParams = {
        page: 1,
        pageSize: 10,
        sortBy: 'createTime',
        sortOrder: 'desc',
      };
    },
    // 设置选中的项目
    setSelectedProject: (state, action: PayloadAction<Project | null>) => {
      state.selectedProject = action.payload;
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
    // 获取项目列表
    builder
      .addCase(fetchProjects.pending, (state) => {
        state.loading.list = true;
        state.error = null;
      })
      .addCase(fetchProjects.fulfilled, (state, action) => {
        state.loading.list = false;
        const response = action.payload;
        state.projects = response.content;
        state.pagination = {
          currentPage: response.currentPage,
          totalPages: response.totalPages,
          totalElements: response.totalElements,
          size: response.size,
          hasNext: !response.last,
          hasPrevious: !response.first,
        };
      })
      .addCase(fetchProjects.rejected, (state, action) => {
        state.loading.list = false;
        state.error = action.payload || '获取项目列表失败';
      });

    // 获取项目详情
    builder
      .addCase(fetchProjectById.pending, (state) => {
        state.loading.detail = true;
        state.error = null;
      })
      .addCase(fetchProjectById.fulfilled, (state, action) => {
        state.loading.detail = false;
        state.selectedProject = action.payload;
      })
      .addCase(fetchProjectById.rejected, (state, action) => {
        state.loading.detail = false;
        state.error = action.payload || '获取项目详情失败';
      });

    // 创建项目
    builder
      .addCase(createProject.pending, (state) => {
        state.loading.create = true;
        state.error = null;
      })
      .addCase(createProject.fulfilled, (state, action) => {
        state.loading.create = false;
        const newProject = action.payload;
        state.projects.unshift(newProject);
        state.pagination.totalElements += 1;
      })
      .addCase(createProject.rejected, (state, action) => {
        state.loading.create = false;
        state.error = action.payload || '创建项目失败';
      });

    // 更新项目
    builder
      .addCase(updateProject.pending, (state) => {
        state.loading.update = true;
        state.error = null;
      })
      .addCase(updateProject.fulfilled, (state, action) => {
        state.loading.update = false;
        const updatedProject = action.payload;
        const index = state.projects.findIndex(project => project.id === updatedProject.id);
        if (index !== -1) {
          state.projects[index] = updatedProject;
        }
        if (state.selectedProject?.id === updatedProject.id) {
          state.selectedProject = updatedProject;
        }
      })
      .addCase(updateProject.rejected, (state, action) => {
        state.loading.update = false;
        state.error = action.payload || '更新项目失败';
      });

    // 删除项目
    builder
      .addCase(deleteProject.pending, (state) => {
        state.loading.delete = true;
        state.error = null;
      })
      .addCase(deleteProject.fulfilled, (state, action) => {
        state.loading.delete = false;
        const deletedId = action.payload;
        state.projects = state.projects.filter(project => project.id !== deletedId);
        state.pagination.totalElements -= 1;
        if (state.selectedProject?.id === deletedId) {
          state.selectedProject = null;
        }
      })
      .addCase(deleteProject.rejected, (state, action) => {
        state.loading.delete = false;
        state.error = action.payload || '删除项目失败';
      });

    // 批量删除项目
    builder
      .addCase(batchDeleteProjects.pending, (state) => {
        state.loading.batchDelete = true;
        state.error = null;
      })
      .addCase(batchDeleteProjects.fulfilled, (state, action) => {
        state.loading.batchDelete = false;
        const deletedIds = action.payload;
        state.projects = state.projects.filter(project => !deletedIds.includes(project.id));
        state.pagination.totalElements -= deletedIds.length;
        if (state.selectedProject && deletedIds.includes(state.selectedProject.id)) {
          state.selectedProject = null;
        }
      })
      .addCase(batchDeleteProjects.rejected, (state, action) => {
        state.loading.batchDelete = false;
        state.error = action.payload || '批量删除项目失败';
      });

    // 批量更新项目状态
    builder
      .addCase(batchUpdateProjectStatus.pending, (state) => {
        state.loading.batchStatusUpdate = true;
        state.error = null;
      })
      .addCase(batchUpdateProjectStatus.fulfilled, (state, action) => {
        state.loading.batchStatusUpdate = false;
        const { ids, status } = action.payload;
        state.projects = state.projects.map(project =>
          ids.includes(project.id) ? { ...project, status } : project
        );
      })
      .addCase(batchUpdateProjectStatus.rejected, (state, action) => {
        state.loading.batchStatusUpdate = false;
        state.error = action.payload || '批量更新项目状态失败';
      });

    // 获取精选项目
    builder
      .addCase(fetchFeaturedProjects.fulfilled, (state, action) => {
        state.featuredProjects = action.payload;
      });

    // 获取项目统计
    builder
      .addCase(fetchProjectStats.pending, (state) => {
        state.loading.stats = true;
        state.error = null;
      })
      .addCase(fetchProjectStats.fulfilled, (state, action) => {
        state.loading.stats = false;
        state.stats = action.payload;
      })
      .addCase(fetchProjectStats.rejected, (state, action) => {
        state.loading.stats = false;
        state.error = action.payload || '获取项目统计失败';
      });
  },
});

// 导出actions
export const {
  setQueryParams,
  resetQueryParams,
  setSelectedProject,
  clearError,
  resetState,
} = projectSlice.actions;

// 导出reducer
export default projectSlice.reducer;