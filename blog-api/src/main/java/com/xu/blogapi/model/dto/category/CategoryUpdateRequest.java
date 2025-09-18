package com.xu.blogapi.model.dto.category;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import java.io.Serializable;

/**
 * 分类更新请求DTO
 */
@Data
@ApiModel(description = "分类更新请求")
public class CategoryUpdateRequest implements Serializable {

    /**
     * 分类ID
     */
    @ApiModelProperty(value = "分类ID", required = true, example = "1")
    @NotNull(message = "分类ID不能为空")
    private Long id;

    /**
     * 分类名称
     */
    @ApiModelProperty(value = "分类名称", example = "技术分享")
    @Size(max = 50, message = "分类名称长度不能超过50个字符")
    private String name;

    /**
     * 分类别名（URL友好）
     */
    @ApiModelProperty(value = "分类别名", example = "tech")
    @Size(max = 50, message = "分类别名长度不能超过50个字符")
    private String slug;

    /**
     * 分类描述
     */
    @ApiModelProperty(value = "分类描述", example = "技术相关的文章和教程")
    @Size(max = 500, message = "分类描述长度不能超过500个字符")
    private String description;

    /**
     * 分类图标
     */
    @ApiModelProperty(value = "分类图标", example = "code")
    @Size(max = 100, message = "分类图标长度不能超过100个字符")
    private String icon;

    /**
     * 分类颜色
     */
    @ApiModelProperty(value = "分类颜色", example = "#3b82f6")
    @Size(max = 20, message = "分类颜色长度不能超过20个字符")
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

    private static final long serialVersionUID = 1L;
}