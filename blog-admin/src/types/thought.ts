/**
 * 想法相关的类型定义
 * 基于数据库表结构：thought
 */

// 想法状态枚举
export enum ThoughtStatus {
  PRIVATE = 0, // 私密
  PUBLIC = 1,  // 公开
}

// 心情状态枚举
export enum MoodType {
  HAPPY = 'happy',
  SAD = 'sad',
  EXCITED = 'excited',
  CALM = 'calm',
  ANGRY = 'angry',
  CONFUSED = 'confused',
  GRATEFUL = 'grateful',
  NOSTALGIC = 'nostalgic',
}

// 想法基础接口
export interface Thought {
  id: number;
  content: string;
  images?: string[]; // JSON数组转换为字符串数组
  mood?: MoodType;
  location?: string;
  weather?: string;
  authorId: number;
  status: ThoughtStatus;
  createTime: string;
  updateTime: string;
  isDelete: number;
}

// 创建想法请求接口
export interface ThoughtCreateRequest {
  content: string;
  images?: string[];
  mood?: MoodType;
  location?: string;
  weather?: string;
  status?: ThoughtStatus;
}

// 更新想法请求接口
export interface ThoughtUpdateRequest {
  content?: string;
  images?: string[];
  mood?: MoodType;
  location?: string;
  weather?: string;
  status?: ThoughtStatus;
}

// 想法查询参数接口
export interface ThoughtQueryParams {
  page?: number;
  pageSize?: number;
  content?: string; // 内容搜索
  mood?: MoodType; // 心情筛选
  status?: ThoughtStatus; // 状态筛选
  authorId?: number; // 作者筛选
  startDate?: string; // 开始日期
  endDate?: string; // 结束日期
  sortBy?: 'createTime' | 'updateTime' | 'id';
  sortOrder?: 'asc' | 'desc';
}

// 想法统计信息接口
export interface ThoughtStats {
  total: number;
  publicCount: number;
  privateCount: number;
  todayCount: number;
  weekCount: number;
  monthCount: number;
  moodStats: Array<{
    mood: MoodType;
    count: number;
  }>;
}

// 分页响应接口
export interface ThoughtPaginationResponse {
  content: Thought[];
  totalElements: number;
  totalPages: number;
  currentPage: number;
  size: number;
  first: boolean;
  last: boolean;
}

// 想法状态选项
export const THOUGHT_STATUS_OPTIONS = [
  { label: '公开', value: ThoughtStatus.PUBLIC },
  { label: '私密', value: ThoughtStatus.PRIVATE },
];

// 心情状态选项
export const MOOD_OPTIONS = [
  { label: '😊 开心', value: MoodType.HAPPY, color: '#52c41a' },
  { label: '😢 难过', value: MoodType.SAD, color: '#1890ff' },
  { label: '🎉 兴奋', value: MoodType.EXCITED, color: '#fa541c' },
  { label: '😌 平静', value: MoodType.CALM, color: '#13c2c2' },
  { label: '😠 愤怒', value: MoodType.ANGRY, color: '#f5222d' },
  { label: '😕 困惑', value: MoodType.CONFUSED, color: '#722ed1' },
  { label: '🙏 感恩', value: MoodType.GRATEFUL, color: '#eb2f96' },
  { label: '🌅 怀念', value: MoodType.NOSTALGIC, color: '#faad14' },
];

// 排序选项
export const THOUGHT_SORT_OPTIONS = [
  { label: '创建时间', value: 'createTime' },
  { label: '更新时间', value: 'updateTime' },
  { label: 'ID', value: 'id' },
];

// 默认查询参数
export const DEFAULT_THOUGHT_QUERY_PARAMS: ThoughtQueryParams = {
  page: 1,
  pageSize: 10,
  sortBy: 'createTime',
  sortOrder: 'desc',
};