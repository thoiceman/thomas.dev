package com.xu.blogapi.model.dto.techstack;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import javax.validation.constraints.Min;
import javax.validation.constraints.Max;
import java.io.Serializable;

/**
 * 技术栈查询请求DTO
 *
 * @author xu
 */
@Data
@ApiModel(description = "技术栈查询请求")
public class TechStackQueryRequest implements Serializable {

    /**
     * 技术名称（模糊搜索）
     */
    @ApiModelProperty(value = "技术名称", example = "Spring")
    private String name;

    /**
     * 技术分类（精确匹配）
     */
    @ApiModelProperty(value = "技术分类", example = "后端")
    private String category;

    /**
     * 状态（精确匹配）
     */
    @ApiModelProperty(value = "状态", example = "1")
    private Integer status;

    /**
     * 搜索关键词（模糊搜索名称和描述）
     */
    @ApiModelProperty(value = "搜索关键词", example = "Java")
    private String searchText;

    /**
     * 排序字段
     */
    @ApiModelProperty(value = "排序字段", example = "sortOrder")
    private String sortField = "sortOrder";

    /**
     * 排序顺序
     */
    @ApiModelProperty(value = "排序顺序", example = "asc")
    private String sortOrder = "asc";

    /**
     * 当前页码
     */
    @ApiModelProperty(value = "当前页码", example = "1")
    @Min(value = 1, message = "页码必须大于0")
    private Integer current = 1;

    /**
     * 每页大小
     */
    @ApiModelProperty(value = "每页大小", example = "10")
    @Min(value = 1, message = "每页大小必须大于0")
    @Max(value = 100, message = "每页大小不能超过100")
    private Integer pageSize = 10;

    private static final long serialVersionUID = 1L;
}