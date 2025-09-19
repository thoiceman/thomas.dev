package com.xu.blogapi.controller;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.xu.blogapi.common.BaseResponse;
import com.xu.blogapi.common.DeleteRequest;
import com.xu.blogapi.common.ErrorCode;
import com.xu.blogapi.common.ResultUtils;
import com.xu.blogapi.exception.BusinessException;
import com.xu.blogapi.model.dto.project.ProjectAddRequest;
import com.xu.blogapi.model.dto.project.ProjectQueryRequest;
import com.xu.blogapi.model.dto.project.ProjectResponse;
import com.xu.blogapi.model.dto.project.ProjectUpdateRequest;
import com.xu.blogapi.model.entity.Project;
import com.xu.blogapi.model.entity.User;
import com.xu.blogapi.service.ProjectService;
import com.xu.blogapi.service.UserService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.BeanUtils;
import org.springframework.web.bind.annotation.*;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.validation.Valid;
import java.util.List;
import java.util.stream.Collectors;

/**
 * 项目控制器
 *
 * @author xu
 */
@RestController
@RequestMapping("/project")
@Slf4j
@Api(tags = "项目管理")
public class ProjectController {

    @Resource
    private ProjectService projectService;

    @Resource
    private UserService userService;

    /**
     * 创建项目
     *
     * @param projectAddRequest 项目创建请求
     * @param request           HTTP请求
     * @return 项目ID
     */
    @PostMapping("/add")
    @ApiOperation(value = "创建项目")
    public BaseResponse<Long> addProject(@RequestBody @Valid ProjectAddRequest projectAddRequest,
                                         HttpServletRequest request) {
        if (projectAddRequest == null) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR);
        }
        User loginUser = userService.getLoginUser();
        Long projectId = projectService.addProject(projectAddRequest, loginUser);
        return ResultUtils.success(projectId);
    }

    /**
     * 删除项目
     *
     * @param deleteRequest 删除请求
     * @param request       HTTP请求
     * @return 是否成功
     */
    @PostMapping("/delete")
    @ApiOperation(value = "删除项目")
    public BaseResponse<Boolean> deleteProject(@RequestBody DeleteRequest deleteRequest,
                                               HttpServletRequest request) {
        if (deleteRequest == null || deleteRequest.getId() <= 0) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR);
        }
        User loginUser = userService.getLoginUser();
        Boolean result = projectService.deleteProject(deleteRequest.getId(), loginUser);
        return ResultUtils.success(result);
    }

    /**
     * 更新项目
     *
     * @param projectUpdateRequest 项目更新请求
     * @param request              HTTP请求
     * @return 是否成功
     */
    @PostMapping("/update")
    @ApiOperation(value = "更新项目")
    public BaseResponse<Boolean> updateProject(@RequestBody @Valid ProjectUpdateRequest projectUpdateRequest,
                                               HttpServletRequest request) {
        if (projectUpdateRequest == null || projectUpdateRequest.getId() <= 0) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR);
        }
        User loginUser = userService.getLoginUser();
        Boolean result = projectService.updateProject(projectUpdateRequest, loginUser);
        return ResultUtils.success(result);
    }

    /**
     * 根据ID获取项目
     *
     * @param id      项目ID
     * @param request HTTP请求
     * @return 项目信息
     */
    @GetMapping("/get")
    @ApiOperation(value = "根据ID获取项目")
    public BaseResponse<ProjectResponse> getProjectById(@RequestParam("id") Long id,
                                                        HttpServletRequest request) {
        if (id <= 0) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR);
        }
        User loginUser = userService.getLoginUser();
        Project project = projectService.getProjectById(id, loginUser);
        ProjectResponse projectResponse = new ProjectResponse();
        BeanUtils.copyProperties(project, projectResponse);
        return ResultUtils.success(projectResponse);
    }

    /**
     * 根据别名获取项目
     *
     * @param slug    项目别名
     * @param request HTTP请求
     * @return 项目信息
     */
    @GetMapping("/get/slug")
    @ApiOperation(value = "根据别名获取项目")
    public BaseResponse<ProjectResponse> getProjectBySlug(@RequestParam("slug") String slug,
                                                          HttpServletRequest request) {
        if (slug == null || slug.trim().isEmpty()) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR);
        }
        User loginUser = userService.getLoginUser();
        Project project = projectService.getProjectBySlug(slug, loginUser);
        ProjectResponse projectResponse = new ProjectResponse();
        BeanUtils.copyProperties(project, projectResponse);
        return ResultUtils.success(projectResponse);
    }

    /**
     * 分页获取项目列表
     *
     * @param projectQueryRequest 查询请求
     * @param request             HTTP请求
     * @return 分页结果
     */
    @PostMapping("/list/page")
    @ApiOperation(value = "分页获取项目列表")
    public BaseResponse<Page<ProjectResponse>> listProjectsByPage(@RequestBody ProjectQueryRequest projectQueryRequest,
                                                                  HttpServletRequest request) {
        if (projectQueryRequest == null) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR);
        }
        User loginUser = userService.getLoginUser();
        Page<Project> projectPage = projectService.listProjectsByPage(projectQueryRequest, loginUser);
        
        // 转换为响应对象
        Page<ProjectResponse> projectResponsePage = new Page<>(
                projectPage.getCurrent(),
                projectPage.getSize(),
                projectPage.getTotal()
        );
        List<ProjectResponse> projectResponseList = projectPage.getRecords().stream()
                .map(project -> {
                    ProjectResponse projectResponse = new ProjectResponse();
                    BeanUtils.copyProperties(project, projectResponse);
                    return projectResponse;
                })
                .collect(Collectors.toList());
        projectResponsePage.setRecords(projectResponseList);
        
        return ResultUtils.success(projectResponsePage);
    }

    /**
     * 获取精选项目列表
     *
     * @param request HTTP请求
     * @return 精选项目列表
     */
    @GetMapping("/list/featured")
    @ApiOperation(value = "获取精选项目列表")
    public BaseResponse<List<ProjectResponse>> listFeaturedProjects(HttpServletRequest request) {
        User loginUser = userService.getLoginUser();
        List<Project> projectList = projectService.listFeaturedProjects(loginUser);
        List<ProjectResponse> projectResponseList = projectList.stream()
                .map(project -> {
                    ProjectResponse projectResponse = new ProjectResponse();
                    BeanUtils.copyProperties(project, projectResponse);
                    return projectResponse;
                })
                .collect(Collectors.toList());
        return ResultUtils.success(projectResponseList);
    }

    /**
     * 获取开源项目列表
     *
     * @param request HTTP请求
     * @return 开源项目列表
     */
    @GetMapping("/list/opensource")
    @ApiOperation(value = "获取开源项目列表")
    public BaseResponse<List<ProjectResponse>> listOpenSourceProjects(HttpServletRequest request) {
        User loginUser = userService.getLoginUser();
        List<Project> projectList = projectService.listOpenSourceProjects(loginUser);
        List<ProjectResponse> projectResponseList = projectList.stream()
                .map(project -> {
                    ProjectResponse projectResponse = new ProjectResponse();
                    BeanUtils.copyProperties(project, projectResponse);
                    return projectResponse;
                })
                .collect(Collectors.toList());
        return ResultUtils.success(projectResponseList);
    }

    /**
     * 根据作者ID获取项目列表
     *
     * @param authorId 作者ID
     * @param request  HTTP请求
     * @return 项目列表
     */
    @GetMapping("/list/author")
    @ApiOperation(value = "根据作者ID获取项目列表")
    public BaseResponse<List<ProjectResponse>> listProjectsByAuthor(@RequestParam("authorId") Long authorId,
                                                                    HttpServletRequest request) {
        if (authorId <= 0) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR);
        }
        User loginUser = userService.getLoginUser();
        List<Project> projectList = projectService.listProjectsByAuthor(authorId, loginUser);
        List<ProjectResponse> projectResponseList = projectList.stream()
                .map(project -> {
                    ProjectResponse projectResponse = new ProjectResponse();
                    BeanUtils.copyProperties(project, projectResponse);
                    return projectResponse;
                })
                .collect(Collectors.toList());
        return ResultUtils.success(projectResponseList);
    }

    /**
     * 根据项目类型获取项目列表
     *
     * @param projectType 项目类型
     * @param request     HTTP请求
     * @return 项目列表
     */
    @GetMapping("/list/type")
    @ApiOperation(value = "根据项目类型获取项目列表")
    public BaseResponse<List<ProjectResponse>> listProjectsByType(@RequestParam("projectType") String projectType,
                                                                  HttpServletRequest request) {
        if (projectType == null || projectType.trim().isEmpty()) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR);
        }
        User loginUser = userService.getLoginUser();
        List<Project> projectList = projectService.listProjectsByType(projectType, loginUser);
        List<ProjectResponse> projectResponseList = projectList.stream()
                .map(project -> {
                    ProjectResponse projectResponse = new ProjectResponse();
                    BeanUtils.copyProperties(project, projectResponse);
                    return projectResponse;
                })
                .collect(Collectors.toList());
        return ResultUtils.success(projectResponseList);
    }

    /**
     * 统计用户项目数量
     *
     * @param authorId 作者ID
     * @param request  HTTP请求
     * @return 项目数量
     */
    @GetMapping("/count/author")
    @ApiOperation(value = "统计用户项目数量")
    public BaseResponse<Long> countUserProjects(@RequestParam("authorId") Long authorId,
                                                HttpServletRequest request) {
        if (authorId <= 0) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR);
        }
        Long count = projectService.countUserProjects(authorId);
        return ResultUtils.success(count);
    }

    /**
     * 统计精选项目数量
     *
     * @param request HTTP请求
     * @return 精选项目数量
     */
    @GetMapping("/count/featured")
    @ApiOperation(value = "统计精选项目数量")
    public BaseResponse<Long> countFeaturedProjects(HttpServletRequest request) {
        Long count = projectService.countFeaturedProjects();
        return ResultUtils.success(count);
    }

    /**
     * 统计开源项目数量
     *
     * @param request HTTP请求
     * @return 开源项目数量
     */
    @GetMapping("/count/opensource")
    @ApiOperation(value = "统计开源项目数量")
    public BaseResponse<Long> countOpenSourceProjects(HttpServletRequest request) {
        Long count = projectService.countOpenSourceProjects();
        return ResultUtils.success(count);
    }
}