/**
 * 文章管理 API 接口定义
 */

import { AxiosResponse } from 'axios';
import request from '../utils/request';
import type {
  Article,
  ArticleCreateRequest,
  ArticleUpdateRequest,
  ArticleQueryParams,
  ArticlePageResponse,
  ArticleDetailResponse,
  ArticleStats,
  ImageUploadResponse
} from '../types/article';

/**
 * 文章管理 API 类
 */
export class ArticleAPI {
  
  /**
   * 获取文章列表（分页）
   * @param params 查询参数
   * @returns 文章分页数据
   */
  static async getArticles(params: ArticleQueryParams = {}): Promise<ArticlePageResponse> {
    const response = await request.get<ArticlePageResponse>('/api/articles', {
      params: {
        page: params.page || 1,
        pageSize: params.pageSize || 10,
        title: params.title,
        slug: params.slug,
        categoryId: params.categoryId,
        authorId: params.authorId,
        status: params.status,
        isTop: params.isTop,
        isFeatured: params.isFeatured,
        startDate: params.startDate,
        endDate: params.endDate,
        sortBy: params.sortBy || 'create_time',
        sortOrder: params.sortOrder || 'desc',
        keyword: params.keyword
      }
    });
    return response.data;
  }

  /**
   * 根据ID获取文章详情
   * @param id 文章ID
   * @returns 文章详情
   */
  static async getArticleById(id: number): Promise<ArticleDetailResponse> {
    const response = await request.get<ArticleDetailResponse>(`/api/articles/${id}`);
    return response.data;
  }

  /**
   * 根据slug获取文章详情
   * @param slug 文章别名
   * @returns 文章详情
   */
  static async getArticleBySlug(slug: string): Promise<ArticleDetailResponse> {
    const response = await request.get<ArticleDetailResponse>(`/api/articles/slug/${slug}`);
    return response.data;
  }

  /**
   * 创建文章
   * @param data 文章创建数据
   * @returns 创建的文章信息
   */
  static async createArticle(data: ArticleCreateRequest): Promise<Article> {
    const response = await request.post<Article>('/api/articles', data);
    return response.data;
  }

  /**
   * 更新文章
   * @param data 文章更新数据
   * @returns 更新后的文章信息
   */
  static async updateArticle(data: ArticleUpdateRequest): Promise<Article> {
    const response = await request.put<Article>(`/api/articles/${data.id}`, data);
    return response.data;
  }

  /**
   * 删除文章
   * @param id 文章ID
   * @returns 删除结果
   */
  static async deleteArticle(id: number): Promise<void> {
    await request.delete(`/api/articles/${id}`);
  }

  /**
   * 批量删除文章
   * @param ids 文章ID数组
   * @returns 删除结果
   */
  static async batchDeleteArticles(ids: number[]): Promise<void> {
    await request.delete('/api/articles/batch', {
      data: { ids }
    });
  }

  /**
   * 发布文章
   * @param id 文章ID
   * @returns 发布结果
   */
  static async publishArticle(id: number): Promise<Article> {
    const response = await request.patch<Article>(`/api/articles/${id}/publish`);
    return response.data;
  }

  /**
   * 下线文章
   * @param id 文章ID
   * @returns 下线结果
   */
  static async offlineArticle(id: number): Promise<Article> {
    const response = await request.patch<Article>(`/api/articles/${id}/offline`);
    return response.data;
  }

  /**
   * 批量更新文章状态
   * @param ids 文章ID数组
   * @param status 目标状态
   * @returns 更新结果
   */
  static async batchUpdateStatus(ids: number[], status: number): Promise<void> {
    await request.patch('/api/articles/batch/status', {
      ids,
      status
    });
  }

  /**
   * 设置文章置顶
   * @param id 文章ID
   * @param isTop 是否置顶
   * @returns 更新结果
   */
  static async setArticleTop(id: number, isTop: boolean): Promise<Article> {
    const response = await request.patch<Article>(`/api/articles/${id}/top`, {
      isTop
    });
    return response.data;
  }

