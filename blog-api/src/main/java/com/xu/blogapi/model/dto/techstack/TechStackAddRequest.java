package com.xu.blogapi.model.dto.techstack;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Pattern;
import javax.validation.constraints.Size;
import javax.validation.constraints.Min;
import java.io.Serializable;

/**
 * 技术栈添加请求DTO
 *
 * @author xu
 */
@Data
@ApiModel(description = "技术栈添加请求")
public class TechStackAddRequest implements Serializable {

    /**
     * 技术名称
     */
    @ApiModelProperty(value = "技术名称", required = true, example = "Spring Boot")
    @NotBlank(message = "技术名称不能为空")
    @Size(max = 100, message = "技术名称长度不能超过100个字符")
    private String name;

    /**
     * 技术分类
     */
    @ApiModelProperty(value = "技术分类", required = true, example = "后端")
    @NotBlank(message = "技术分类不能为空")
    @Size(max = 50, message = "技术分类长度不能超过50个字符")
    private String category;

    /**
     * 技术描述
     */
    @ApiModelProperty(value = "技术描述", example = "Java企业级应用开发框架")
    @Size(max = 1000, message = "技术描述长度不能超过1000个字符")
    private String description;

    /**
     * 技术图标URL
     */
    @ApiModelProperty(value = "技术图标URL", example = "https://example.com/spring-boot-icon.png")
    @Size(max = 200, message = "技术图标URL长度不能超过200个字符")
    @Pattern(regexp = "^(https?://)?[\\w\\-._~:/?#\\[\\]@!$&'()*+,;=]+$", message = "技术图标URL格式不正确")
    private String icon;

    /**
     * 官方网站
     */
    @ApiModelProperty(value = "官方网站", example = "https://spring.io/projects/spring-boot")
    @Size(max = 200, message = "官方网站URL长度不能超过200个字符")
    @Pattern(regexp = "^(https?://)?[\\w\\-._~:/?#\\[\\]@!$&'()*+,;=]+$", message = "官方网站URL格式不正确")
    private String officialUrl;

    /**
     * 排序权重
     */
    @ApiModelProperty(value = "排序权重", example = "1")
    @Min(value = 0, message = "排序权重不能小于0")
    private Integer sortOrder = 0;

    /**
     * 状态：0-不展示，1-展示
     */
    @ApiModelProperty(value = "状态", example = "1")
    private Integer status = 1;

    private static final long serialVersionUID = 1L;
}