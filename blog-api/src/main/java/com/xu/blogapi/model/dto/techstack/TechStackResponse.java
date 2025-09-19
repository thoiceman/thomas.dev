package com.xu.blogapi.model.dto.techstack;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import java.io.Serializable;
import java.time.LocalDateTime;

/**
 * 技术栈响应DTO
 *
 * @author xu
 */
@Data
@ApiModel(description = "技术栈响应")
public class TechStackResponse implements Serializable {

    /**
     * 技术栈ID
     */
    @ApiModelProperty(value = "技术栈ID", example = "1")
    private Long id;

    /**
     * 技术名称
     */
    @ApiModelProperty(value = "技术名称", example = "Spring Boot")
    private String name;

    /**
     * 技术分类
     */
    @ApiModelProperty(value = "技术分类", example = "后端")
    private String category;

    /**
     * 技术描述
     */
    @ApiModelProperty(value = "技术描述", example = "Java企业级应用开发框架")
    private String description;

    /**
     * 技术图标URL
     */
    @ApiModelProperty(value = "技术图标URL", example = "https://example.com/spring-boot-icon.png")
    private String icon;

    /**
     * 官方网站
     */
    @ApiModelProperty(value = "官方网站", example = "https://spring.io/projects/spring-boot")
    private String officialUrl;

    /**
     * 排序权重
     */
    @ApiModelProperty(value = "排序权重", example = "1")
    private Integer sortOrder;

    /**
     * 状态：0-不展示，1-展示
     */
    @ApiModelProperty(value = "状态", example = "1")
    private Integer status;

    /**
     * 创建时间
     */
    @ApiModelProperty(value = "创建时间", example = "2024-01-01T00:00:00")
    private LocalDateTime createTime;

    /**
     * 更新时间
     */
    @ApiModelProperty(value = "更新时间", example = "2024-01-01T00:00:00")
    private LocalDateTime updateTime;

    private static final long serialVersionUID = 1L;
}