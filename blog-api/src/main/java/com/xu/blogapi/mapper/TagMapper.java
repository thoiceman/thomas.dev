package com.xu.blogapi.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.xu.blogapi.model.entity.Tag;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

import java.util.List;

/**
 * 标签数据访问层
 *
 * @author xu
 */
public interface TagMapper extends BaseMapper<Tag> {

    /**
     * 根据标签别名查询标签
     *
     * @param slug 标签别名
     * @return 标签信息
     */
    @Select("SELECT * FROM tag WHERE slug = #{slug} AND is_delete = 0")
    Tag selectBySlug(@Param("slug") String slug);

    /**
     * 查询热门标签（按使用次数排序）
     *
     * @param limit 限制数量
     * @return 标签列表
     */
    @Select("SELECT * FROM tag WHERE is_delete = 0 ORDER BY use_count DESC, create_time DESC LIMIT #{limit}")
    List<Tag> selectPopularTags(@Param("limit") Integer limit);

    /**
     * 根据条件查询标签列表（支持模糊搜索和分页）
     *
     * @param name       标签名称（模糊搜索）
     * @param slug       标签别名（精确匹配）
     * @param searchText 搜索关键词（模糊搜索名称）
     * @param sortField  排序字段
     * @param sortOrder  排序顺序
     * @return 标签列表
     */
    List<Tag> selectTagsByCondition(@Param("name") String name,
                                   @Param("slug") String slug,
                                   @Param("searchText") String searchText,
                                   @Param("sortField") String sortField,
                                   @Param("sortOrder") String sortOrder);

    /**
     * 检查标签别名是否存在
     *
     * @param slug      标签别名
     * @param excludeId 排除的标签ID（用于更新时检查）
     * @return 是否存在
     */
    Boolean existsBySlug(@Param("slug") String slug, @Param("excludeId") Long excludeId);

    /**
     * 检查标签名称是否存在
     *
     * @param name      标签名称
     * @param excludeId 排除的标签ID（用于更新时检查）
     * @return 是否存在
     */
    Boolean existsByName(@Param("name") String name, @Param("excludeId") Long excludeId);

    /**
     * 增加标签使用次数
     *
     * @param tagId 标签ID
     * @return 影响行数
     */
    @Select("UPDATE tag SET use_count = use_count + 1, update_time = NOW() WHERE id = #{tagId} AND is_delete = 0")
    int incrementUseCount(@Param("tagId") Long tagId);

    /**
     * 减少标签使用次数
     *
     * @param tagId 标签ID
     * @return 影响行数
     */
    @Select("UPDATE tag SET use_count = GREATEST(use_count - 1, 0), update_time = NOW() WHERE id = #{tagId} AND is_delete = 0")
    int decrementUseCount(@Param("tagId") Long tagId);

    /**
     * 批量增加标签使用次数
     *
     * @param tagIds 标签ID列表
     * @return 影响行数
     */
    int batchIncrementUseCount(@Param("tagIds") List<Long> tagIds);

    /**
     * 批量减少标签使用次数
     *
     * @param tagIds 标签ID列表
     * @return 影响行数
     */
    int batchDecrementUseCount(@Param("tagIds") List<Long> tagIds);

    /**
     * 根据文章ID查询关联的标签
     *
     * @param articleId 文章ID
     * @return 标签列表
     */
    List<Tag> selectTagsByArticleId(@Param("articleId") Long articleId);

    /**
     * 查询未使用的标签（使用次数为0）
     *
     * @return 标签列表
     */
    @Select("SELECT * FROM tag WHERE use_count = 0 AND is_delete = 0 ORDER BY create_time DESC")
    List<Tag> selectUnusedTags();

    /**
     * 统计标签总数
     *
     * @return 标签总数
     */
    @Select("SELECT COUNT(*) FROM tag WHERE is_delete = 0")
    Long countTags();

    /**
     * 统计使用中的标签数量
     *
     * @return 使用中的标签数量
     */
    @Select("SELECT COUNT(*) FROM tag WHERE use_count > 0 AND is_delete = 0")
    Long countUsedTags();
}