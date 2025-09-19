package com.xu.blogapi.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.xu.blogapi.common.ErrorCode;
import com.xu.blogapi.exception.BusinessException;
import com.xu.blogapi.mapper.ProjectMapper;
import com.xu.blogapi.model.dto.project.ProjectAddRequest;
import com.xu.blogapi.model.dto.project.ProjectQueryRequest;
import com.xu.blogapi.model.dto.project.ProjectUpdateRequest;
import com.xu.blogapi.model.entity.Project;
import com.xu.blogapi.model.entity.User;
import com.xu.blogapi.model.enums.UserRoleEnum;
import com.xu.blogapi.service.ProjectService;
import com.xu.blogapi.service.UserService;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.annotation.Resource;
import java.util.List;

/**
 * 项目服务实现类
 *
 * @author xu
 */
@Service
public class ProjectServiceImpl extends ServiceImpl<ProjectMapper, Project> implements ProjectService {

    @Resource
    private ProjectMapper projectMapper;

    @Resource
    private UserService userService;

    @Override
    @Transactional(rollbackFor = Exception.class)
    public Long addProject(ProjectAddRequest projectAddRequest, User loginUser) {
        // 参数校验
        if (projectAddRequest == null) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR, "请求参数为空");
        }
        if (loginUser == null) {
            throw new BusinessException(ErrorCode.NOT_LOGIN_ERROR);
        }

        // 检查项目别名是否已存在
        if (StringUtils.isNotBlank(projectAddRequest.getSlug()) && existsBySlug(projectAddRequest.getSlug())) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR, "项目别名已存在");
        }

        // 创建项目对象
        Project project = new Project();
        BeanUtils.copyProperties(projectAddRequest, project);
        project.setAuthorId(loginUser.getId());

        // 校验项目参数
        validProject(project);

        // 保存到数据库
        boolean result = this.save(project);
        if (!result) {
            throw new BusinessException(ErrorCode.OPERATION_ERROR, "创建项目失败");
        }

        return project.getId();
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public Boolean updateProject(ProjectUpdateRequest projectUpdateRequest, User loginUser) {
        // 参数校验
        if (projectUpdateRequest == null || projectUpdateRequest.getId() == null) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR, "请求参数为空");
        }
        if (loginUser == null) {
            throw new BusinessException(ErrorCode.NOT_LOGIN_ERROR);
        }

        // 获取原项目
        Project oldProject = this.getById(projectUpdateRequest.getId());
        if (oldProject == null) {
            throw new BusinessException(ErrorCode.NOT_FOUND_ERROR, "项目不存在");
        }

        // 权限校验：只有项目作者或管理员可以更新
        if (!oldProject.getAuthorId().equals(loginUser.getId()) && !userService.isAdmin(loginUser)) {
            throw new BusinessException(ErrorCode.NO_AUTH_ERROR, "无权限更新此项目");
        }

        // 检查项目别名是否已存在（排除当前项目）
        if (StringUtils.isNotBlank(projectUpdateRequest.getSlug()) && 
            existsBySlugExcludeId(projectUpdateRequest.getSlug(), projectUpdateRequest.getId())) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR, "项目别名已存在");
        }

        // 更新项目对象
        Project project = new Project();
        BeanUtils.copyProperties(projectUpdateRequest, project);
        project.setAuthorId(oldProject.getAuthorId()); // 保持原作者不变

        // 校验项目参数
        validProject(project);

        // 更新到数据库
        boolean result = this.updateById(project);
        if (!result) {
            throw new BusinessException(ErrorCode.OPERATION_ERROR, "更新项目失败");
        }

        return true;
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public Boolean deleteProject(Long id, User loginUser) {
        // 参数校验
        if (id == null || id <= 0) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR, "项目ID无效");
        }
        if (loginUser == null) {
            throw new BusinessException(ErrorCode.NOT_LOGIN_ERROR);
        }

        // 检查项目是否存在
        Project project = this.getById(id);
        if (project == null) {
            throw new BusinessException(ErrorCode.NOT_FOUND_ERROR, "项目不存在");
        }

        // 权限校验：只有项目作者或管理员可以删除
        if (!project.getAuthorId().equals(loginUser.getId()) && !userService.isAdmin(loginUser)) {
            throw new BusinessException(ErrorCode.NO_AUTH_ERROR, "无权限删除此项目");
        }

        // 使用MyBatis-Plus的逻辑删除方法
        boolean result = this.removeById(id);
        if (!result) {
            throw new BusinessException(ErrorCode.OPERATION_ERROR, "删除项目失败");
        }

        return true;
    }

    @Override
    public Project getProjectById(Long id, User loginUser) {
        // 参数校验
        if (id == null || id <= 0) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR, "项目ID无效");
        }

        Project project = this.getById(id);
        if (project == null) {
            throw new BusinessException(ErrorCode.NOT_FOUND_ERROR, "项目不存在");
        }

        return project;
    }

    @Override
    public Project getProjectBySlug(String slug, User loginUser) {
        // 参数校验
        if (StringUtils.isBlank(slug)) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR, "项目别名不能为空");
        }

        Project project = projectMapper.selectBySlug(slug);
        if (project == null) {
            throw new BusinessException(ErrorCode.NOT_FOUND_ERROR, "项目不存在");
        }

        return project;
    }

    @Override
    public Page<Project> listProjectsByPage(ProjectQueryRequest projectQueryRequest, User loginUser) {
        // 参数校验
        if (projectQueryRequest == null) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR, "请求参数为空");
        }

        long current = projectQueryRequest.getCurrent();
        long size = projectQueryRequest.getPageSize();

        // 限制爬虫
        if (size > 50) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR, "每页数量不能超过50");
        }

        // 构建查询条件
        QueryWrapper<Project> queryWrapper = new QueryWrapper<>();
        queryWrapper.eq("is_delete", 0);

        // 添加查询条件
        if (StringUtils.isNotBlank(projectQueryRequest.getName())) {
            queryWrapper.like("name", projectQueryRequest.getName());
        }
        if (StringUtils.isNotBlank(projectQueryRequest.getSlug())) {
            queryWrapper.eq("slug", projectQueryRequest.getSlug());
        }
        if (StringUtils.isNotBlank(projectQueryRequest.getDescription())) {
            queryWrapper.like("description", projectQueryRequest.getDescription());
        }
        if (StringUtils.isNotBlank(projectQueryRequest.getProjectType())) {
            queryWrapper.eq("project_type", projectQueryRequest.getProjectType());
        }
        if (projectQueryRequest.getStatus() != null) {
            queryWrapper.eq("status", projectQueryRequest.getStatus());
        }
        if (projectQueryRequest.getIsFeatured() != null) {
            queryWrapper.eq("is_featured", projectQueryRequest.getIsFeatured());
        }
        if (projectQueryRequest.getIsOpenSource() != null) {
            queryWrapper.eq("is_open_source", projectQueryRequest.getIsOpenSource());
        }
        if (projectQueryRequest.getAuthorId() != null) {
            queryWrapper.eq("author_id", projectQueryRequest.getAuthorId());
        }
        if (StringUtils.isNotBlank(projectQueryRequest.getTechStack())) {
            queryWrapper.like("tech_stack", projectQueryRequest.getTechStack());
        }

        // 排序
        String sortField = projectQueryRequest.getSortField();
        String sortOrder = projectQueryRequest.getSortOrder();
        if (StringUtils.isNotBlank(sortField)) {
            boolean isAsc = "asc".equals(sortOrder);
            if ("createTime".equals(sortField)) {
                queryWrapper.orderBy(true, isAsc, "create_time");
            } else if ("updateTime".equals(sortField)) {
                queryWrapper.orderBy(true, isAsc, "update_time");
            } else if ("sortOrder".equals(sortField)) {
                queryWrapper.orderBy(true, isAsc, "sort_order");
            }
        } else {
            // 默认排序：按排序权重降序，创建时间降序
            queryWrapper.orderByDesc("sort_order", "create_time");
        }

        return this.page(new Page<>(current, size), queryWrapper);
    }

    @Override
    public List<Project> listFeaturedProjects(User loginUser) {
        return projectMapper.selectFeaturedProjects();
    }

    @Override
    public List<Project> listOpenSourceProjects(User loginUser) {
        return projectMapper.selectOpenSourceProjects();
    }

    @Override
    public List<Project> listProjectsByAuthor(Long authorId, User loginUser) {
        if (authorId == null || authorId <= 0) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR, "作者ID无效");
        }
        return projectMapper.selectByAuthorId(authorId);
    }

    @Override
    public List<Project> listProjectsByType(String projectType, User loginUser) {
        if (StringUtils.isBlank(projectType)) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR, "项目类型不能为空");
        }
        return projectMapper.selectByProjectType(projectType);
    }

    @Override
    public void validProject(Project project) {
        if (project == null) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR, "项目信息为空");
        }

        String name = project.getName();
        String slug = project.getSlug();
        String description = project.getDescription();
        String content = project.getContent();
        String coverImage = project.getCoverImage();
        String demoUrl = project.getDemoUrl();
        String githubUrl = project.getGithubUrl();
        String downloadUrl = project.getDownloadUrl();
        String projectType = project.getProjectType();
        Integer status = project.getStatus();
        Integer isFeatured = project.getIsFeatured();
        Integer isOpenSource = project.getIsOpenSource();

        // 项目名称校验
        if (StringUtils.isBlank(name)) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR, "项目名称不能为空");
        }
        if (name.length() > 100) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR, "项目名称过长");
        }

        // 项目别名校验
        if (StringUtils.isBlank(slug)) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR, "项目别名不能为空");
        }
        if (slug.length() > 100) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR, "项目别名过长");
        }
        // 项目别名格式校验（只允许字母、数字、连字符）
        if (!slug.matches("^[a-zA-Z0-9-]+$")) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR, "项目别名只能包含字母、数字和连字符");
        }

        // 项目描述校验
        if (StringUtils.isNotBlank(description) && description.length() > 500) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR, "项目描述过长");
        }

        // 项目详细介绍校验
        if (StringUtils.isNotBlank(content) && content.length() > 50000) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR, "项目详细介绍过长");
        }

        // URL格式校验
        if (StringUtils.isNotBlank(coverImage) && !isValidUrl(coverImage)) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR, "封面图URL格式无效");
        }
        if (StringUtils.isNotBlank(demoUrl) && !isValidUrl(demoUrl)) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR, "演示地址URL格式无效");
        }
        if (StringUtils.isNotBlank(githubUrl) && !isValidUrl(githubUrl)) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR, "GitHub地址URL格式无效");
        }
        if (StringUtils.isNotBlank(downloadUrl) && !isValidUrl(downloadUrl)) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR, "下载地址URL格式无效");
        }

        // 项目类型校验
        if (StringUtils.isNotBlank(projectType) && projectType.length() > 50) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR, "项目类型过长");
        }

        // 状态校验
        if (status != null && (status < 0 || status > 3)) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR, "项目状态无效");
        }

        // 精选状态校验
        if (isFeatured != null && isFeatured != 0 && isFeatured != 1) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR, "精选状态无效");
        }

        // 开源状态校验
        if (isOpenSource != null && isOpenSource != 0 && isOpenSource != 1) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR, "开源状态无效");
        }

        // 图片数量校验
        if (project.getImages() != null && project.getImages().size() > 20) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR, "项目截图数量不能超过20张");
        }

        // 技术栈数量校验
        if (project.getTechStack() != null && project.getTechStack().size() > 50) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR, "技术栈数量不能超过50个");
        }

        // 功能特性数量校验
        if (project.getFeatures() != null && project.getFeatures().size() > 100) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR, "功能特性数量不能超过100个");
        }
    }

    @Override
    public Boolean existsById(Long id) {
        if (id == null || id <= 0) {
            return false;
        }
        return this.getById(id) != null;
    }

    @Override
    public Boolean existsBySlug(String slug) {
        if (StringUtils.isBlank(slug)) {
            return false;
        }
        return projectMapper.existsBySlug(slug);
    }

    @Override
    public Boolean existsBySlugExcludeId(String slug, Long id) {
        if (StringUtils.isBlank(slug) || id == null) {
            return false;
        }
        return projectMapper.existsBySlugExcludeId(slug, id);
    }

    @Override
    public Long countUserProjects(Long authorId) {
        if (authorId == null || authorId <= 0) {
            return 0L;
        }
        return projectMapper.countByAuthorId(authorId);
    }

    @Override
    public Long countFeaturedProjects() {
        return projectMapper.countFeaturedProjects();
    }

    @Override
    public Long countOpenSourceProjects() {
        return projectMapper.countOpenSourceProjects();
    }

    /**
     * 校验URL格式
     *
     * @param url URL字符串
     * @return 是否有效
     */
    private boolean isValidUrl(String url) {
        if (StringUtils.isBlank(url)) {
            return false;
        }
        return url.matches("^https?://[^\\s/$.?#].[^\\s]*$");
    }
}