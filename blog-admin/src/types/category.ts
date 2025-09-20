/**
 * 分类管理相关类型定义
 * 基于数据库表结构：category
 */

// 分类状态枚举
export enum CategoryStatus {
  DISABLED = 0, // 禁用
  ENABLED = 1,  // 启用
}

// 分类基础信息接口
export interface Category {
  id: number;                    // 分类ID
  name: string;                  // 分类名称
  slug: string;                  // 分类别名（URL友好）
  description?: string;          // 分类描述
  icon?: string;                 // 分类图标
  color?: string;                // 分类颜色
  sortOrder: number;             // 排序权重
  status: CategoryStatus;        // 状态：0-禁用，1-启用
  createTime: string;            // 创建时间
  updateTime: string;            // 更新时间
  isDelete: number;              // 是否删除：0-未删除，1-已删除
}

// 创建分类请求接口
export interface CreateCategoryRequest {
  name: string;                  // 分类名称（必填）
  slug: string;                  // 分类别名（必填，唯一）
  description?: string;          // 分类描述（可选）
  icon?: string;                 // 分类图标（可选）
  color?: string;                // 分类颜色（可选）
  sortOrder?: number;            // 排序权重（可选，默认0）
  status?: CategoryStatus;       // 状态（可选，默认启用）
}

// 分类更新参数接口
export interface CategoryUpdateParams {
  name?: string;                 // 分类名称（可选）
  slug?: string;                 // 分类别名（可选）
  description?: string;          // 分类描述（可选）
  icon?: string;                 // 分类图标（可选）
  color?: string;                // 分类颜色（可选）
  sortOrder?: number;            // 排序权重（可选）
  status?: CategoryStatus;       // 状态（可选）
}

// 分类创建请求接口
export interface CategoryCreateRequest {
  name: string;                  // 分类名称（必填）
  slug: string;                  // 分类别名（必填）
  description?: string;          // 分类描述（可选）
  icon?: string;                 // 分类图标（可选）
  color?: string;                // 分类颜色（可选）
  sortOrder?: number;            // 排序权重（可选，默认0）
  status?: CategoryStatus;       // 状态（可选，默认ACTIVE）
}

// 分类更新请求接口
export interface CategoryUpdateRequest {
  name?: string;                 // 分类名称（可选）
  slug?: string;                 // 分类别名（可选）
  description?: string;          // 分类描述（可选）
  icon?: string;                 // 分类图标（可选）
  color?: string;                // 分类颜色（可选）
  sortOrder?: number;            // 排序权重（可选）
  status?: CategoryStatus;       // 状态（可选）
}

// 更新分类请求接口
export interface UpdateCategoryRequest {
  id: number;                    // 分类ID（必填）
  name?: string;                 // 分类名称（可选）
  slug?: string;                 // 分类别名（可选）
  description?: string;          // 分类描述（可选）
  icon?: string;                 // 分类图标（可选）
  color?: string;                // 分类颜色（可选）
  sortOrder?: number;            // 排序权重（可选）
  status?: CategoryStatus;       // 状态（可选）
}

// 分类查询参数接口
export interface CategoryQueryParams {
  page?: number;                 // 页码（默认1）
  size?: number;                 // 每页大小（默认10）
  name?: string;                 // 按名称搜索
  status?: CategoryStatus;       // 按状态筛选
  sortBy?: 'createTime' | 'updateTime' | 'sortOrder' | 'name'; // 排序字段
  sortOrder?: 'asc' | 'desc';    // 排序方向
}

// 分页响应接口
export interface CategoryPageResponse {
  content: Category[];           // 分类列表
  totalElements: number;         // 总记录数
  totalPages: number;            // 总页数
  currentPage: number;           // 当前页码
  size: number;                  // 每页大小
  hasNext: boolean;              // 是否有下一页
  hasPrevious: boolean;          // 是否有上一页
}

// API响应基础接口
export interface ApiResponse<T = any> {
  code: number;                  // 响应码
  message: string;               // 响应消息
  data: T;                       // 响应数据
  timestamp: number;             // 时间戳
}

// 分类表单数据接口（用于表单组件）
export interface CategoryFormData {
  name: string;                  // 分类名称
  slug: string;                  // 分类别名
  description: string;           // 分类描述
  icon: string;                  // 分类图标
  color: string;                 // 分类颜色
  sortOrder: number;             // 排序权重
  status: CategoryStatus;        // 状态
}

// 分类状态选项
export const CATEGORY_STATUS_OPTIONS = [
  { label: '启用', value: CategoryStatus.ENABLED, color: 'success' },
  { label: '禁用', value: CategoryStatus.DISABLED, color: 'error' },
] as const;

// 默认颜色选项
export const DEFAULT_CATEGORY_COLORS = [
  '#1890ff', // 蓝色
  '#52c41a', // 绿色
  '#faad14', // 黄色
  '#f5222d', // 红色
  '#722ed1', // 紫色
  '#fa541c', // 橙色
  '#13c2c2', // 青色
  '#eb2f96', // 品红
] as const;

// 排序字段选项
export const SORT_OPTIONS = [
  { label: '创建时间', value: 'createTime' },
  { label: '更新时间', value: 'updateTime' },
  { label: '排序权重', value: 'sortOrder' },
  { label: '分类名称', value: 'name' },
] as const;