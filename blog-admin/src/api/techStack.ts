/**
 * 技术栈相关API接口
 */

import request from '../utils/request';
import type {
  TechStack,
  TechStackCreateRequest,
  TechStackUpdateRequest,
  TechStackQueryParams,
  TechStackPageResponse,
  TechStackStats,
} from '../types/techStack';

/**
 * 技术栈API基础路径
 */
const TECH_STACK_API_BASE = '/api/tech-stack';

/**
 * 获取技术栈分页列表
 * @param params 查询参数
 * @returns 技术栈分页数据
 */
export const fetchTechStackList = async (
  params: TechStackQueryParams = {}
): Promise<TechStackPageResponse> => {
  const response = await request.get(TECH_STACK_API_BASE, { params });
  return response.data;
};

/**
 * 根据ID获取技术栈详情
 * @param id 技术栈ID
 * @returns 技术栈详情
 */
export const fetchTechStackById = async (id: number): Promise<TechStack> => {
  const response = await request.get(`${TECH_STACK_API_BASE}/${id}`);
  return response.data;
};

/**
 * 创建技术栈
 * @param data 技术栈创建数据
 * @returns 创建的技术栈信息
 */
export const createTechStack = async (
  data: TechStackCreateRequest
): Promise<TechStack> => {
  const response = await request.post(TECH_STACK_API_BASE, data);
  return response.data;
};

/**
 * 更新技术栈
 * @param data 技术栈更新数据
 * @returns 更新后的技术栈信息
 */
export const updateTechStack = async (
  data: TechStackUpdateRequest
): Promise<TechStack> => {
  const response = await request.put(`${TECH_STACK_API_BASE}/${data.id}`, data);
  return response.data;
};

/**
 * 删除技术栈
 * @param id 技术栈ID
 * @returns 删除结果
 */
export const deleteTechStack = async (id: number): Promise<void> => {
  await request.delete(`${TECH_STACK_API_BASE}/${id}`);
};

/**
 * 批量删除技术栈
 * @param ids 技术栈ID数组
 * @returns 删除结果
 */
export const batchDeleteTechStacks = async (ids: number[]): Promise<void> => {
  await request.delete(`${TECH_STACK_API_BASE}/batch`, {
    data: { ids },
  });
};

/**
 * 更新技术栈状态
 * @param id 技术栈ID
 * @param status 新状态
 * @returns 更新后的技术栈信息
 */
export const updateTechStackStatus = async (
  id: number,
  status: number
): Promise<TechStack> => {
  const response = await request.patch(`${TECH_STACK_API_BASE}/${id}/status`, {
    status,
  });
  return response.data;
};

/**
 * 批量更新技术栈状态
 * @param ids 技术栈ID数组
 * @param status 新状态
 * @returns 更新结果
 */
export const batchUpdateTechStackStatus = async (
  ids: number[],
  status: number
): Promise<void> => {
  await request.patch(`${TECH_STACK_API_BASE}/batch/status`, {
    ids,
    status,
  });
};

/**
 * 获取技术栈统计信息
 * @returns 技术栈统计数据
 */
export const fetchTechStackStats = async (): Promise<TechStackStats> => {
  const response = await request.get(`${TECH_STACK_API_BASE}/stats`);
  return response.data;
};

/**
 * 获取热门技术栈
 * @param limit 限制数量
 * @returns 热门技术栈列表
 */
export const fetchPopularTechStacks = async (
  limit: number = 10
): Promise<TechStack[]> => {
  const response = await request.get(`${TECH_STACK_API_BASE}/popular`, {
    params: { limit },
  });
  return response.data;
};

/**
 * 获取技术栈分类统计
 * @returns 分类统计数据
 */
export const fetchTechStackCategoryStats = async (): Promise<{
  category: string;
  count: number;
}[]> => {
  const response = await request.get(`${TECH_STACK_API_BASE}/category-stats`);
  return response.data;
};

/**
 * 搜索技术栈
 * @param keyword 搜索关键词
 * @param limit 限制数量
 * @returns 搜索结果
 */
export const searchTechStacks = async (
  keyword: string,
  limit: number = 20
): Promise<TechStack[]> => {
  const response = await request.get(`${TECH_STACK_API_BASE}/search`, {
    params: { keyword, limit },
  });
  return response.data;
};

/**
 * 检查技术栈名称是否可用
 * @param name 技术栈名称
 * @param excludeId 排除的ID（编辑时使用）
 * @returns 是否可用
 */
export const checkTechStackNameAvailable = async (
  name: string,
  excludeId?: number
): Promise<boolean> => {
  const response = await request.get(`${TECH_STACK_API_BASE}/check-name`, {
    params: { name, excludeId },
  });
  return response.data.available;
};