/**
 * 文章管理相关的类型定义
 * 基于数据库表结构：article
 */

// 文章状态枚举
export enum ArticleStatus {
  DRAFT = 0,      // 草稿
  PUBLISHED = 1,  // 已发布
  OFFLINE = 2     // 已下线
}

// 文章状态类型（用于表单）
export type ArticleStatusType = 'draft' | 'published' | 'archived';

// 文章分类接口
export interface ArticleCategory {
  id: number;
  name: string;
  description?: string;
  sort_order?: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// 文章表单数据接口
export interface ArticleFormData {
  title: string;
  summary?: string;
  content: string;
  category_id?: number;
  tags?: string[];
  status: ArticleStatusType;
  is_featured?: boolean;
  allow_comments?: boolean;
  published_at?: string | null;
  seo_title?: string;
  seo_description?: string;
  seo_keywords?: string;
  word_count?: number;
  reading_time?: number;
}

// 文章状态选项
export const ARTICLE_STATUS_OPTIONS = [
  { label: '草稿', value: ArticleStatus.DRAFT, color: 'default' },
  { label: '已发布', value: ArticleStatus.PUBLISHED, color: 'success' },
  { label: '已下线', value: ArticleStatus.OFFLINE, color: 'error' }
];

// 文章排序选项
export const ARTICLE_SORT_OPTIONS = [
  { label: '创建时间倒序', value: 'create_time_desc' },
  { label: '创建时间正序', value: 'create_time_asc' },
  { label: '发布时间倒序', value: 'publish_time_desc' },
  { label: '发布时间正序', value: 'publish_time_asc' },
  { label: '更新时间倒序', value: 'update_time_desc' },
  { label: '更新时间正序', value: 'update_time_asc' },
  { label: '字数倒序', value: 'word_count_desc' },
  { label: '字数正序', value: 'word_count_asc' }
];

// 文章基础信息接口
export interface Article {
  id: number;
  title: string;
  slug: string;
  summary?: string;
  content: string;
  coverImage?: string;
  categoryId?: number;
  authorId: number;
  status: ArticleStatus;
  isTop: boolean;
  isFeatured: boolean;
  wordCount: number;
  readingTime: number;
  publishTime?: string;
  createTime: string;
  updateTime: string;
  isDelete: boolean;
  
  // 关联数据（可选，用于列表展示）
  categoryName?: string;
  authorName?: string;
  tagNames?: string[];
}

// 文章创建请求接口
export interface ArticleCreateRequest {
  title: string;
  slug: string;
  summary?: string;
  content: string;
  coverImage?: string;
  categoryId?: number;
  status: ArticleStatus;
  isTop?: boolean;
  isFeatured?: boolean;
  publishTime?: string;
  tagIds?: number[];
}

// 文章更新请求接口
export interface ArticleUpdateRequest {
  id: number;
  title?: string;
  slug?: string;
  summary?: string;
  content?: string;
  coverImage?: string;
  categoryId?: number;
  status?: ArticleStatus;
  isTop?: boolean;
  isFeatured?: boolean;
  publishTime?: string;
  tagIds?: number[];
}

// 文章查询参数接口
export interface ArticleQueryParams {
  page?: number;
  pageSize?: number;
  title?: string;
  slug?: string;
  categoryId?: number;
  authorId?: number;
  status?: ArticleStatus;
  isTop?: boolean;
  isFeatured?: boolean;
  startDate?: string;
  endDate?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  keyword?: string;
}

// 文章统计信息接口
export interface ArticleStats {
  total: number;
  published: number;
  draft: number;
  offline: number;
  featured: number;
  top: number;
  totalWordCount: number;
  avgReadingTime: number;
}

// 文章分页响应接口
export interface ArticlePageResponse {
  list: Article[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// 文章详情响应接口
export interface ArticleDetailResponse extends Article {
  tags?: Array<{
    id: number;
    name: string;
    color?: string;
  }>;
  category?: {
    id: number;
    name: string;
    description?: string;
  };
  author?: {
    id: number;
    username: string;
    nickname?: string;
    avatar?: string;
  };
}

// 文章编辑器状态接口
export interface ArticleEditorState {
  mode: 'markdown' | 'rich'; // 编辑模式
  content: string;
  preview: boolean; // 是否显示预览
  fullscreen: boolean; // 是否全屏
  wordCount: number;
  readingTime: number;
}

// 图片上传响应接口
export interface ImageUploadResponse {
  url: string;
  filename: string;
  size: number;
  type: string;
}

// 默认查询参数
export const DEFAULT_ARTICLE_QUERY_PARAMS: ArticleQueryParams = {
  page: 1,
  pageSize: 10,
  sortBy: 'create_time',
  sortOrder: 'desc'
};

// 文章表单验证规则
export const ARTICLE_FORM_RULES = {
  title: [
    { required: true, message: '请输入文章标题' },
    { max: 200, message: '标题长度不能超过200个字符' }
  ],
  slug: [
    { required: true, message: '请输入文章别名' },
    { max: 200, message: '别名长度不能超过200个字符' },
    { pattern: /^[a-z0-9-]+$/, message: '别名只能包含小写字母、数字和连字符' }
  ],
  content: [
    { required: true, message: '请输入文章内容' }
  ],
  summary: [
    { max: 500, message: '摘要长度不能超过500个字符' }
  ],
  coverImage: [
    { type: 'url', message: '请输入有效的图片URL' }
  ]
};