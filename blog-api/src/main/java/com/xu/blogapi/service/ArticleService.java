package com.xu.blogapi.service;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.service.IService;
import com.xu.blogapi.model.dto.article.ArticleAddRequest;
import com.xu.blogapi.model.dto.article.ArticleQueryRequest;
import com.xu.blogapi.model.dto.article.ArticleUpdateRequest;
import com.xu.blogapi.model.entity.Article;

import java.util.List;

/**
 * 文章服务接口
 *
 * @author xu
 */
public interface ArticleService extends IService<Article> {

    /**
     * 创建文章
     *
     * @param articleAddRequest 文章添加请求
     * @return 文章ID
     */
    Long addArticle(ArticleAddRequest articleAddRequest);

    /**
     * 更新文章
     *
     * @param articleUpdateRequest 文章更新请求
     * @return 是否更新成功
     */
    Boolean updateArticle(ArticleUpdateRequest articleUpdateRequest);

    /**
     * 根据ID获取文章详情
     *
     * @param id 文章ID
     * @return 文章详情
     */
    Article getArticleById(Long id);

    /**
     * 根据slug获取文章详情
     *
     * @param slug 文章别名
     * @return 文章详情
     */
    Article getArticleBySlug(String slug);

    /**
     * 分页查询文章列表
     *
     * @param articleQueryRequest 查询请求
     * @return 分页结果
     */
    IPage<Article> listArticlesByPage(ArticleQueryRequest articleQueryRequest);

    /**
     * 删除文章（逻辑删除）
     *
     * @param id 文章ID
     * @return 是否删除成功
     */
    Boolean deleteArticle(Long id);

    /**
     * 物理删除文章
     *
     * @param id 文章ID
     * @return 是否删除成功
     */
    Boolean removeArticle(Long id);

    /**
     * 批量删除文章（逻辑删除）
     *
     * @param ids 文章ID列表
     * @return 是否删除成功
     */
    Boolean batchDeleteArticles(List<Long> ids);

    /**
     * 获取置顶文章列表
     *
     * @param limit 限制数量
     * @return 置顶文章列表
     */
    List<Article> getTopArticles(Integer limit);

    /**
     * 获取精选文章列表
     *
     * @param limit 限制数量
     * @return 精选文章列表
     */
    List<Article> getFeaturedArticles(Integer limit);

    /**
     * 发布文章
     *
     * @param id 文章ID
     * @return 是否发布成功
     */
    Boolean publishArticle(Long id);

    /**
     * 下线文章
     *
     * @param id 文章ID
     * @return 是否下线成功
     */
    Boolean unpublishArticle(Long id);

    /**
     * 设置文章置顶状态
     *
     * @param id 文章ID
     * @param isTop 是否置顶
     * @return 是否设置成功
     */
    Boolean setArticleTop(Long id, Integer isTop);

    /**
     * 设置文章精选状态
     *
     * @param id 文章ID
     * @param isFeatured 是否精选
     * @return 是否设置成功
     */
    Boolean setArticleFeatured(Long id, Integer isFeatured);

    /**
     * 验证文章数据
     *
     * @param article 文章对象
     */
    void validArticle(Article article);
}