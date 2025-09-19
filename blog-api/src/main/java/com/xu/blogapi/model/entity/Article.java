package com.xu.blogapi.model.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;

import java.io.Serializable;
import java.time.LocalDateTime;

/**
 * 文章实体类
 * 对应数据库表：article
 *
 * @author xu
 */
@TableName(value = "article")
@Data
public class Article implements Serializable {

    /**
     * 文章ID
     */
    @TableId(value = "id", type = IdType.AUTO)
    private Long id;

    /**
     * 文章标题
     */
    @TableField(value = "title")
    private String title;

    /**
     * 文章别名（URL友好）
     */
    @TableField(value = "slug")
    private String slug;

    /**
     * 文章摘要
     */
    @TableField(value = "summary")
    private String summary;

    /**
     * 文章内容（Markdown格式）
     */
    @TableField(value = "content")
    private String content;

    /**
     * 封面图片URL
     */
    @TableField(value = "cover_image")
    private String coverImage;

    /**
     * 分类ID
     */
    @TableField(value = "category_id")
    private Long categoryId;

    /**
     * 作者ID
     */
    @TableField(value = "author_id")
    private Long authorId;

    /**
     * 状态：0-草稿，1-已发布，2-已下线
     */
    @TableField(value = "status")
    private Integer status;

    /**
     * 是否置顶：0-否，1-是
     */
    @TableField(value = "is_top")
    private Integer isTop;

    /**
     * 是否精选：0-否，1-是
     */
    @TableField(value = "is_featured")
    private Integer isFeatured;

    /**
     * 字数统计
     */
    @TableField(value = "word_count")
    private Integer wordCount;

    /**
     * 预计阅读时间（分钟）
     */
    @TableField(value = "reading_time")
    private Integer readingTime;

    /**
     * 发布时间
     */
    @TableField(value = "publish_time")
    private LocalDateTime publishTime;

    /**
     * 创建时间
     */
    @TableField(value = "create_time", fill = FieldFill.INSERT)
    private LocalDateTime createTime;

    /**
     * 更新时间
     */
    @TableField(value = "update_time", fill = FieldFill.INSERT_UPDATE)
    private LocalDateTime updateTime;

    /**
     * 是否删除：0-未删除，1-已删除
     */
    @TableLogic
    @TableField(value = "is_delete")
    private Integer isDelete;

    @TableField(exist = false)
    private static final long serialVersionUID = 1L;
}