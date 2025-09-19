package com.xu.blogapi.model.vo;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import java.io.Serializable;
import java.time.LocalDateTime;

/**
 * 标签视图对象VO
 *
 * @author xu
 */
@Data
@ApiModel(description = "标签视图对象")
public class TagVO implements Serializable {

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
     * 标签颜色
     */
    @ApiModelProperty(value = "标签颜色", example = "#007bff")
    private String color;

    /**
     * 使用次数
     */
    @ApiModelProperty(value = "使用次数", example = "10")
    private Integer useCount;

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

    private static final long serialVersionUID = 1L;
}