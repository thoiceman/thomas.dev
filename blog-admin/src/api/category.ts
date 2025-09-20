import request from '../utils/request';
import type {
  Category,
  CategoryCreateRequest,
  CategoryUpdateRequest,
  CategoryQueryParams,
  CategoryPageResponse
} from '../types/category';

/**
 * 分类管理API接口
 */
export class CategoryAPI {
  
  /**
   * 获取分类分页列表
   * @param params 查询参数
   * @returns 分页分类列表
   */
  static async getCategories(params?: CategoryQueryParams): Promise<CategoryPageResponse> {
    return await request.get('/categories', {
      params: {
        page: params?.page || 1,
        size: params?.size || 10,
        name: params?.name,
        status: params?.status,
        sortBy: params?.sortBy || 'createTime',
        sortOrder: params?.sortOrder || 'desc'
      }
    });
  }

  /**
   * 根据ID获取分类详情
   * @param id 分类ID
   * @returns 分类详情
   */
  static async getCategoryById(id: number): Promise<Category> {
    return await request.get(`/categories/${id}`);
  }

  /**
   * 创建新分类
   * @param data 分类创建数据
   * @returns 创建的分类信息
   */
  static async createCategory(data: CategoryCreateRequest): Promise<Category> {
    return await request.post('/categories', data);
  }

  /**
   * 更新分类信息
   * @param id 分类ID
   * @param data 分类更新数据
   * @returns 更新后的分类信息
   */
  static async updateCategory(id: number, data: CategoryUpdateRequest): Promise<Category> {
    return await request.put(`/categories/${id}`, data);
  }

  /**
   * 删除分类（软删除）
   * @param id 分类ID
   * @returns 删除结果
   */
  static async deleteCategory(id: number): Promise<void> {
    await request.delete(`/categories/${id}`);
  }

  /**
   * 批量删除分类
   * @param ids 分类ID数组
   * @returns 删除结果
   */
  static async batchDeleteCategories(ids: number[]): Promise<void> {
    await request.delete('/categories/batch', {
      data: { ids }
    });
  }

  /**
   * 更新分类状态
   * @param id 分类ID
   * @param status 新状态
   * @returns 更新后的分类信息
   */
  static async updateCategoryStatus(id: number, status: 'ACTIVE' | 'INACTIVE'): Promise<Category> {
    return await request.patch(`/categories/${id}/status`, {
      status
    });
  }

  /**
   * 批量更新分类状态
   * @param ids 分类ID数组
   * @param status 新状态
   * @returns 更新结果
   */
  static async batchUpdateCategoryStatus(ids: number[], status: 'ACTIVE' | 'INACTIVE'): Promise<void> {
    await request.patch('/categories/batch/status', {
      ids,
      status
    });
  }

  /**
   * 获取所有启用的分类（用于下拉选择）
   * @returns 启用的分类列表
   */
  static async getActiveCategories(): Promise<Category[]> {
    return await request.get('/categories/active');
  }

  /**
   * 检查分类别名是否可用
   * @param slug 分类别名
   * @param excludeId 排除的分类ID（编辑时使用）
   * @returns 是否可用
   */
  static async checkSlugAvailable(slug: string, excludeId?: number): Promise<boolean> {
    const response: { available: boolean } = await request.get('/categories/check-slug', {
      params: {
        slug,
        excludeId
      }
    });
    return response.available;
  }

  /**
   * 获取分类统计信息
   * @returns 分类统计数据
   */
  static async getCategoryStats(): Promise<{
    total: number;
    active: number;
    inactive: number;
    withArticles: number;
  }> {
    return await request.get('/categories/stats');
  }

  /**
   * 更新分类排序
   * @param sortData 排序数据数组
   * @returns 更新结果
   */
  static async updateCategoriesSort(sortData: Array<{ id: number; sortOrder: number }>): Promise<void> {
    await request.patch('/categories/sort', {
      sortData
    });
  }
}

// 导出默认实例
export default CategoryAPI;