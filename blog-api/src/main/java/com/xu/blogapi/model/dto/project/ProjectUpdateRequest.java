package com.xu.blogapi.model.dto.project;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import java.io.Serializable;
import java.time.LocalDate;
import java.util.List;

/**
 * 项目更新请求DTO
 *
 * @author xu
 */
@Data
@ApiModel(description = "项目更新请求")
public class ProjectUpdateRequest implements Serializable {

    /**
     * 项目ID
     */
    @ApiModelProperty(value = "项目ID", required = true, example = "1")
    @NotNull(message = "项目ID不能为空")
    private Long id;

    /**
     * 项目名称
     */
    @ApiModelProperty(value = "项目名称", example = "博客系统")
    @Size(max = 100, message = "项目名称长度不能超过100个字符")
    private String name;

    /**
     * 项目别名（URL友好）
     */
    @ApiModelProperty(value = "项目别名", example = "blog-system")
    @Size(max = 100, message = "项目别名长度不能超过100个字符")
    private String slug;

    /**
     * 项目描述
     */
    @ApiModelProperty(value = "项目描述", example = "一个功能完整的博客系统")
    private String description;

    /**
     * 项目详细介绍
     */
    @ApiModelProperty(value = "项目详细介绍", example = "这是一个基于Spring Boot开发的博客系统...")
    private String content;

    /**
     * 项目封面图
     */
    @ApiModelProperty(value = "项目封面图", example = "https://example.com/cover.jpg")
    @Size(max = 500, message = "封面图URL长度不能超过500个字符")
    private String coverImage;

    /**
     * 项目截图列表
     */
    @ApiModelProperty(value = "项目截图列表", example = "[\"https://example.com/screenshot1.jpg\", \"https://example.com/screenshot2.jpg\"]")
    private List<String> images;

    /**
     * 演示地址
     */
    @ApiModelProperty(value = "演示地址", example = "https://demo.example.com")
    @Size(max = 200, message = "演示地址长度不能超过200个字符")
    private String demoUrl;

    /**
     * GitHub地址
     */
    @ApiModelProperty(value = "GitHub地址", example = "https://github.com/username/project")
    @Size(max = 200, message = "GitHub地址长度不能超过200个字符")
    private String githubUrl;

    /**
     * 下载地址
     */
    @ApiModelProperty(value = "下载地址", example = "https://releases.example.com/v1.0.0")
    @Size(max = 200, message = "下载地址长度不能超过200个字符")
    private String downloadUrl;

    /**
     * 技术栈
     */
    @ApiModelProperty(value = "技术栈", example = "[\"Spring Boot\", \"Vue.js\", \"MySQL\"]")
    private List<String> techStack;

    /**
     * 主要功能
     */
    @ApiModelProperty(value = "主要功能", example = "[\"用户管理\", \"文章发布\", \"评论系统\"]")
    private List<String> features;

    /**
     * 项目类型
     */
    @ApiModelProperty(value = "项目类型", example = "Web应用")
    @Size(max = 50, message = "项目类型长度不能超过50个字符")
    private String projectType;

    /**
     * 项目状态：0-停止维护，1-正在开发，2-已完成，3-暂停
     */
    @ApiModelProperty(value = "项目状态", example = "1", notes = "0-停止维护，1-正在开发，2-已完成，3-暂停")
    private Integer status;

    /**
     * 是否精选：0-否，1-是
     */
    @ApiModelProperty(value = "是否精选", example = "0", notes = "0-否，1-是")
    private Integer isFeatured;

    /**
     * 是否开源：0-否，1-是
     */
    @ApiModelProperty(value = "是否开源", example = "1", notes = "0-否，1-是")
    private Integer isOpenSource;

    /**
     * 开始日期
     */
    @ApiModelProperty(value = "开始日期", example = "2024-01-01")
    private LocalDate startDate;

    /**
     * 完成日期
     */
    @ApiModelProperty(value = "完成日期", example = "2024-12-31")
    private LocalDate endDate;

    /**
     * 排序权重
     */
    @ApiModelProperty(value = "排序权重", example = "0")
    private Integer sortOrder;

    private static final long serialVersionUID = 1L;
}