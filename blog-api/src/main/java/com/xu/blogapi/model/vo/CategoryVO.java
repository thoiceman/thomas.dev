package com.xu.blogapi.model.vo;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.List;

/**
 * 分类视图对象VO
 */
@Data
@ApiModel(description = "分类视图对象")
public class CategoryVO implements Serializable {

    /**
     * 分类ID
     */
    @ApiModelProperty(value = "分类ID", example = "1")
    private Long id;

    /**
     * 分类名称
     */
    @ApiModelProperty(value = "分类名称", example = "技术分享")
    private String name;

    /**
     * 分类别名（URL友好）
     */
    @ApiModelProperty(value = "分类别名", example = "tech")
    private String slug;

    /**
     * 分类描述
     */
    @ApiModelProperty(value = "分类描述", example = "技术相关的文章和教程")
    private String description;

    /**
     * 分类图标
     */
    @ApiModelProperty(value = "分类图标", example = "code")
    private String icon;

    /**
     * 分类颜色
     */
    @ApiModelProperty(value = "分类颜色", example = "#3b82f6")
    private String color;

    /**
     * 排序权重
     */
    @ApiModelProperty(value = "排序权重", example = "1")
    private Integer sortOrder;

    /**
     * 状态：0-禁用，1-启用
     */
    @ApiModelProperty(value = "状态", example = "1")
    private Integer status;

    /**
     * 文章数量
     */
    @ApiModelProperty(value = "文章数量", example = "10")
    private Long articleCount;

    /**
     * 创建时间
     */
    @ApiModelProperty(value = "创建时间")
    private LocalDateTime createTime;

    /**
     * 更新时间
     */
    @ApiModelProperty(value = "更新时间")
    private LocalDateTime updateTime;

    /**
     * 子分类列表（用于树形结构展示）
     */
    @ApiModelProperty(value = "子分类列表")
    private List<CategoryVO> children;

    private static final long serialVersionUID = 1L;
}