package com.xu.blogapi.model.dto.category;

import com.xu.blogapi.common.PageRequest;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.io.Serializable;

/**
 * 分类查询请求DTO
 */
@EqualsAndHashCode(callSuper = true)
@Data
@ApiModel(description = "分类查询请求")
public class CategoryQueryRequest extends PageRequest implements Serializable {

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
     * 状态：0-禁用，1-启用
     */
    @ApiModelProperty(value = "状态", example = "1")
    private Integer status;

    /**
     * 搜索关键词（用于模糊搜索名称和描述）
     */
    @ApiModelProperty(value = "搜索关键词", example = "技术")
    private String searchText;

    /**
     * 排序字段
     */
    @ApiModelProperty(value = "排序字段", example = "sort_order")
    private String sortField;

    /**
     * 排序顺序
     */
    @ApiModelProperty(value = "排序顺序", example = "asc")
    private String sortOrder;

    private static final long serialVersionUID = 1L;
}