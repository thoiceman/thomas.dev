/**
 * 通用基础信息接口
 */
export interface BaseInfo {
  id: number;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * 通用创建请求接口
 */
export interface BaseCreateRequest {
  name: string;
  description?: string;
}

/**
 * 通用更新请求接口
 */
export interface BaseUpdateRequest extends BaseCreateRequest {
  id: number;
}

/**
 * 通用查询参数接口
 */
export interface BaseQueryParams {
  page?: number;
  size?: number;
  keyword?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  startDate?: string;
  endDate?: string;
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

/**
 * 通用表单数据接口
 */
export interface BaseFormData {
  name: string;
  description?: string;
}

/**
 * 通用统计信息接口
 */
export interface BaseStatistics {
  total: number;
  active: number;
  inactive: number;
  recentlyAdded: number;
}

/**
 * 通用状态枚举
 */
export enum BaseStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  DRAFT = 'draft',
  PUBLISHED = 'published',
  ARCHIVED = 'archived',
}

/**
 * 通用排序选项
 */
export interface BaseSortOption {
  label: string;
  value: string;
  order: 'asc' | 'desc';
}

/**
 * 通用筛选选项
 */
export interface BaseFilterOption {
  label: string;
  value: string | number;
}

/**
 * 通用操作结果接口
 */
export interface BaseOperationResult {
  success: boolean;
  message: string;
  data?: any;
}

/**
 * 通用批量操作参数
 */
export interface BaseBatchOperation {
  ids: number[];
  operation: 'delete' | 'activate' | 'deactivate' | 'archive';
}

/**
 * 通用导出参数
 */
export interface BaseExportParams {
  format: 'excel' | 'csv' | 'pdf';
  fields?: string[];
  filters?: Record<string, any>;
}