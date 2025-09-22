import request from '../utils/request';
import type {
  Travel,
  TravelCreateRequest,
  TravelUpdateRequest,
  TravelQueryParams,
  TravelPaginationResponse
} from '../types/travel';

/**
 * 旅行记录管理API接口
 */
export class TravelAPI {
  
  /**
   * 获取旅行记录分页列表
   * @param params 查询参数
   * @returns 分页旅行记录列表
   */
  static async getTravels(params?: TravelQueryParams): Promise<TravelPaginationResponse> {
    return await request.get('/travels', {
      params: {
        page: params?.page || 1,
        pageSize: params?.pageSize || 10,
        title: params?.title,
        destination: params?.destination,
        status: params?.status,
        startDate: params?.startDate,
        endDate: params?.endDate,
        sortBy: params?.sortBy || 'createTime',
        sortOrder: params?.sortOrder || 'desc'
      }
    });
  }

  /**
   * 根据ID获取旅行记录详情
   * @param id 旅行记录ID
   * @returns 旅行记录详情
   */
  static async getTravelById(id: number): Promise<Travel> {
    return await request.get(`/travels/${id}`);
  }

  /**
   * 创建新旅行记录
   * @param data 旅行记录创建数据
   * @returns 创建的旅行记录信息
   */
  static async createTravel(data: TravelCreateRequest): Promise<Travel> {
    return await request.post('/travels', data);
  }

  /**
   * 更新旅行记录信息
   * @param id 旅行记录ID
   * @param data 旅行记录更新数据
   * @returns 更新后的旅行记录信息
   */
  static async updateTravel(id: number, data: TravelUpdateRequest): Promise<Travel> {
    return await request.put(`/travels/${id}`, data);
  }

  /**
   * 删除旅行记录
   * @param id 旅行记录ID
   */
  static async deleteTravel(id: number): Promise<void> {
    await request.delete(`/travels/${id}`);
  }

  /**
   * 批量删除旅行记录
   * @param ids 旅行记录ID数组
   */
  static async batchDeleteTravels(ids: number[]): Promise<void> {
    await request.delete('/travels/batch', {
      data: { ids }
    });
  }

  /**
   * 获取最近的旅行记录
   * @param limit 限制数量，默认5
   * @returns 最近旅行记录列表
   */
  static async getRecentTravels(limit: number = 5): Promise<Travel[]> {
    return await request.get('/travels/recent', {
      params: { limit }
    });
  }

  /**
   * 获取旅行记录统计信息
   * @returns 统计信息
   */
  static async getTravelStats(): Promise<{
    total: number;
    totalDays: number;
    totalCost: number;
    averageCost: number;
    mostVisitedLocation: string | null;
  }> {
    return await request.get('/travels/stats');
  }

  /**
   * 搜索旅行记录
   * @param keyword 搜索关键词
   * @param limit 限制数量，默认10
   * @returns 搜索结果
   */
  static async searchTravels(keyword: string, limit: number = 10): Promise<Travel[]> {
    return await request.get('/travels/search', {
      params: { keyword, limit }
    });
  }

  /**
   * 获取旅行记录的地理位置统计
   * @returns 地理位置统计
   */
  static async getLocationStats(): Promise<Array<{
    location: string;
    count: number;
    totalDays: number;
    totalCost: number;
  }>> {
    return await request.get('/travels/location-stats');
  }

  /**
   * 上传旅行记录图片
   * @param file 图片文件
   * @returns 图片URL
   */
  static async uploadTravelImage(file: File): Promise<{ url: string }> {
    const formData = new FormData();
    formData.append('file', file);
    
    return await request.post('/travels/upload-image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  }

  /**
   * 获取旅行记录的时间线数据
   * @param year 年份，可选
   * @returns 时间线数据
   */
  static async getTravelTimeline(year?: number): Promise<Array<{
    date: string;
    travels: Travel[];
  }>> {
    return await request.get('/travels/timeline', {
      params: { year }
    });
  }
}

export default TravelAPI;