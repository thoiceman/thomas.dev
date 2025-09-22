/**
 * 旅行记录相关的类型定义
 * 基于数据库表结构：travel
 */

// 旅行记录状态枚举
export enum TravelStatus {
  PRIVATE = 0, // 私密
  PUBLIC = 1,  // 公开
}

// 旅行评分枚举
export enum TravelRating {
  ONE_STAR = 1,
  TWO_STAR = 2,
  THREE_STAR = 3,
  FOUR_STAR = 4,
  FIVE_STAR = 5,
}

// 交通方式枚举
export enum TransportationType {
  PLANE = 'plane',
  TRAIN = 'train',
  CAR = 'car',
  BUS = 'bus',
  SHIP = 'ship',
  BIKE = 'bike',
  WALK = 'walk',
  OTHER = 'other',
}

// 旅行记录基础接口
export interface Travel {
  id: number;
  title: string;
  destination: string;
  country?: string;
  city?: string;
  description?: string;
  content?: string; // 详细游记内容
  coverImage?: string;
  images?: string[]; // JSON数组转换为字符串数组
  startDate: string; // DATE格式
  endDate: string; // DATE格式
  duration?: number; // 旅行天数
  budget?: number; // 预算/花费
  companions?: string; // 同行人员
  transportation?: TransportationType; // 交通方式
  accommodation?: string; // 住宿信息
  highlights?: string[]; // 亮点/推荐（JSON数组转换为字符串数组）
  latitude?: number; // 纬度
  longitude?: number; // 经度
  weather?: string; // 天气情况
  rating?: TravelRating; // 评分（1-5星）
  status: TravelStatus;
  authorId: number;
  createTime: string;
  updateTime: string;
  isDelete: number;
}

// 创建旅行记录请求接口
export interface TravelCreateRequest {
  title: string;
  destination: string;
  country?: string;
  city?: string;
  description?: string;
  content?: string;
  coverImage?: string;
  images?: string[];
  startDate: string;
  endDate: string;
  duration?: number;
  budget?: number;
  companions?: string;
  transportation?: TransportationType;
  accommodation?: string;
  highlights?: string[];
  latitude?: number;
  longitude?: number;
  weather?: string;
  rating?: TravelRating;
  status?: TravelStatus;
}

// 更新旅行记录请求接口
export interface TravelUpdateRequest {
  title?: string;
  destination?: string;
  country?: string;
  city?: string;
  description?: string;
  content?: string;
  coverImage?: string;
  images?: string[];
  startDate?: string;
  endDate?: string;
  duration?: number;
  budget?: number;
  companions?: string;
  transportation?: TransportationType;
  accommodation?: string;
  highlights?: string[];
  latitude?: number;
  longitude?: number;
  weather?: string;
  rating?: TravelRating;
  status?: TravelStatus;
}

// 旅行记录查询参数接口
export interface TravelQueryParams {
  page?: number;
  pageSize?: number;
  title?: string; // 标题搜索
  destination?: string; // 目的地搜索
  country?: string; // 国家筛选
  city?: string; // 城市筛选
  status?: TravelStatus; // 状态筛选
  rating?: TravelRating; // 评分筛选
  transportation?: TransportationType; // 交通方式筛选
  authorId?: number; // 作者筛选
  startDate?: string; // 开始日期范围
  endDate?: string; // 结束日期范围
  minBudget?: number; // 最小预算
  maxBudget?: number; // 最大预算
  sortBy?: 'createTime' | 'updateTime' | 'startDate' | 'endDate' | 'rating' | 'budget';
  sortOrder?: 'asc' | 'desc';
}

// 旅行记录统计信息接口
export interface TravelStats {
  total: number;
  publicCount: number;
  privateCount: number;
  thisYearCount: number;
  thisMonthCount: number;
  totalDays: number; // 总旅行天数
  totalBudget: number; // 总花费
  averageRating: number; // 平均评分
  countryStats: Array<{
    country: string;
    count: number;
  }>;
  ratingStats: Array<{
    rating: TravelRating;
    count: number;
  }>;
  transportationStats: Array<{
    transportation: TransportationType;
    count: number;
  }>;
}

// 分页响应接口
export interface TravelPaginationResponse {
  content: Travel[];
  totalElements: number;
  totalPages: number;
  currentPage: number;
  size: number;
  first: boolean;
  last: boolean;
}

// 旅行记录状态选项
export const TRAVEL_STATUS_OPTIONS = [
  { label: '公开', value: TravelStatus.PUBLIC },
  { label: '私密', value: TravelStatus.PRIVATE },
];

// 旅行评分选项
export const TRAVEL_RATING_OPTIONS = [
  { label: '⭐ 1星', value: TravelRating.ONE_STAR },
  { label: '⭐⭐ 2星', value: TravelRating.TWO_STAR },
  { label: '⭐⭐⭐ 3星', value: TravelRating.THREE_STAR },
  { label: '⭐⭐⭐⭐ 4星', value: TravelRating.FOUR_STAR },
  { label: '⭐⭐⭐⭐⭐ 5星', value: TravelRating.FIVE_STAR },
];

// 交通方式选项
export const TRANSPORTATION_OPTIONS = [
  { label: '✈️ 飞机', value: TransportationType.PLANE, icon: '✈️' },
  { label: '🚄 火车', value: TransportationType.TRAIN, icon: '🚄' },
  { label: '🚗 汽车', value: TransportationType.CAR, icon: '🚗' },
  { label: '🚌 大巴', value: TransportationType.BUS, icon: '🚌' },
  { label: '🚢 轮船', value: TransportationType.SHIP, icon: '🚢' },
  { label: '🚴 自行车', value: TransportationType.BIKE, icon: '🚴' },
  { label: '🚶 步行', value: TransportationType.WALK, icon: '🚶' },
  { label: '🔄 其他', value: TransportationType.OTHER, icon: '🔄' },
];

// 排序选项
export const TRAVEL_SORT_OPTIONS = [
  { label: '创建时间', value: 'createTime' },
  { label: '更新时间', value: 'updateTime' },
  { label: '开始日期', value: 'startDate' },
  { label: '结束日期', value: 'endDate' },
  { label: '评分', value: 'rating' },
  { label: '预算', value: 'budget' },
];

// 默认查询参数
export const DEFAULT_TRAVEL_QUERY_PARAMS: TravelQueryParams = {
  page: 1,
  pageSize: 10,
  sortBy: 'startDate',
  sortOrder: 'desc',
};

// 旅行记录表单初始值
export const TRAVEL_FORM_INITIAL_VALUES = {
  title: '',
  destination: '',
  country: '',
  city: '',
  description: '',
  content: '',
  coverImage: '',
  images: [],
  startDate: '',
  endDate: '',
  duration: undefined,
  budget: undefined,
  companions: '',
  transportation: undefined,
  accommodation: '',
  highlights: [],
  latitude: undefined,
  longitude: undefined,
  weather: '',
  rating: undefined,
  status: TravelStatus.PUBLIC,
};