package com.xu.blogapi.service;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.IService;
import com.xu.blogapi.model.dto.project.ProjectAddRequest;
import com.xu.blogapi.model.dto.project.ProjectQueryRequest;
import com.xu.blogapi.model.dto.project.ProjectUpdateRequest;
import com.xu.blogapi.model.entity.Project;
import com.xu.blogapi.model.entity.User;

import java.util.List;

/**
 * 项目服务接口
 *
 * @author xu
 */
public interface ProjectService extends IService<Project> {

    /**
     * 创建项目
     *
     * @param projectAddRequest 项目创建请求
     * @param loginUser         当前登录用户
     * @return 项目ID
     */
    Long addProject(ProjectAddRequest projectAddRequest, User loginUser);

    /**
     * 更新项目
     *
     * @param projectUpdateRequest 项目更新请求
     * @param loginUser            当前登录用户
     * @return 是否成功
     */
    Boolean updateProject(ProjectUpdateRequest projectUpdateRequest, User loginUser);

    /**
     * 删除项目（逻辑删除）
     *
     * @param id        项目ID
     * @param loginUser 当前登录用户
     * @return 是否成功
     */
    Boolean deleteProject(Long id, User loginUser);

    /**
     * 根据ID获取项目
     *
     * @param id        项目ID
     * @param loginUser 当前登录用户
     * @return 项目信息
     */
    Project getProjectById(Long id, User loginUser);

    /**
     * 根据别名获取项目
     *
     * @param slug      项目别名
     * @param loginUser 当前登录用户
     * @return 项目信息
     */
    Project getProjectBySlug(String slug, User loginUser);

    /**
     * 分页查询项目列表
     *
     * @param projectQueryRequest 查询请求
     * @param loginUser           当前登录用户
     * @return 分页结果
     */
    Page<Project> listProjectsByPage(ProjectQueryRequest projectQueryRequest, User loginUser);

    /**
     * 获取精选项目列表
     *
     * @param loginUser 当前登录用户
     * @return 精选项目列表
     */
    List<Project> listFeaturedProjects(User loginUser);

    /**
     * 获取开源项目列表
     *
     * @param loginUser 当前登录用户
     * @return 开源项目列表
     */
    List<Project> listOpenSourceProjects(User loginUser);

    /**
     * 根据作者ID获取项目列表
     *
     * @param authorId  作者ID
     * @param loginUser 当前登录用户
     * @return 项目列表
     */
    List<Project> listProjectsByAuthor(Long authorId, User loginUser);

    /**
     * 根据项目类型获取项目列表
     *
     * @param projectType 项目类型
     * @param loginUser   当前登录用户
     * @return 项目列表
     */
    List<Project> listProjectsByType(String projectType, User loginUser);

    /**
     * 校验项目参数
     *
     * @param project 项目对象
     */
    void validProject(Project project);

    /**
     * 检查项目是否存在
     *
     * @param id 项目ID
     * @return 是否存在
     */
    Boolean existsById(Long id);

    /**
     * 检查项目别名是否存在
     *
     * @param slug 项目别名
     * @return 是否存在
     */
    Boolean existsBySlug(String slug);

    /**
     * 检查项目别名是否存在（排除指定ID）
     *
     * @param slug 项目别名
     * @param id   排除的项目ID
     * @return 是否存在
     */
    Boolean existsBySlugExcludeId(String slug, Long id);

    /**
     * 统计用户项目数量
     *
     * @param authorId 作者ID
     * @return 项目数量
     */
    Long countUserProjects(Long authorId);

    /**
     * 统计精选项目数量
     *
     * @return 精选项目数量
     */
    Long countFeaturedProjects();

    /**
     * 统计开源项目数量
     *
     * @return 开源项目数量
     */
    Long countOpenSourceProjects();
}