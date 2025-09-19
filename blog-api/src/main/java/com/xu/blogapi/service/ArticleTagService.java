package com.xu.blogapi.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.xu.blogapi.model.entity.ArticleTag;

import java.util.List;

/**
 * 文章标签关联服务接口
 *
 * @author xu
 */
public interface ArticleTagService extends IService<ArticleTag> {

    /**
     * 为文章添加标签
     *
     * @param articleId 文章ID
     * @param tagIds    标签ID列表
     * @return 是否成功
     */
    Boolean addTagsToArticle(Long articleId, List<Long> tagIds);

    /**
     * 移除文章的标签
     *
     * @param articleId 文章ID
     * @param tagIds    标签ID列表
     * @return 是否成功
     */
    Boolean removeTagsFromArticle(Long articleId, List<Long> tagIds);

    /**
     * 更新文章的标签（先删除所有关联，再添加新的关联）
     *
     * @param articleId 文章ID
     * @param tagIds    新的标签ID列表
     * @return 是否成功
     */
    Boolean updateArticleTags(Long articleId, List<Long> tagIds);

    /**
     * 删除文章的所有标签关联
     *
     * @param articleId 文章ID
     * @return 是否成功
     */
    Boolean removeAllTagsFromArticle(Long articleId);

    /**
     * 删除标签的所有文章关联
     *
     * @param tagId 标签ID
     * @return 是否成功
     */
    Boolean removeAllArticlesFromTag(Long tagId);

    /**
     * 根据文章ID获取标签ID列表
     *
     * @param articleId 文章ID
     * @return 标签ID列表
     */
    List<Long> getTagIdsByArticleId(Long articleId);

    /**
     * 根据标签ID获取文章ID列表
     *
     * @param tagId 标签ID
     * @return 文章ID列表
     */
    List<Long> getArticleIdsByTagId(Long tagId);

    /**
     * 检查文章标签关联是否存在
     *
     * @param articleId 文章ID
     * @param tagId     标签ID
     * @return 是否存在
     */
    Boolean existsRelation(Long articleId, Long tagId);

    /**
     * 统计文章的标签数量
     *
     * @param articleId 文章ID
     * @return 标签数量
     */
    Long countTagsByArticleId(Long articleId);

    /**
     * 统计标签的文章数量
     *
     * @param tagId 标签ID
     * @return 文章数量
     */
    Long countArticlesByTagId(Long tagId);

    /**
     * 获取热门标签ID列表（按关联文章数量排序）
     *
     * @param limit 限制数量
     * @return 标签ID列表
     */
    List<Long> getPopularTagIds(Integer limit);
}