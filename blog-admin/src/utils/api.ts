import request from './request';

/**
 * 通用API基类
 * 用于减少各个API文件中的重复代码
 */
export class BaseAPI {
  /**
   * 获取分页列表的通用方法
   * @param endpoint API端点
   * @param params 查询参数
   * @returns 分页响应
   */
  static async getPagedList<T, P>(endpoint: string, params?: P): Promise<T> {
    return await request.get(endpoint, { params });
  }

  /**
   * 根据ID获取详情的通用方法
   * @param endpoint API端点
   * @param id 记录ID
   * @returns 详情数据
   */
  static async getById<T>(endpoint: string, id: number): Promise<T> {
    return await request.get(`${endpoint}/${id}`);
  }

  /**
   * 创建记录的通用方法
   * @param endpoint API端点
   * @param data 创建数据
   * @returns 创建的记录
   */
  static async create<T, D>(endpoint: string, data: D): Promise<T> {
    return await request.post(endpoint, data);
  }

  /**
   * 更新记录的通用方法
   * @param endpoint API端点
   * @param id 记录ID
   * @param data 更新数据
   * @returns 更新后的记录
   */
  static async update<T, D>(endpoint: string, id: number, data: D): Promise<T> {
    return await request.put(`${endpoint}/${id}`, data);
  }

  /**
   * 删除记录的通用方法
   * @param endpoint API端点
   * @param id 记录ID
   */
  static async delete(endpoint: string, id: number): Promise<void> {
    return await request.delete(`${endpoint}/${id}`);
  }

  /**
   * 批量删除记录的通用方法
   * @param endpoint API端点
   * @param ids 记录ID数组
   */
  static async batchDelete(endpoint: string, ids: number[]): Promise<void> {
    return await request.delete(`${endpoint}/batch`, { data: { ids } });
  }

  /**
   * 检查字段唯一性的通用方法
   * @param endpoint API端点
   * @param field 字段名
   * @param value 字段值
   * @param excludeId 排除的ID（用于编辑时检查）
   * @returns 是否可用
   */
  static async checkUnique(
    endpoint: string,
    field: string,
    value: string,
    excludeId?: number
  ): Promise<boolean> {
    return await request.get(`${endpoint}/check-${field}`, {
      params: { [field]: value, excludeId }
    });
  }
}

/**
 * 通用分页参数接口
 */
export interface BaseQueryParams {
  page?: number;
  size?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

/**
 * 通用分页响应接口
 */
export interface BasePageResponse<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  currentPage: number;
  size: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

/**
 * 通用API响应接口
 */
export interface BaseApiResponse<T = any> {
  code: number;
  message: string;
  data: T;
  timestamp: number;
}