/**
 * 技术栈相关类型定义
 * 基于数据库表 tech_stack 设计
 */

/**
 * 技术栈状态枚举
 */
export enum TechStackStatus {
  HIDDEN = 0,  // 不展示
  VISIBLE = 1, // 展示
}

/**
 * 技术栈分类枚举
 */
export enum TechStackCategory {
  FRONTEND = 'frontend',     // 前端
  BACKEND = 'backend',       // 后端
  DATABASE = 'database',     // 数据库
  DEVOPS = 'devops',        // 运维
  TOOLS = 'tools',          // 工具
  MOBILE = 'mobile',        // 移动端
  DESIGN = 'design',        // 设计
  OTHER = 'other',          // 其他
}

/**
 * 技术栈基础接口
 */
export interface TechStack {
  id: number;
  name: string;
  category: TechStackCategory;
  description?: string;
  icon?: string;
  officialUrl?: string;
  sortOrder: number;
  status: TechStackStatus;
  createTime: string;
  updateTime: string;
  isDelete: number;
}

/**
 * 技术栈创建请求接口
 */
export interface TechStackCreateRequest {
  name: string;
  category: TechStackCategory;
  description?: string;
  icon?: string;
  officialUrl?: string;
  sortOrder: number;
  status: TechStackStatus;
}

/**
 * 技术栈更新请求接口
 */
export interface TechStackUpdateRequest {
  id: number;
  name: string;
  category: TechStackCategory;
  description?: string;
  icon?: string;
  officialUrl?: string;
  sortOrder: number;
  status: TechStackStatus;
}

/**
 * 技术栈查询参数接口
 */
export interface TechStackQueryParams {
  page?: number;
  pageSize?: number;
  name?: string;
  category?: TechStackCategory;
  status?: TechStackStatus;
  sortBy?: 'createTime' | 'updateTime' | 'sortOrder' | 'name';
  sortOrder?: 'asc' | 'desc';
}

/**
 * 技术栈分页响应接口
 */
export interface TechStackPageResponse {
  list: TechStack[];
  total: number;
  page: number;
  pageSize: number;
}

/**
 * 技术栈统计信息接口
 */
export interface TechStackStats {
  totalCount: number;
  visibleCount: number;
  hiddenCount: number;
  categoryStats: {
    category: TechStackCategory;
    count: number;
  }[];
}

/**
 * 技术栈状态选项
 */
export const TECH_STACK_STATUS_OPTIONS = [
  { label: '展示', value: TechStackStatus.VISIBLE },
  { label: '隐藏', value: TechStackStatus.HIDDEN },
];

/**
 * 技术栈分类选项
 */
export const TECH_STACK_CATEGORY_OPTIONS = [
  { label: '前端', value: TechStackCategory.FRONTEND },
  { label: '后端', value: TechStackCategory.BACKEND },
  { label: '数据库', value: TechStackCategory.DATABASE },
  { label: '运维', value: TechStackCategory.DEVOPS },
  { label: '工具', value: TechStackCategory.TOOLS },
  { label: '移动端', value: TechStackCategory.MOBILE },
  { label: '设计', value: TechStackCategory.DESIGN },
  { label: '其他', value: TechStackCategory.OTHER },
];

/**
 * 技术栈排序选项
 */
export const TECH_STACK_SORT_OPTIONS = [
  { label: '创建时间', value: 'createTime' },
  { label: '更新时间', value: 'updateTime' },
  { label: '排序权重', value: 'sortOrder' },
  { label: '技术名称', value: 'name' },
];

/**
 * 默认技术栈图标
 */
export const DEFAULT_TECH_STACK_ICONS = [
  'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg',
  'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vue/vue-original.svg',
  'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/angular/angular-original.svg',
  'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg',
  'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/spring/spring-original.svg',
  'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg',
  'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg',
  'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg',
];