package com.xu.blogapi.model.dto.thought;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import java.io.Serializable;
import java.util.List;

/**
 * 想法更新请求DTO
 *
 * @author xu
 */
@Data
@ApiModel(description = "想法更新请求")
public class ThoughtUpdateRequest implements Serializable {

    /**
     * 想法ID
     */
    @ApiModelProperty(value = "想法ID", required = true, example = "1")
    @NotNull(message = "想法ID不能为空")
    private Long id;

    /**
     * 想法内容
     */
    @ApiModelProperty(value = "想法内容", example = "今天天气真好，心情也很不错！")
    @Size(max = 5000, message = "想法内容长度不能超过5000个字符")
    private String content;

    /**
     * 图片列表
     */
    @ApiModelProperty(value = "图片列表", example = "[\"https://example.com/image1.jpg\", \"https://example.com/image2.jpg\"]")
    @Size(max = 9, message = "图片数量不能超过9张")
    private List<String> images;

    /**
     * 心情状态
     */
    @ApiModelProperty(value = "心情状态", example = "开心")
    @Size(max = 20, message = "心情状态长度不能超过20个字符")
    private String mood;

    /**
     * 地理位置
     */
    @ApiModelProperty(value = "地理位置", example = "北京市朝阳区")
    @Size(max = 100, message = "地理位置长度不能超过100个字符")
    private String location;

    /**
     * 天气情况
     */
    @ApiModelProperty(value = "天气情况", example = "晴天")
    @Size(max = 50, message = "天气情况长度不能超过50个字符")
    private String weather;

    /**
     * 状态：0-私密，1-公开
     */
    @ApiModelProperty(value = "状态", example = "1", notes = "0-私密，1-公开")
    private Integer status;

    private static final long serialVersionUID = 1L;
}