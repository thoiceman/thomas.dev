/**
 * 文章管理 Redux Slice
 */

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { message } from 'antd';
import ArticleAPI from '../../api/article';
import type {
  Article,
  ArticleCreateRequest,
  ArticleUpdateRequest,
  ArticleQueryParams,
  ArticlePageResponse,
  ArticleDetailResponse,
  ArticleStats
} from '../../types/article';
import { DEFAULT_ARTICLE_QUERY_PARAMS } from '../../types/article';

// 状态接口定义
interface ArticleState {
  // 文章列表相关
  articles: Article[];
  pagination: {
    current: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
  queryParams: ArticleQueryParams;
  
  // 当前文章详情
  currentArticle: ArticleDetailResponse | null;
  
  // 统计信息
  stats: ArticleStats | null;
  
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
    upload: boolean;
  };
  
  // 错误信息
  error: string | null;
}

// 初始状态
const initialState: ArticleState = {
  articles: [],
  pagination: {
    current: 1,
    pageSize: 10,
    total: 0,
    totalPages: 0
  },
  queryParams: DEFAULT_ARTICLE_QUERY_PARAMS,
  currentArticle: null,
  stats: null,
  loading: {
    list: false,
    detail: false,
    create: false,
    update: false,
    delete: false,
    batchDelete: false,
    batchStatusUpdate: false,
    stats: false,
    upload: false
  },
  error: null
};

// 异步操作：获取文章列表
export const fetchArticles = createAsyncThunk(
  'article/fetchArticles',
  async (params: ArticleQueryParams = {}, { rejectWithValue }) => {
    try {
      const response = await ArticleAPI.getArticles(params);
      return response;
    } catch (error: any) {
      message.error(error.message || '获取文章列表失败');
      return rejectWithValue(error.message || '获取文章列表失败');
    }
  }
);

// 异步操作：获取文章详情
export const fetchArticleDetail = createAsyncThunk(
  'article/fetchArticleDetail',
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await ArticleAPI.getArticleById(id);
      return response;
    } catch (error: any) {
      message.error(error.message || '获取文章详情失败');
      return rejectWithValue(error.message || '获取文章详情失败');
    }
  }
);

// 异步操作：根据slug获取文章详情
export const fetchArticleBySlug = createAsyncThunk(
  'article/fetchArticleBySlug',
  async (slug: string, { rejectWithValue }) => {
    try {
      const response = await ArticleAPI.getArticleBySlug(slug);
      return response;
    } catch (error: any) {
      message.error(error.message || '获取文章详情失败');
      return rejectWithValue(error.message || '获取文章详情失败');
    }
  }
);

// 异步操作：创建文章
export const createArticle = createAsyncThunk(
  'article/createArticle',
  async (data: ArticleCreateRequest, { rejectWithValue }) => {
    try {
      const response = await ArticleAPI.createArticle(data);
      message.success('文章创建成功');
      return response;
    } catch (error: any) {
      message.error(error.message || '创建文章失败');
      return rejectWithValue(error.message || '创建文章失败');
    }
  }
);

// 异步操作：更新文章
export const updateArticle = createAsyncThunk(
  'article/updateArticle',
  async (data: ArticleUpdateRequest, { rejectWithValue }) => {
    try {
      const response = await ArticleAPI.updateArticle(data);
      message.success('文章更新成功');
      return response;
    } catch (error: any) {
      message.error(error.message || '更新文章失败');
      return rejectWithValue(error.message || '更新文章失败');
    }
  }
);

// 异步操作：删除文章
export const deleteArticle = createAsyncThunk(
  'article/deleteArticle',
  async (id: number, { rejectWithValue }) => {
    try {
      await ArticleAPI.deleteArticle(id);
      message.success('文章删除成功');
      return id;
    } catch (error: any) {
      message.error(error.message || '删除文章失败');
      return rejectWithValue(error.message || '删除文章失败');
    }
  }
);

