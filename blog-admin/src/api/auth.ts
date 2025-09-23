import request from '../utils/request';

/**
 * 登录请求参数接口
 */
export interface LoginCredentials {
  username: string;
  password: string;
  remember?: boolean;
}

/**
 * 登录响应数据接口
 */
export interface LoginResponse {
  token: string;
  user: UserInfo;
}

/**
 * 注册请求参数接口
 */
export interface RegisterParams {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

/**
 * 用户信息接口
 */
export interface UserInfo {
  id: number;
  username: string;
  email: string;
  role: string;
  avatar?: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * API响应接口
 */
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data: T;
  code: number;
}

/**
 * 注册请求参数
 */
export interface RegisterCredentials {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

/**
 * 注册响应数据
 */
export interface RegisterResponse {
  success: boolean;
  message: string;
  data?: {
    userId: string;
    username: string;
    email: string;
  };
}

/**
 * 认证相关API接口
 */
export const authAPI = {
  /**
   * 用户登录
   */
  login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
    const response = await request.post<LoginResponse>('/auth/login', credentials);
    return response.data;
  },

  /**
   * 用户注册
   */
  register: async (credentials: RegisterCredentials): Promise<RegisterResponse> => {
    const response = await request.post<RegisterResponse>('/auth/register', credentials);
    return response.data;
  },

  /**
   * 用户登出
   */
  logout: async (): Promise<void> => {
    await request.post('/auth/logout');
  },

  /**
   * 获取用户信息
   */
  getUserInfo: async (): Promise<UserInfo> => {
    const response = await request.get<UserInfo>('/auth/user');
    return response.data;
  },

  /**
   * 刷新token
   */
  refreshToken: async (): Promise<{ token: string }> => {
    const response = await request.post<{ token: string }>('/auth/refresh');
    return response.data;
  },
};