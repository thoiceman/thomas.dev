/**
 * 标签管理相关类型定义
 * 基于数据库表结构：tag
 */

// 标签基础信息接口
export interface Tag {
  id: number;                    // 标签ID
  name: string;                  // 标签名称
  slug: string;                  // 标签别名（URL友好）
  color?: string;                // 标签颜色
  useCount: number;              // 使用次数
  createTime: string;            // 创建时间
  updateTime: string;            // 更新时间
  isDelete: number;              // 是否删除：0-未删除，1-已删除
}

// 创建标签请求接口
export interface CreateTagRequest {
  name: string;                  // 标签名称（必填）
  slug: string;                  // 标签别名（必填，唯一）
  color?: string;                // 标签颜色（可选）
}

// 标签更新参数接口
export interface TagUpdateParams {
  name?: string;                 // 标签名称（可选）
  slug?: string;                 // 标签别名（可选）
  color?: string;                // 标签颜色（可选）
}

// 标签创建请求接口
export interface TagCreateRequest {
  name: string;                  // 标签名称（必填）
  slug: string;                  // 标签别名（必填）
  color?: string;                // 标签颜色（可选）
}

// 标签更新请求接口
export interface TagUpdateRequest {
  name?: string;                 // 标签名称（可选）
  slug?: string;                 // 标签别名（可选）
  color?: string;                // 标签颜色（可选）
}

// 更新标签请求接口
export interface UpdateTagRequest {
  id: number;                    // 标签ID（必填）
  name?: string;                 // 标签名称（可选）
  slug?: string;                 // 标签别名（可选）
  color?: string;                // 标签颜色（可选）
}

// 标签查询参数接口
export interface TagQueryParams {
  page?: number;                 // 页码（默认1）
  size?: number;                 // 每页大小（默认10）
  name?: string;                 // 按名称搜索
  sortBy?: 'createTime' | 'updateTime' | 'useCount' | 'name'; // 排序字段
  sortOrder?: 'asc' | 'desc';    // 排序方向
}

// 标签分页响应接口
export interface TagPageResponse {
  content: Tag[];                // 标签列表
  totalElements: number;         // 总记录数
  totalPages: number;            // 总页数
  currentPage: number;           // 当前页码
  size: number;                  // 每页大小
  hasNext: boolean;              // 是否有下一页
  hasPrevious: boolean;          // 是否有上一页
}

// API响应接口
export interface ApiResponse<T = any> {
  code: number;                  // 响应码
  message: string;               // 响应消息
  data: T;                       // 响应数据
  timestamp: number;             // 时间戳
}

// 标签表单数据接口
export interface TagFormData {
  name: string;                  // 标签名称
  slug: string;                  // 标签别名
  color: string;                 // 标签颜色
}

// 默认标签颜色选项
export const DEFAULT_TAG_COLORS = [
  '#1890ff', // 蓝色
  '#52c41a', // 绿色
  '#faad14', // 黄色
  '#f5222d', // 红色
  '#722ed1', // 紫色
  '#fa541c', // 橙色
  '#13c2c2', // 青色
  '#eb2f96', // 品红
  '#2f54eb', // 深蓝
  '#389e0d', // 深绿
  '#d48806', // 深黄
  '#cf1322', // 深红
] as const;

// 排序选项
export const TAG_SORT_OPTIONS = [
  { label: '创建时间', value: 'createTime' },
  { label: '更新时间', value: 'updateTime' },
  { label: '使用次数', value: 'useCount' },
  { label: '标签名称', value: 'name' },
] as const;

// 标签颜色预设选项
export const TAG_COLOR_PRESETS = [
  { label: '蓝色', value: '#1890ff' },
  { label: '绿色', value: '#52c41a' },
  { label: '黄色', value: '#faad14' },
  { label: '红色', value: '#f5222d' },
  { label: '紫色', value: '#722ed1' },
  { label: '橙色', value: '#fa541c' },
  { label: '青色', value: '#13c2c2' },
  { label: '品红', value: '#eb2f96' },
] as const;