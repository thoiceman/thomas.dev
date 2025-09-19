package com.xu.blogapi.model.dto.tag;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Pattern;
import javax.validation.constraints.Size;
import java.io.Serializable;

/**
 * 标签添加请求DTO
 *
 * @author xu
 */
@Data
@ApiModel(description = "标签添加请求")
public class TagAddRequest implements Serializable {

    /**
     * 标签名称
     */
    @ApiModelProperty(value = "标签名称", required = true, example = "Java")
    @NotBlank(message = "标签名称不能为空")
    @Size(max = 50, message = "标签名称长度不能超过50个字符")
    private String name;

    /**
     * 标签别名（URL友好）
     */
    @ApiModelProperty(value = "标签别名", required = true, example = "java")
    @NotBlank(message = "标签别名不能为空")
    @Size(max = 50, message = "标签别名长度不能超过50个字符")
    @Pattern(regexp = "^[a-zA-Z0-9_-]+$", message = "标签别名只能包含字母、数字、连字符和下划线")
    private String slug;

    /**
     * 标签颜色
     */
    @ApiModelProperty(value = "标签颜色", example = "#007bff")
    @Size(max = 20, message = "标签颜色长度不能超过20个字符")
    @Pattern(regexp = "^#[0-9a-fA-F]{6}$|^[a-zA-Z]+$", message = "标签颜色格式不正确")
    private String color;

    private static final long serialVersionUID = 1L;
}