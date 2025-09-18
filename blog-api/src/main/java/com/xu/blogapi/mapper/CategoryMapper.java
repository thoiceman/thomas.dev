package com.xu.blogapi.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.xu.blogapi.model.entity.Category;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

import java.util.List;

/**
 * 分类数据访问层
 */
public interface CategoryMapper extends BaseMapper<Category> {

    /**
     * 根据别名查询分类
     *
     * @param slug 分类别名
     * @return 分类信息
     */
    @Select("SELECT * FROM category WHERE slug = #{slug} AND is_delete = 0")
    Category selectBySlug(@Param("slug") String slug);

    /**
     * 查询所有启用的分类（按排序权重排序）
     *
     * @return 分类列表
     */
    @Select("SELECT * FROM category WHERE status = 1 AND is_delete = 0 ORDER BY sort_order ASC, create_time ASC")
    List<Category> selectEnabledCategories();

    /**
     * 统计分类下的文章数量
     *
     * @param categoryId 分类ID
     * @return 文章数量
     */
    @Select("SELECT COUNT(*) FROM article WHERE category_id = #{categoryId} AND is_delete = 0")
    Long countArticlesByCategory(@Param("categoryId") Long categoryId);

    /**
     * 批量统计多个分类下的文章数量
     *
     * @param categoryIds 分类ID列表
     * @return 分类ID和文章数量的映射
     */
    List<CategoryArticleCount> countArticlesByCategoryIds(@Param("categoryIds") List<Long> categoryIds);

    /**
     * 根据文章ID获取分类信息
     *
     * @param articleId 文章ID
     * @return 分类信息
     */
    Category selectCategoryByArticleId(@Param("articleId") Long articleId);

    /**
     * 批量更新文章的分类
     *
     * @param oldCategoryId 原分类ID
     * @param newCategoryId 新分类ID
     * @return 影响行数
     */
    int updateArticleCategory(@Param("oldCategoryId") Long oldCategoryId, @Param("newCategoryId") Long newCategoryId);

    /**
     * 清空指定分类下所有文章的分类关联
     *
     * @param categoryId 分类ID
     * @return 影响行数
     */
    int clearArticleCategoryRelation(@Param("categoryId") Long categoryId);

    /**
     * 获取分类下的文章ID列表
     *
     * @param categoryId 分类ID
     * @param status     文章状态（可选）
     * @param sortField  排序字段（可选）
     * @param sortOrder  排序方向（可选）
     * @param limit      限制数量（可选）
     * @return 文章ID列表
     */
    List<Long> selectArticlesByCategoryId(@Param("categoryId") Long categoryId,
                                          @Param("status") Integer status,
                                          @Param("sortField") String sortField,
                                          @Param("sortOrder") String sortOrder,
                                          @Param("limit") Integer limit);

    /**
     * 检查分类别名是否存在
     *
     * @param slug      分类别名
     * @param excludeId 排除的分类ID（可选）
     * @return 是否存在
     */
    Boolean existsBySlug(@Param("slug") String slug, @Param("excludeId") Long excludeId);

    /**
     * 检查分类名称是否存在
     *
     * @param name      分类名称
     * @param excludeId 排除的分类ID（可选）
     * @return 是否存在
     */
    Boolean existsByName(@Param("name") String name, @Param("excludeId") Long excludeId);

    /**
     * 获取最大排序权重
     *
     * @return 最大排序权重
     */
    Integer getMaxSortOrder();

    /**
     * 查询所有分类
     * @param status 状态筛选
     * @return 分类列表
     */
    List<Category> selectAllForTree(@Param("status") Integer status);

    /**
     * 分类文章数量统计结果类
     */
    class CategoryArticleCount {
        private Long categoryId;
        private Long articleCount;

        public Long getCategoryId() {
            return categoryId;
        }

        public void setCategoryId(Long categoryId) {
            this.categoryId = categoryId;
        }

        public Long getArticleCount() {
            return articleCount;
        }

        public void setArticleCount(Long articleCount) {
            this.articleCount = articleCount;
        }
    }
}