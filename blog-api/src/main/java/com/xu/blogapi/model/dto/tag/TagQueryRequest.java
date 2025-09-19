package com.xu.blogapi.model.dto.tag;

import com.xu.blogapi.common.PageRequest;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.io.Serializable;

/**
 * 标签查询请求DTO
 *
 * @author xu
 */
@EqualsAndHashCode(callSuper = true)
@Data
@ApiModel(description = "标签查询请求")
public class TagQueryRequest extends PageRequest implements Serializable {

    /**
     * 标签ID
     */
    @ApiModelProperty(value = "标签ID", example = "1")
    private Long id;

    /**
     * 标签名称
     */
    @ApiModelProperty(value = "标签名称", example = "Java")
    private String name;

    /**
     * 标签别名（URL友好）
     */
    @ApiModelProperty(value = "标签别名", example = "java")
    private String slug;

    /**
     * 搜索关键词（用于模糊搜索名称）
     */
    @ApiModelProperty(value = "搜索关键词", example = "Java")
    private String searchText;

    /**
     * 排序字段
     */
    @ApiModelProperty(value = "排序字段", example = "use_count")
    private String sortField;

    /**
     * 排序顺序
     */
    @ApiModelProperty(value = "排序顺序", example = "desc")
    private String sortOrder;

    /**
     * 是否只查询热门标签
     */
    @ApiModelProperty(value = "是否只查询热门标签", example = "false")
    private Boolean onlyPopular;

    /**
     * 最小使用次数
     */
    @ApiModelProperty(value = "最小使用次数", example = "1")
    private Integer minUseCount;

    private static final long serialVersionUID = 1L;
}