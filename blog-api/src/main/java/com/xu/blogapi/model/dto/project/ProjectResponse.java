package com.xu.blogapi.model.dto.project;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import java.io.Serializable;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

/**
 * 项目响应DTO
 *
 * @author xu
 */
@Data
@ApiModel(description = "项目响应")
public class ProjectResponse implements Serializable {

    /**
     * 项目ID
     */
    @ApiModelProperty(value = "项目ID", example = "1")
    private Long id;

    /**
     * 项目名称
     */
    @ApiModelProperty(value = "项目名称", example = "博客系统")
    private String name;

    /**
     * 项目别名（URL友好）
     */
    @ApiModelProperty(value = "项目别名", example = "blog-system")
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
    private String demoUrl;

    /**
     * GitHub地址
     */
    @ApiModelProperty(value = "GitHub地址", example = "https://github.com/username/project")
    private String githubUrl;

    /**
     * 下载地址
     */
    @ApiModelProperty(value = "下载地址", example = "https://releases.example.com/v1.0.0")
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

    /**
     * 作者ID
     */
    @ApiModelProperty(value = "作者ID", example = "1")
    private Long authorId;

    /**
     * 创建时间
     */
    @ApiModelProperty(value = "创建时间", example = "2024-01-01T10:00:00")
    private LocalDateTime createTime;

    /**
     * 更新时间
     */
    @ApiModelProperty(value = "更新时间", example = "2024-01-01T10:00:00")
    private LocalDateTime updateTime;

    private static final long serialVersionUID = 1L;
}