  /**
   * 设置文章精选
   * @param id 文章ID
   * @param isFeatured 是否精选
   * @returns 更新结果
   */
  static async setArticleFeatured(id: number, isFeatured: boolean): Promise<Article> {
    const response = await request.patch<Article>(`/api/articles/${id}/featured`, {
      isFeatured
    });
    return response.data;
  }

  /**
   * 获取文章统计信息
   * @returns 统计数据
   */
  static async getArticleStats(): Promise<ArticleStats> {
    const response = await request.get<ArticleStats>('/api/articles/stats');
    return response.data;
  }

  /**
   * 检查文章别名是否可用
   * @param slug 文章别名
   * @param excludeId 排除的文章ID（编辑时使用）
   * @returns 是否可用
   */
  static async checkSlugAvailable(slug: string, excludeId?: number): Promise<boolean> {
    const response = await request.get<{ available: boolean }>('/api/articles/check-slug', {
      params: { slug, excludeId }
    });
    return response.data.available;
  }

  /**
   * 生成文章别名建议
   * @param title 文章标题
   * @returns 别名建议
   */
  static async generateSlug(title: string): Promise<string> {
    const response = await request.post<{ slug: string }>('/api/articles/generate-slug', {
      title
    });
    return response.data.slug;
  }

  /**
   * 上传图片
   * @param file 图片文件
   * @returns 上传结果
   */
  static async uploadImage(file: File): Promise<ImageUploadResponse> {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await request.post<ImageUploadResponse>('/api/articles/upload/image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  }

  /**
   * 批量上传图片
   * @param files 图片文件数组
   * @returns 上传结果数组
   */
  static async batchUploadImages(files: File[]): Promise<ImageUploadResponse[]> {
    const formData = new FormData();
    files.forEach(file => {
      formData.append('files', file);
    });
    
    const response = await request.post<ImageUploadResponse[]>('/api/articles/upload/images', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  }

  /**
   * 导出文章数据
   * @param params 查询参数
   * @param format 导出格式
   * @returns 导出文件
   */
  static async exportArticles(params: ArticleQueryParams = {}, format: 'excel' | 'csv' = 'excel'): Promise<void> {
    const response: AxiosResponse<Blob> = await request.get('/api/articles/export', {
      params: {
        ...params,
        format
      },
      responseType: 'blob'
    });

    // 创建下载链接
    const url = window.URL.createObjectURL(response.data);
    const link = document.createElement('a');
    link.href = url;
    link.download = `articles_${new Date().getTime()}.${format === 'excel' ? 'xlsx' : 'csv'}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  }

  /**
   * 预览文章内容（Markdown转HTML）
   * @param content Markdown内容
   * @returns HTML内容
   */
  static async previewContent(content: string): Promise<string> {
    const response = await request.post<{ html: string }>('/api/articles/preview', {
      content
    });
    return response.data.html;
  }

  /**
   * 计算文章字数和阅读时间
   * @param content 文章内容
   * @returns 字数和阅读时间
   */
  static async calculateWordCount(content: string): Promise<{ wordCount: number; readingTime: number }> {
    const response = await request.post<{ wordCount: number; readingTime: number }>('/api/articles/word-count', {
      content
    });
    return response.data;
  }

  /**
   * 搜索文章
   * @param keyword 搜索关键词
   * @param params 其他查询参数
   * @returns 搜索结果
   */
  static async searchArticles(keyword: string, params: Omit<ArticleQueryParams, 'keyword'> = {}): Promise<ArticlePageResponse> {
    return this.getArticles({
      ...params,
      keyword
    });
  }

  /**
   * 获取相关文章推荐
   * @param id 文章ID
   * @param limit 推荐数量
   * @returns 相关文章列表
   */
  static async getRelatedArticles(id: number, limit: number = 5): Promise<Article[]> {
    const response = await request.get<Article[]>(`/api/articles/${id}/related`, {
      params: { limit }
    });
    return response.data;
  }
}

export default ArticleAPI;