package com.xu.blogapi.model.dto.project;

import com.xu.blogapi.common.PageRequest;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.io.Serializable;

/**
 * 项目查询请求DTO
 *
 * @author xu
 */
@Data
@EqualsAndHashCode(callSuper = true)
@ApiModel(description = "项目查询请求")
public class ProjectQueryRequest extends PageRequest implements Serializable {

    /**
     * 项目名称（模糊查询）
     */
    @ApiModelProperty(value = "项目名称", example = "博客")
    private String name;

    /**
     * 项目别名
     */
    @ApiModelProperty(value = "项目别名", example = "blog-system")
    private String slug;

    /**
     * 项目描述（模糊查询）
     */
    @ApiModelProperty(value = "项目描述", example = "博客系统")
    private String description;

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
    @ApiModelProperty(value = "是否精选", example = "1", notes = "0-否，1-是")
    private Integer isFeatured;

    /**
     * 是否开源：0-否，1-是
     */
    @ApiModelProperty(value = "是否开源", example = "1", notes = "0-否，1-是")
    private Integer isOpenSource;

    /**
     * 作者ID
     */
    @ApiModelProperty(value = "作者ID", example = "1")
    private Long authorId;

    /**
     * 技术栈（模糊查询）
     */
    @ApiModelProperty(value = "技术栈", example = "Spring Boot")
    private String techStack;

    /**
     * 排序字段
     */
    @ApiModelProperty(value = "排序字段", example = "createTime", notes = "可选值：createTime, updateTime, sortOrder")
    private String sortField;

    /**
     * 排序方向
     */
    @ApiModelProperty(value = "排序方向", example = "desc", notes = "可选值：asc, desc")
    private String sortOrder;

    private static final long serialVersionUID = 1L;
}