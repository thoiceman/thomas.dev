package com.xu.blogapi.model.dto.thought;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.List;

/**
 * 想法响应DTO
 *
 * @author xu
 */
@Data
@ApiModel(description = "想法响应")
public class ThoughtResponse implements Serializable {

    /**
     * 想法ID
     */
    @ApiModelProperty(value = "想法ID", example = "1")
    private Long id;

    /**
     * 想法内容
     */
    @ApiModelProperty(value = "想法内容", example = "今天天气真好，心情也很不错！")
    private String content;

    /**
     * 图片列表
     */
    @ApiModelProperty(value = "图片列表", example = "[\"https://example.com/image1.jpg\", \"https://example.com/image2.jpg\"]")
    private List<String> images;

    /**
     * 心情状态
     */
    @ApiModelProperty(value = "心情状态", example = "开心")
    private String mood;

    /**
     * 地理位置
     */
    @ApiModelProperty(value = "地理位置", example = "北京市朝阳区")
    private String location;

    /**
     * 天气情况
     */
    @ApiModelProperty(value = "天气情况", example = "晴天")
    private String weather;

    /**
     * 作者ID
     */
    @ApiModelProperty(value = "作者ID", example = "1")
    private Long authorId;

    /**
     * 状态：0-私密，1-公开
     */
    @ApiModelProperty(value = "状态", example = "1", notes = "0-私密，1-公开")
    private Integer status;

    /**
     * 创建时间
     */
    @ApiModelProperty(value = "创建时间", example = "2024-01-01 12:00:00")
    private LocalDateTime createTime;

    /**
     * 更新时间
     */
    @ApiModelProperty(value = "更新时间", example = "2024-01-01 12:00:00")
    private LocalDateTime updateTime;

    private static final long serialVersionUID = 1L;
}