package com.xu.blogapi.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.xu.blogapi.model.entity.ArticleTag;
import org.apache.ibatis.annotations.Delete;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

import java.util.List;

/**
 * 文章标签关联数据访问层
 *
 * @author xu
 */
public interface ArticleTagMapper extends BaseMapper<ArticleTag> {

    /**
     * 根据文章ID查询关联的标签ID列表
     *
     * @param articleId 文章ID
     * @return 标签ID列表
     */
    @Select("SELECT tag_id FROM article_tag WHERE article_id = #{articleId}")
    List<Long> selectTagIdsByArticleId(@Param("articleId") Long articleId);

    /**
     * 根据标签ID查询关联的文章ID列表
     *
     * @param tagId 标签ID
     * @return 文章ID列表
     */
    @Select("SELECT article_id FROM article_tag WHERE tag_id = #{tagId}")
    List<Long> selectArticleIdsByTagId(@Param("tagId") Long tagId);

    /**
     * 批量插入文章标签关联
     *
     * @param articleTagList 关联列表
     * @return 插入数量
     */
    int batchInsert(@Param("articleTagList") List<ArticleTag> articleTagList);

    /**
     * 删除文章的所有标签关联
     *
     * @param articleId 文章ID
     * @return 删除数量
     */
    @Delete("DELETE FROM article_tag WHERE article_id = #{articleId}")
    int deleteByArticleId(@Param("articleId") Long articleId);

    /**
     * 删除标签的所有文章关联
     *
     * @param tagId 标签ID
     * @return 删除数量
     */
    @Delete("DELETE FROM article_tag WHERE tag_id = #{tagId}")
    int deleteByTagId(@Param("tagId") Long tagId);

    /**
     * 删除指定的文章标签关联
     *
     * @param articleId 文章ID
     * @param tagId     标签ID
     * @return 删除数量
     */
    @Delete("DELETE FROM article_tag WHERE article_id = #{articleId} AND tag_id = #{tagId}")
    int deleteByArticleIdAndTagId(@Param("articleId") Long articleId, @Param("tagId") Long tagId);

    /**
     * 检查文章标签关联是否存在
     *
     * @param articleId 文章ID
     * @param tagId     标签ID
     * @return 是否存在
     */
    @Select("SELECT COUNT(*) > 0 FROM article_tag WHERE article_id = #{articleId} AND tag_id = #{tagId}")
    Boolean existsByArticleIdAndTagId(@Param("articleId") Long articleId, @Param("tagId") Long tagId);

    /**
     * 统计文章的标签数量
     *
     * @param articleId 文章ID
     * @return 标签数量
     */
    @Select("SELECT COUNT(*) FROM article_tag WHERE article_id = #{articleId}")
    Long countTagsByArticleId(@Param("articleId") Long articleId);

    /**
     * 统计标签的文章数量
     *
     * @param tagId 标签ID
     * @return 文章数量
     */
    @Select("SELECT COUNT(*) FROM article_tag WHERE tag_id = #{tagId}")
    Long countArticlesByTagId(@Param("tagId") Long tagId);

    /**
     * 批量删除文章标签关联
     *
     * @param articleId 文章ID
     * @param tagIds    标签ID列表
     * @return 删除数量
     */
    int batchDeleteByArticleIdAndTagIds(@Param("articleId") Long articleId, @Param("tagIds") List<Long> tagIds);

    /**
     * 查询热门标签的文章关联（按文章数量排序）
     *
     * @param limit 限制数量
     * @return 标签ID列表
     */
    List<Long> selectPopularTagIds(@Param("limit") Integer limit);
}