/**
 * 项目记录相关的类型定义
 * 基于数据库表结构：project
 */

// 项目状态枚举
export enum ProjectStatus {
  STOPPED = 0,      // 停止维护
  DEVELOPING = 1,   // 正在开发
  COMPLETED = 2,    // 已完成
  PAUSED = 3,       // 暂停
}

// 项目类型枚举
export enum ProjectType {
  WEB_APP = 'Web应用',
  MOBILE_APP = '移动应用',
  DESKTOP_APP = '桌面应用',
  OPEN_SOURCE_LIB = '开源库',
  TOOL = '工具',
  GAME = '游戏',
  OTHER = '其他',
}

// 项目记录基础接口
export interface Project {
  id: number;
  name: string;
  slug: string;
  description?: string;
  content?: string; // 项目详细介绍
  coverImage?: string;
  images?: string[]; // JSON数组转换为字符串数组
  demoUrl?: string;
  githubUrl?: string;
  downloadUrl?: string;
  techStack?: string[]; // JSON数组转换为字符串数组
  features?: string[]; // JSON数组转换为字符串数组
  projectType?: ProjectType;
  status: ProjectStatus;
  isFeatured: boolean; // 是否精选
  isOpenSource: boolean; // 是否开源
  startDate?: string; // DATE格式
  endDate?: string; // DATE格式
  sortOrder: number; // 排序权重
  authorId: number;
  createTime: string;
  updateTime: string;
  isDelete: number;
}

// 项目创建请求接口
export interface ProjectCreateRequest {
  name: string;
  slug: string;
  description?: string;
  content?: string;
  coverImage?: string;
  images?: string[];
  demoUrl?: string;
  githubUrl?: string;
  downloadUrl?: string;
  techStack?: string[];
  features?: string[];
  projectType?: ProjectType;
  status?: ProjectStatus;
  isFeatured?: boolean;
  isOpenSource?: boolean;
  startDate?: string;
  endDate?: string;
  sortOrder?: number;
}

// 项目更新请求接口
export interface ProjectUpdateRequest {
  name?: string;
  slug?: string;
  description?: string;
  content?: string;
  coverImage?: string;
  images?: string[];
  demoUrl?: string;
  githubUrl?: string;
  downloadUrl?: string;
  techStack?: string[];
  features?: string[];
  projectType?: ProjectType;
  status?: ProjectStatus;
  isFeatured?: boolean;
  isOpenSource?: boolean;
  startDate?: string;
  endDate?: string;
  sortOrder?: number;
}

// 项目查询参数接口
export interface ProjectQueryParams {
  page?: number;
  pageSize?: number;
  name?: string; // 项目名称搜索
  slug?: string; // 项目别名搜索
  projectType?: ProjectType; // 项目类型筛选
  status?: ProjectStatus; // 状态筛选
  isFeatured?: boolean; // 是否精选筛选
  isOpenSource?: boolean; // 是否开源筛选
  authorId?: number; // 作者筛选
  startDate?: string; // 开始日期范围
  endDate?: string; // 结束日期范围
  sortBy?: 'createTime' | 'updateTime' | 'startDate' | 'endDate' | 'sortOrder' | 'name';
  sortOrder?: 'asc' | 'desc';
}

// 项目统计信息接口
export interface ProjectStats {
  total: number;
  featuredCount: number;
  openSourceCount: number;
  thisYearCount: number;
  thisMonthCount: number;
  statusStats: Array<{
    status: ProjectStatus;
    count: number;
  }>;
  typeStats: Array<{
    type: ProjectType;
    count: number;
  }>;
  techStackStats: Array<{
    tech: string;
    count: number;
  }>;
}

// 项目分页响应接口
export interface ProjectPaginationResponse {
  content: Project[];
  totalElements: number;
  totalPages: number;
  currentPage: number;
  size: number;
  first: boolean;
  last: boolean;
}

// 项目状态选项
export const PROJECT_STATUS_OPTIONS = [
  { label: '停止维护', value: ProjectStatus.STOPPED, color: '#ff4d4f' },
  { label: '正在开发', value: ProjectStatus.DEVELOPING, color: '#1890ff' },
  { label: '已完成', value: ProjectStatus.COMPLETED, color: '#52c41a' },
  { label: '暂停', value: ProjectStatus.PAUSED, color: '#faad14' },
];

// 项目类型选项
export const PROJECT_TYPE_OPTIONS = [
  { label: '🌐 Web应用', value: ProjectType.WEB_APP, icon: '🌐' },
  { label: '📱 移动应用', value: ProjectType.MOBILE_APP, icon: '📱' },
  { label: '💻 桌面应用', value: ProjectType.DESKTOP_APP, icon: '💻' },
  { label: '📚 开源库', value: ProjectType.OPEN_SOURCE_LIB, icon: '📚' },
  { label: '🔧 工具', value: ProjectType.TOOL, icon: '🔧' },
  { label: '🎮 游戏', value: ProjectType.GAME, icon: '🎮' },
  { label: '📦 其他', value: ProjectType.OTHER, icon: '📦' },
];

// 项目排序选项
export const PROJECT_SORT_OPTIONS = [
  { label: '创建时间', value: 'createTime' },
  { label: '更新时间', value: 'updateTime' },
  { label: '开始日期', value: 'startDate' },
  { label: '结束日期', value: 'endDate' },
  { label: '排序权重', value: 'sortOrder' },
  { label: '项目名称', value: 'name' },
];

// 默认查询参数
export const DEFAULT_PROJECT_QUERY_PARAMS: ProjectQueryParams = {
  page: 1,
  pageSize: 10,
  sortBy: 'sortOrder',
  sortOrder: 'desc',
};

// 项目表单初始值
export const PROJECT_FORM_INITIAL_VALUES = {
  name: '',
  slug: '',
  description: '',
  content: '',
  coverImage: '',
  images: [],
  demoUrl: '',
  githubUrl: '',
  downloadUrl: '',
  techStack: [],
  features: [],
  projectType: undefined,
  status: ProjectStatus.DEVELOPING,
  isFeatured: false,
  isOpenSource: false,
  startDate: '',
  endDate: '',
  sortOrder: 0,
};

// 常用技术栈选项
export const COMMON_TECH_STACK_OPTIONS = [
  'React', 'Vue.js', 'Angular', 'TypeScript', 'JavaScript',
  'Node.js', 'Express', 'Koa', 'Nest.js', 'Spring Boot',
  'Java', 'Python', 'Go', 'Rust', 'C++',
  'MySQL', 'PostgreSQL', 'MongoDB', 'Redis', 'Elasticsearch',
  'Docker', 'Kubernetes', 'AWS', 'Azure', 'GCP',
  'Git', 'GitHub', 'GitLab', 'Jenkins', 'CI/CD',
  'Webpack', 'Vite', 'Rollup', 'Babel', 'ESLint',
  'Jest', 'Cypress', 'Playwright', 'Storybook', 'Figma',
];