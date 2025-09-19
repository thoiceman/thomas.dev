package com.xu.blogapi.model.dto.thought;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import javax.validation.constraints.Max;
import javax.validation.constraints.Min;
import java.io.Serializable;

/**
 * 想法查询请求DTO
 *
 * @author xu
 */
@Data
@ApiModel(description = "想法查询请求")
public class ThoughtQueryRequest implements Serializable {

    /**
     * 想法内容（模糊搜索）
     */
    @ApiModelProperty(value = "想法内容", example = "天气")
    private String content;

    /**
     * 心情状态（精确匹配）
     */
    @ApiModelProperty(value = "心情状态", example = "开心")
    private String mood;

    /**
     * 地理位置（模糊搜索）
     */
    @ApiModelProperty(value = "地理位置", example = "北京")
    private String location;

    /**
     * 天气情况（精确匹配）
     */
    @ApiModelProperty(value = "天气情况", example = "晴天")
    private String weather;

    /**
     * 作者ID（精确匹配）
     */
    @ApiModelProperty(value = "作者ID", example = "1")
    private Long authorId;

    /**
     * 状态（精确匹配）
     */
    @ApiModelProperty(value = "状态", example = "1", notes = "0-私密，1-公开")
    private Integer status;

    /**
     * 搜索关键词（模糊搜索内容）
     */
    @ApiModelProperty(value = "搜索关键词", example = "心情")
    private String searchText;

    /**
     * 排序字段
     */
    @ApiModelProperty(value = "排序字段", example = "create_time")
    private String sortField = "create_time";

    /**
     * 排序顺序
     */
    @ApiModelProperty(value = "排序顺序", example = "desc")
    private String sortOrder = "desc";

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