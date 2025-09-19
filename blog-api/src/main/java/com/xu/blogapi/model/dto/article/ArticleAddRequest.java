package com.xu.blogapi.model.dto.article;

import lombok.Data;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import java.io.Serializable;
import java.time.LocalDateTime;

/**
 * 文章添加请求DTO
 *
 * @author xu
 */
@Data
public class ArticleAddRequest implements Serializable {

    /**
     * 文章标题
     */
    @NotBlank(message = "文章标题不能为空")
    private String title;

    /**
     * 文章别名（URL友好）
     */
    private String slug;

    /**
     * 文章摘要
     */
    private String summary;

    /**
     * 文章内容（Markdown格式）
     */
    @NotBlank(message = "文章内容不能为空")
    private String content;

    /**
     * 封面图片URL
     */
    private String coverImage;

    /**
     * 分类ID
     */
    private Long categoryId;

    /**
     * 作者ID
     */
    @NotNull(message = "作者ID不能为空")
    private Long authorId;

    /**
     * 状态：0-草稿，1-已发布，2-已下线
     */
    private Integer status = 0;

    /**
     * 是否置顶：0-否，1-是
     */
    private Integer isTop = 0;

    /**
     * 是否精选：0-否，1-是
     */
    private Integer isFeatured = 0;

    /**
     * 发布时间（如果状态为已发布且未指定发布时间，则使用当前时间）
     */
    private LocalDateTime publishTime;

    private static final long serialVersionUID = 1L;
}