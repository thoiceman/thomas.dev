package com.xu.blogapi.model.dto.article;

import lombok.Data;

import javax.validation.constraints.NotNull;
import java.io.Serializable;
import java.time.LocalDateTime;

/**
 * 文章更新请求DTO
 *
 * @author xu
 */
@Data
public class ArticleUpdateRequest implements Serializable {

    /**
     * 文章ID
     */
    @NotNull(message = "文章ID不能为空")
    private Long id;

    /**
     * 文章标题
     */
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
     * 状态：0-草稿，1-已发布，2-已下线
     */
    private Integer status;

    /**
     * 是否置顶：0-否，1-是
     */
    private Integer isTop;

    /**
     * 是否精选：0-否，1-是
     */
    private Integer isFeatured;

    /**
     * 发布时间
     */
    private LocalDateTime publishTime;

    private static final long serialVersionUID = 1L;
}