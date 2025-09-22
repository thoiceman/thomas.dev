import request from '../utils/request';
import type {
  Project,
  ProjectCreateRequest,
  ProjectUpdateRequest,
  ProjectQueryParams,
  ProjectPaginationResponse,
  ProjectStats
} from '../types/project';

/**
 * 项目记录管理API接口
 */
export class ProjectAPI {
  
  /**
   * 获取项目分页列表
   * @param params 查询参数
   * @returns 分页项目列表
   */
  static async getProjects(params?: ProjectQueryParams): Promise<ProjectPaginationResponse> {
    return await request.get('/projects', {
      params: {
        page: params?.page || 1,
        pageSize: params?.pageSize || 10,
        name: params?.name,
        status: params?.status,
        projectType: params?.projectType,
        isFeatured: params?.isFeatured,
        sortBy: params?.sortBy || 'createTime',
        sortOrder: params?.sortOrder || 'desc'
      }
    });
  }

  /**
   * 根据ID获取项目详情
   * @param id 项目ID
   * @returns 项目详情
   */
  static async getProjectById(id: number): Promise<Project> {
    return await request.get(`/projects/${id}`);
  }

  /**
   * 创建新项目
   * @param data 项目创建数据
   * @returns 创建的项目信息
   */
  static async createProject(data: ProjectCreateRequest): Promise<Project> {
    return await request.post('/projects', data);
  }

  /**
   * 更新项目信息
   * @param id 项目ID
   * @param data 项目更新数据
   * @returns 更新的项目信息
   */
  static async updateProject(id: number, data: ProjectUpdateRequest): Promise<Project> {
    return await request.put(`/projects/${id}`, data);
  }

  /**
   * 删除项目
   * @param id 项目ID
   */
  static async deleteProject(id: number): Promise<void> {
    await request.delete(`/projects/${id}`);
  }

  /**
   * 批量删除项目
   * @param ids 项目ID数组
   */
  static async batchDeleteProjects(ids: number[]): Promise<void> {
    await request.delete('/projects/batch', {
      data: { ids }
    });
  }

  /**
   * 获取所有项目（不分页）
   * @returns 项目列表
   */
  static async getAllProjects(): Promise<Project[]> {
    return await request.get('/projects/all');
  }

  /**
   * 获取精选项目列表
   * @param limit 限制数量
   * @returns 精选项目列表
   */
  static async getFeaturedProjects(limit?: number): Promise<Project[]> {
    return await request.get('/projects/featured', {
      params: { limit: limit || 10 }
    });
  }

  /**
   * 获取开源项目列表
   * @param limit 限制数量
   * @returns 开源项目列表
   */
  static async getOpenSourceProjects(limit?: number): Promise<Project[]> {
    return await request.get('/projects/opensource', {
      params: { limit: limit || 10 }
    });
  }

  /**
   * 获取项目统计信息
   * @returns 项目统计数据
   */
  static async getProjectStats(): Promise<ProjectStats> {
    return await request.get('/projects/stats');
  }

  /**
   * 切换项目精选状态
   * @param id 项目ID
   * @param featured 是否精选
   */
  static async toggleFeatured(id: number, featured: boolean): Promise<void> {
    await request.patch(`/projects/${id}/featured`, { featured });
  }

  /**
   * 更新项目状态
   * @param id 项目ID
   * @param status 项目状态
   */
  static async updateProjectStatus(id: number, status: string): Promise<void> {
    await request.patch(`/projects/${id}/status`, { status });
  }

  /**
   * 搜索项目
   * @param keyword 搜索关键词
   * @param limit 限制数量
   * @returns 搜索结果
   */
  static async searchProjects(keyword: string, limit?: number): Promise<Project[]> {
    return await request.get('/projects/search', {
      params: { 
        keyword,
        limit: limit || 20
      }
    });
  }

  /**
   * 根据技术栈获取项目
   * @param techStack 技术栈
   * @param limit 限制数量
   * @returns 项目列表
   */
  static async getProjectsByTechStack(techStack: string, limit?: number): Promise<Project[]> {
    return await request.get('/projects/tech-stack', {
      params: { 
        techStack,
        limit: limit || 10
      }
    });
  }

  /**
   * 根据类型获取项目
   * @param type 项目类型
   * @param limit 限制数量
   * @returns 项目列表
   */
  static async getProjectsByType(type: string, limit?: number): Promise<Project[]> {
    return await request.get('/projects/type', {
      params: { 
        type,
        limit: limit || 10
      }
    });
  }

  /**
   * 批量更新项目状态
   * @param updates 更新数据数组
   */
  static async batchUpdateProjectStatus(updates: Array<{ id: number; status: string }>): Promise<void> {
    await request.put('/projects/batch-status', { updates });
  }

  /**
   * 批量更新项目精选状态
   * @param updates 更新数据数组
   */
  static async batchUpdateFeatured(updates: Array<{ id: number; featured: boolean }>): Promise<void> {
    await request.put('/projects/batch-featured', { updates });
  }

  /**
   * 复制项目
   * @param id 源项目ID
   * @param title 新项目标题
   * @returns 复制的项目信息
   */
  static async duplicateProject(id: number, title: string): Promise<Project> {
    return await request.post(`/projects/${id}/duplicate`, { title });
  }

  /**
   * 导出项目数据
   * @param format 导出格式 (json, csv, excel)
   * @param params 查询参数
   * @returns 导出文件的下载链接
   */
  static async exportProjects(format: 'json' | 'csv' | 'excel', params?: ProjectQueryParams): Promise<string> {
    const response = await request.get('/projects/export', {
      params: {
        format,
        ...params
      },
      responseType: 'blob'
    });
    
    // 创建下载链接
    const url = window.URL.createObjectURL(response.data);
    return url;
  }

  /**
   * 导入项目数据
   * @param file 导入文件
   * @returns 导入结果
   */
  static async importProjects(file: File): Promise<{ success: number; failed: number; errors: string[] }> {
    const formData = new FormData();
    formData.append('file', file);
    
    return await request.post('/projects/import', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  }
}

export default ProjectAPI;