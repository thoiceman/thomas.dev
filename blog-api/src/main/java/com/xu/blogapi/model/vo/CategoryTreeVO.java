package com.xu.blogapi.model.vo;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.List;

/**
 * 分类树形结构视图对象
 *
 * @author xu
 */
@Data
@Schema(description = "分类树形结构视图对象")
public class CategoryTreeVO implements Serializable {

    private static final long serialVersionUID = 1L;

    @Schema(description = "分类ID")
    private Long id;

    @Schema(description = "分类名称")
    private String name;

    @Schema(description = "分类别名")
    private String slug;

    @Schema(description = "分类描述")
    private String description;

    @Schema(description = "父级分类ID")
    private Long parentId;

    @Schema(description = "排序权重")
    private Integer sortOrder;

    @Schema(description = "状态(0-禁用 1-启用)")
    private Integer status;

    @Schema(description = "文章数量")
    private Long articleCount;

    @Schema(description = "创建时间")
    private LocalDateTime createTime;

    @Schema(description = "更新时间")
    private LocalDateTime updateTime;

    @Schema(description = "子分类列表")
    private List<CategoryTreeVO> children;

    @Schema(description = "层级深度")
    private Integer level;

    @Schema(description = "是否为叶子节点")
    private Boolean isLeaf;

    @Schema(description = "完整路径")
    private String fullPath;
}