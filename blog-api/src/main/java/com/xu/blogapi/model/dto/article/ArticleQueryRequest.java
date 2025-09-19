package com.xu.blogapi.model.dto.article;

import com.xu.blogapi.common.PageRequest;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.io.Serializable;

/**
 * 文章查询请求DTO
 *
 * @author xu
 */
@EqualsAndHashCode(callSuper = true)
@Data
public class ArticleQueryRequest extends PageRequest implements Serializable {

    /**
     * 文章标题（模糊查询）
     */
    private String title;

    /**
     * 文章别名
     */
    private String slug;

    /**
     * 分类ID
     */
    private Long categoryId;

    /**
     * 作者ID
     */
    private Long authorId;

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
     * 排序字段（publish_time, create_time, update_time等）
     */
    private String sortField = "publish_time";

    /**
     * 排序方向（asc, desc）
     */
    private String sortOrder = "desc";

    private static final long serialVersionUID = 1L;
}