import request from '../utils/request';
import type {
  Tag,
  TagCreateRequest,
  TagUpdateRequest,
  TagQueryParams,
  TagPageResponse
} from '../types/tag';

/**
 * 标签管理API接口
 */
export class TagAPI {
  
  /**
   * 获取标签分页列表
   * @param params 查询参数
   * @returns 分页标签列表
   */
  static async getTags(params?: TagQueryParams): Promise<TagPageResponse> {
    return await request.get('/tags', {
      params: {
        page: params?.page || 1,
        size: params?.size || 10,
        name: params?.name,
        sortBy: params?.sortBy || 'createTime',
        sortOrder: params?.sortOrder || 'desc'
      }
    });
  }

  /**
   * 根据ID获取标签详情
   * @param id 标签ID
   * @returns 标签详情
   */
  static async getTagById(id: number): Promise<Tag> {
    return await request.get(`/tags/${id}`);
  }

  /**
   * 创建新标签
   * @param data 标签创建数据
   * @returns 创建的标签信息
   */
  static async createTag(data: TagCreateRequest): Promise<Tag> {
    return await request.post('/tags', data);
  }

  /**
   * 更新标签信息
   * @param id 标签ID
   * @param data 标签更新数据
   * @returns 更新后的标签信息
   */
  static async updateTag(id: number, data: TagUpdateRequest): Promise<Tag> {
    return await request.put(`/tags/${id}`, data);
  }

  /**
   * 删除标签
   * @param id 标签ID
   */
  static async deleteTag(id: number): Promise<void> {
    await request.delete(`/tags/${id}`);
  }

  /**
   * 批量删除标签
   * @param ids 标签ID数组
   */
  static async batchDeleteTags(ids: number[]): Promise<void> {
    await request.delete('/tags/batch', {
      data: { ids }
    });
  }

  /**
   * 获取热门标签列表
   * @param limit 限制数量，默认10
   * @returns 热门标签列表
   */
  static async getPopularTags(limit: number = 10): Promise<Tag[]> {
    return await request.get('/tags/popular', {
      params: { limit }
    });
  }

  /**
   * 检查标签别名是否可用
   * @param slug 标签别名
   * @param excludeId 排除的标签ID（用于编辑时检查）
   * @returns 是否可用
   */
  static async checkSlugAvailable(slug: string, excludeId?: number): Promise<boolean> {
    return await request.get('/tags/check-slug', {
      params: {
        slug,
        excludeId
      }
    });
  }

  /**
   * 获取标签统计信息
   * @returns 标签统计数据
   */
  static async getTagStats(): Promise<{
    total: number;
    totalUseCount: number;
    averageUseCount: number;
    mostUsedTag: Tag | null;
  }> {
    return await request.get('/tags/stats');
  }

  /**
   * 搜索标签（用于自动完成）
   * @param keyword 搜索关键词
   * @param limit 限制数量，默认10
   * @returns 匹配的标签列表
   */
  static async searchTags(keyword: string, limit: number = 10): Promise<Tag[]> {
    return await request.get('/tags/search', {
      params: { keyword, limit }
    });
  }

  /**
   * 获取标签使用情况
   * @param id 标签ID
   * @returns 标签使用详情
   */
  static async getTagUsage(id: number): Promise<{
    tag: Tag;
    articles: Array<{
      id: number;
      title: string;
      createTime: string;
    }>;
    totalArticles: number;
  }> {
    return await request.get(`/tags/${id}/usage`);
  }

  /**
   * 合并标签
   * @param sourceId 源标签ID
   * @param targetId 目标标签ID
   */
  static async mergeTags(sourceId: number, targetId: number): Promise<void> {
    await request.post('/tags/merge', {
      sourceId,
      targetId
    });
  }

  /**
   * 批量更新标签颜色
   * @param updates 更新数据数组
   */
  static async batchUpdateTagColors(updates: Array<{ id: number; color: string }>): Promise<void> {
    await request.put('/tags/batch-colors', { updates });
  }
}

export default TagAPI;