// 异步操作：批量删除文章
export const batchDeleteArticles = createAsyncThunk(
  'article/batchDeleteArticles',
  async (ids: number[], { rejectWithValue }) => {
    try {
      await ArticleAPI.batchDeleteArticles(ids);
      message.success(`成功删除 ${ids.length} 篇文章`);
      return ids;
    } catch (error: any) {
      message.error(error.message || '批量删除文章失败');
      return rejectWithValue(error.message || '批量删除文章失败');
    }
  }
);

// 异步操作：发布文章
export const publishArticle = createAsyncThunk(
  'article/publishArticle',
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await ArticleAPI.publishArticle(id);
      message.success('文章发布成功');
      return response;
    } catch (error: any) {
      message.error(error.message || '发布文章失败');
      return rejectWithValue(error.message || '发布文章失败');
    }
  }
);

// 异步操作：下线文章
export const offlineArticle = createAsyncThunk(
  'article/offlineArticle',
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await ArticleAPI.offlineArticle(id);
      message.success('文章下线成功');
      return response;
    } catch (error: any) {
      message.error(error.message || '下线文章失败');
      return rejectWithValue(error.message || '下线文章失败');
    }
  }
);

// 异步操作：批量更新文章状态
export const batchUpdateArticleStatus = createAsyncThunk(
  'article/batchUpdateArticleStatus',
  async ({ ids, status }: { ids: number[]; status: number }, { rejectWithValue }) => {
    try {
      await ArticleAPI.batchUpdateStatus(ids, status);
      const statusText = status === 1 ? '发布' : status === 2 ? '下线' : '设为草稿';
      message.success(`成功${statusText} ${ids.length} 篇文章`);
      return { ids, status };
    } catch (error: any) {
      message.error(error.message || '批量更新文章状态失败');
      return rejectWithValue(error.message || '批量更新文章状态失败');
    }
  }
);

// 异步操作：设置文章置顶
export const setArticleTop = createAsyncThunk(
  'article/setArticleTop',
  async ({ id, isTop }: { id: number; isTop: boolean }, { rejectWithValue }) => {
    try {
      const response = await ArticleAPI.setArticleTop(id, isTop);
      message.success(isTop ? '文章置顶成功' : '取消置顶成功');
      return response;
    } catch (error: any) {
      message.error(error.message || '设置置顶失败');
      return rejectWithValue(error.message || '设置置顶失败');
    }
  }
);

// 异步操作：设置文章精选
export const setArticleFeatured = createAsyncThunk(
  'article/setArticleFeatured',
  async ({ id, isFeatured }: { id: number; isFeatured: boolean }, { rejectWithValue }) => {
    try {
      const response = await ArticleAPI.setArticleFeatured(id, isFeatured);
      message.success(isFeatured ? '文章精选成功' : '取消精选成功');
      return response;
    } catch (error: any) {
      message.error(error.message || '设置精选失败');
      return rejectWithValue(error.message || '设置精选失败');
    }
  }
);

// 异步操作：获取文章统计信息
export const fetchArticleStats = createAsyncThunk(
  'article/fetchArticleStats',
  async (_, { rejectWithValue }) => {
    try {
      const response = await ArticleAPI.getArticleStats();
      return response;
    } catch (error: any) {
      message.error(error.message || '获取统计信息失败');
      return rejectWithValue(error.message || '获取统计信息失败');
    }
  }
);

// 异步操作：上传图片
export const uploadImage = createAsyncThunk(
  'article/uploadImage',
  async (file: File, { rejectWithValue }) => {
    try {
      const response = await ArticleAPI.uploadImage(file);
      message.success('图片上传成功');
      return response;
    } catch (error: any) {
      message.error(error.message || '图片上传失败');
      return rejectWithValue(error.message || '图片上传失败');
    }
  }
);

