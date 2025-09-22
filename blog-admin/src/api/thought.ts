/**
 * 想法管理相关的API接口
 */

import request from '../utils/request';
import type {
  Thought,
  ThoughtCreateRequest,
  ThoughtUpdateRequest,
  ThoughtQueryParams,
  ThoughtPaginationResponse,
  ThoughtStats,
} from '../types/thought';

// API基础路径
const THOUGHT_API_BASE = '/api/thoughts';

/**
 * 获取想法列表（分页）
 * @param params 查询参数
 * @returns 分页想法列表
 */
export const getThoughts = async (params: ThoughtQueryParams): Promise<ThoughtPaginationResponse> => {
  const response = await request.get(THOUGHT_API_BASE, { params });
  return response.data;
};

/**
 * 根据ID获取想法详情
 * @param id 想法ID
 * @returns 想法详情
 */
export const getThoughtById = async (id: number): Promise<Thought> => {
  const response = await request.get(`${THOUGHT_API_BASE}/${id}`);
  return response.data;
};

/**
 * 创建新想法
 * @param data 想法创建数据
 * @returns 创建的想法
 */
export const createThought = async (data: ThoughtCreateRequest): Promise<Thought> => {
  const response = await request.post(THOUGHT_API_BASE, data);
  return response.data;
};

/**
 * 更新想法
 * @param id 想法ID
 * @param data 更新数据
 * @returns 更新后的想法
 */
export const updateThought = async (id: number, data: ThoughtUpdateRequest): Promise<Thought> => {
  const response = await request.put(`${THOUGHT_API_BASE}/${id}`, data);
  return response.data;
};

/**
 * 删除想法
 * @param id 想法ID
 * @returns 删除结果
 */
export const deleteThought = async (id: number): Promise<void> => {
  await request.delete(`${THOUGHT_API_BASE}/${id}`);
};

/**
 * 批量删除想法
 * @param ids 想法ID数组
 * @returns 删除结果
 */
export const batchDeleteThoughts = async (ids: number[]): Promise<void> => {
  await request.delete(`${THOUGHT_API_BASE}/batch`, { data: { ids } });
};

/**
 * 更新想法状态
 * @param id 想法ID
 * @param status 新状态
 * @returns 更新后的想法
 */
export const updateThoughtStatus = async (id: number, status: number): Promise<Thought> => {
  const response = await request.patch(`${THOUGHT_API_BASE}/${id}/status`, { status });
  return response.data;
};

/**
 * 批量更新想法状态
 * @param ids 想法ID数组
 * @param status 新状态
 * @returns 更新结果
 */
export const batchUpdateThoughtStatus = async (ids: number[], status: number): Promise<void> => {
  await request.patch(`${THOUGHT_API_BASE}/batch/status`, { ids, status });
};

/**
 * 获取想法统计信息
 * @returns 统计信息
 */
export const getThoughtStats = async (): Promise<ThoughtStats> => {
  const response = await request.get(`${THOUGHT_API_BASE}/stats`);
  return response.data;
};

/**
 * 搜索想法
 * @param keyword 搜索关键词
 * @param params 其他查询参数
 * @returns 搜索结果
 */
export const searchThoughts = async (
  keyword: string,
  params?: Omit<ThoughtQueryParams, 'content'>
): Promise<ThoughtPaginationResponse> => {
  const searchParams = { ...params, content: keyword };
  return getThoughts(searchParams);
};

/**
 * 获取用户的想法列表
 * @param authorId 作者ID
 * @param params 查询参数
 * @returns 用户想法列表
 */
export const getUserThoughts = async (
  authorId: number,
  params?: Omit<ThoughtQueryParams, 'authorId'>
): Promise<ThoughtPaginationResponse> => {
  const queryParams = { ...params, authorId };
  return getThoughts(queryParams);
};

/**
 * 获取公开想法列表
 * @param params 查询参数
 * @returns 公开想法列表
 */
export const getPublicThoughts = async (
  params?: Omit<ThoughtQueryParams, 'status'>
): Promise<ThoughtPaginationResponse> => {
  const queryParams = { ...params, status: 1 }; // 1表示公开
  return getThoughts(queryParams);
};

/**
 * 上传想法图片
 * @param file 图片文件
 * @returns 图片URL
 */
export const uploadThoughtImage = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append('file', file);
  
  const response = await request.post(`${THOUGHT_API_BASE}/upload/image`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  
  return response.data.url;
};

/**
 * 批量上传想法图片
 * @param files 图片文件数组
 * @returns 图片URL数组
 */
export const batchUploadThoughtImages = async (files: File[]): Promise<string[]> => {
  const formData = new FormData();
  files.forEach((file, index) => {
    formData.append(`files`, file);
  });
  
  const response = await request.post(`${THOUGHT_API_BASE}/upload/images`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  
  return response.data.urls;
};