// 创建 slice
const articleSlice = createSlice({
  name: 'article',
  initialState,
  reducers: {
    // 设置查询参数
    setQueryParams: (state, action: PayloadAction<Partial<ArticleQueryParams>>) => {
      state.queryParams = { ...state.queryParams, ...action.payload };
    },
    
    // 重置查询参数
    resetQueryParams: (state) => {
      state.queryParams = DEFAULT_ARTICLE_QUERY_PARAMS;
    },
    
    // 清除当前文章
    clearCurrentArticle: (state) => {
      state.currentArticle = null;
    },
    
    // 清除错误信息
    clearError: (state) => {
      state.error = null;
    },
    
    // 更新文章列表中的单个文章
    updateArticleInList: (state, action: PayloadAction<Article>) => {
      const index = state.articles.findIndex(article => article.id === action.payload.id);
      if (index !== -1) {
        state.articles[index] = action.payload;
      }
    },
    
    // 从列表中移除文章
    removeArticleFromList: (state, action: PayloadAction<number>) => {
      state.articles = state.articles.filter(article => article.id !== action.payload);
      state.pagination.total = Math.max(0, state.pagination.total - 1);
    },
    
    // 从列表中批量移除文章
    batchRemoveArticlesFromList: (state, action: PayloadAction<number[]>) => {
      state.articles = state.articles.filter(article => !action.payload.includes(article.id));
      state.pagination.total = Math.max(0, state.pagination.total - action.payload.length);
    }
  },
  extraReducers: (builder) => {
    // 获取文章列表
    builder
      .addCase(fetchArticles.pending, (state) => {
        state.loading.list = true;
        state.error = null;
      })
      .addCase(fetchArticles.fulfilled, (state, action) => {
        state.loading.list = false;
        state.articles = action.payload.list;
        state.pagination = {
          current: action.payload.page,
          pageSize: action.payload.pageSize,
          total: action.payload.total,
          totalPages: action.payload.totalPages
        };
      })
      .addCase(fetchArticles.rejected, (state, action) => {
        state.loading.list = false;
        state.error = action.payload as string;
      });

    // 获取文章详情
    builder
      .addCase(fetchArticleDetail.pending, (state) => {
        state.loading.detail = true;
        state.error = null;
      })
      .addCase(fetchArticleDetail.fulfilled, (state, action) => {
        state.loading.detail = false;
        state.currentArticle = action.payload;
      })
      .addCase(fetchArticleDetail.rejected, (state, action) => {
        state.loading.detail = false;
        state.error = action.payload as string;
      });

    // 根据slug获取文章详情
    builder
      .addCase(fetchArticleBySlug.pending, (state) => {
        state.loading.detail = true;
        state.error = null;
      })
      .addCase(fetchArticleBySlug.fulfilled, (state, action) => {
        state.loading.detail = false;
        state.currentArticle = action.payload;
      })
      .addCase(fetchArticleBySlug.rejected, (state, action) => {
        state.loading.detail = false;
        state.error = action.payload as string;
      });

    // 创建文章
    builder
      .addCase(createArticle.pending, (state) => {
        state.loading.create = true;
        state.error = null;
      })
      .addCase(createArticle.fulfilled, (state) => {
        state.loading.create = false;
      })
      .addCase(createArticle.rejected, (state, action) => {
        state.loading.create = false;
        state.error = action.payload as string;
      });

    // 更新文章
    builder
      .addCase(updateArticle.pending, (state) => {
        state.loading.update = true;
        state.error = null;
      })
      .addCase(updateArticle.fulfilled, (state, action) => {
        state.loading.update = false;
        // 更新列表中的文章
        const index = state.articles.findIndex(article => article.id === action.payload.id);
        if (index !== -1) {
          state.articles[index] = action.payload;
        }
        // 更新当前文章
        if (state.currentArticle && state.currentArticle.id === action.payload.id) {
          state.currentArticle = { ...state.currentArticle, ...action.payload };
        }
      })
      .addCase(updateArticle.rejected, (state, action) => {
        state.loading.update = false;
        state.error = action.payload as string;
      });

    // 删除文章
    builder
      .addCase(deleteArticle.pending, (state) => {
        state.loading.delete = true;
        state.error = null;
      })
      .addCase(deleteArticle.fulfilled, (state, action) => {
        state.loading.delete = false;
        state.articles = state.articles.filter(article => article.id !== action.payload);
        state.pagination.total = Math.max(0, state.pagination.total - 1);
      })
      .addCase(deleteArticle.rejected, (state, action) => {
        state.loading.delete = false;
        state.error = action.payload as string;
      });

    // 批量删除文章
    builder
      .addCase(batchDeleteArticles.pending, (state) => {
        state.loading.batchDelete = true;
        state.error = null;
      })
      .addCase(batchDeleteArticles.fulfilled, (state, action) => {
        state.loading.batchDelete = false;
        state.articles = state.articles.filter(article => !action.payload.includes(article.id));
        state.pagination.total = Math.max(0, state.pagination.total - action.payload.length);
      })
      .addCase(batchDeleteArticles.rejected, (state, action) => {
        state.loading.batchDelete = false;
        state.error = action.payload as string;
      });

    // 发布文章
    builder
      .addCase(publishArticle.fulfilled, (state, action) => {
        const index = state.articles.findIndex(article => article.id === action.payload.id);
        if (index !== -1) {
          state.articles[index] = action.payload;
        }
      });

    // 下线文章
    builder
      .addCase(offlineArticle.fulfilled, (state, action) => {
        const index = state.articles.findIndex(article => article.id === action.payload.id);
        if (index !== -1) {
          state.articles[index] = action.payload;
        }
      });

    // 批量更新文章状态
    builder
      .addCase(batchUpdateArticleStatus.pending, (state) => {
        state.loading.batchStatusUpdate = true;
        state.error = null;
      })
      .addCase(batchUpdateArticleStatus.fulfilled, (state, action) => {
        state.loading.batchStatusUpdate = false;
        const { ids, status } = action.payload;
        state.articles = state.articles.map(article => 
          ids.includes(article.id) ? { ...article, status } : article
        );
      })
      .addCase(batchUpdateArticleStatus.rejected, (state, action) => {
        state.loading.batchStatusUpdate = false;
        state.error = action.payload as string;
      });

    // 设置文章置顶
    builder
      .addCase(setArticleTop.fulfilled, (state, action) => {
        const index = state.articles.findIndex(article => article.id === action.payload.id);
        if (index !== -1) {
          state.articles[index] = action.payload;
        }
      });

    // 设置文章精选
    builder
      .addCase(setArticleFeatured.fulfilled, (state, action) => {
        const index = state.articles.findIndex(article => article.id === action.payload.id);
        if (index !== -1) {
          state.articles[index] = action.payload;
        }
      });

    // 获取文章统计信息
    builder
      .addCase(fetchArticleStats.pending, (state) => {
        state.loading.stats = true;
        state.error = null;
      })
      .addCase(fetchArticleStats.fulfilled, (state, action) => {
        state.loading.stats = false;
        state.stats = action.payload;
      })
      .addCase(fetchArticleStats.rejected, (state, action) => {
        state.loading.stats = false;
        state.error = action.payload as string;
      });

    // 上传图片
    builder
      .addCase(uploadImage.pending, (state) => {
        state.loading.upload = true;
        state.error = null;
      })
      .addCase(uploadImage.fulfilled, (state) => {
        state.loading.upload = false;
      })
      .addCase(uploadImage.rejected, (state, action) => {
        state.loading.upload = false;
        state.error = action.payload as string;
      });
  }
});

// 导出 actions
export const {
  setQueryParams,
  resetQueryParams,
  clearCurrentArticle,
  clearError,
  updateArticleInList,
  removeArticleFromList,
  batchRemoveArticlesFromList
} = articleSlice.actions;

// 导出 reducer
export default articleSlice.reducer;