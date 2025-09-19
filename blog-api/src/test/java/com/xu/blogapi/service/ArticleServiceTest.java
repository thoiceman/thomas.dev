package com.xu.blogapi.service;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.xu.blogapi.exception.BusinessException;
import com.xu.blogapi.model.dto.article.ArticleAddRequest;
import com.xu.blogapi.model.dto.article.ArticleQueryRequest;
import com.xu.blogapi.model.dto.article.ArticleUpdateRequest;
import com.xu.blogapi.model.entity.Article;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import javax.annotation.Resource;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

/**
 * 文章服务测试类
 *
 * @author xu
 */
@SpringBootTest
@Transactional
class ArticleServiceTest {

    @Resource
    private ArticleService articleService;

    /**
     * 测试创建文章
     */
    @Test
    void testAddArticle() {
        // 准备测试数据
        ArticleAddRequest request = new ArticleAddRequest();
        request.setTitle("测试文章标题");
        request.setSlug("test-article");
        request.setContent("这是一篇测试文章的内容，用于验证文章创建功能。");
        request.setSummary("测试文章摘要");
        request.setAuthorId(1L);
        request.setCategoryId(1L);
        request.setStatus(1);
        request.setIsTop(0);
        request.setIsFeatured(0);

        // 执行测试
        Long articleId = articleService.addArticle(request);

        // 验证结果
        assertNotNull(articleId);
        assertTrue(articleId > 0);

        // 验证文章是否正确保存
        Article article = articleService.getArticleById(articleId);
        assertNotNull(article);
        assertEquals(request.getTitle(), article.getTitle());
        assertEquals(request.getSlug(), article.getSlug());
        assertEquals(request.getContent(), article.getContent());
        assertEquals(request.getAuthorId(), article.getAuthorId());
        assertNotNull(article.getWordCount());
        assertNotNull(article.getReadingTime());
        assertTrue(article.getWordCount() > 0);
        assertTrue(article.getReadingTime() > 0);
    }

    /**
     * 测试创建文章时参数为空
     */
    @Test
    void testAddArticleWithNullRequest() {
        assertThrows(BusinessException.class, () -> {
            articleService.addArticle(null);
        });
    }

    /**
     * 测试创建文章时标题为空
     */
    @Test
    void testAddArticleWithEmptyTitle() {
        ArticleAddRequest request = new ArticleAddRequest();
        request.setTitle("");
        request.setContent("测试内容");
        request.setAuthorId(1L);

        assertThrows(BusinessException.class, () -> {
            articleService.addArticle(request);
        });
    }

    /**
     * 测试更新文章
     */
    @Test
    void testUpdateArticle() {
        // 先创建一篇文章
        ArticleAddRequest addRequest = new ArticleAddRequest();
        addRequest.setTitle("原始标题");
        addRequest.setSlug("original-title");
        addRequest.setContent("原始内容");
        addRequest.setAuthorId(1L);
        addRequest.setStatus(2);

        Long articleId = articleService.addArticle(addRequest);

        // 准备更新数据
        ArticleUpdateRequest updateRequest = new ArticleUpdateRequest();
        updateRequest.setId(articleId);
        updateRequest.setTitle("更新后的标题");
        updateRequest.setSlug("updated-title");
        updateRequest.setContent("更新后的内容，内容更长一些，用于测试字数统计功能。");
        updateRequest.setStatus(1);

        // 执行更新
        Boolean result = articleService.updateArticle(updateRequest);

        // 验证结果
        assertTrue(result);

        // 验证文章是否正确更新
        Article updatedArticle = articleService.getArticleById(articleId);
        assertEquals(updateRequest.getTitle(), updatedArticle.getTitle());
        assertEquals(updateRequest.getSlug(), updatedArticle.getSlug());
        assertEquals(updateRequest.getContent(), updatedArticle.getContent());
        assertEquals(updateRequest.getStatus(), updatedArticle.getStatus());
        assertNotNull(updatedArticle.getPublishTime()); // 状态改为已发布，应该设置发布时间
    }

    /**
     * 测试根据ID获取文章
     */
    @Test
    void testGetArticleById() {
        // 先创建一篇文章
        ArticleAddRequest request = new ArticleAddRequest();
        request.setTitle("测试获取文章");
        request.setContent("测试内容");
        request.setAuthorId(1L);

        Long articleId = articleService.addArticle(request);

        // 获取文章
        Article article = articleService.getArticleById(articleId);

        // 验证结果
        assertNotNull(article);
        assertEquals(articleId, article.getId());
        assertEquals(request.getTitle(), article.getTitle());
    }

    /**
     * 测试获取不存在的文章
     */
    @Test
    void testGetArticleByIdNotFound() {
        assertThrows(BusinessException.class, () -> {
            articleService.getArticleById(99999L);
        });
    }

    /**
     * 测试根据slug获取文章
     */
    @Test
    void testGetArticleBySlug() {
        // 先创建一篇文章
        ArticleAddRequest request = new ArticleAddRequest();
        request.setTitle("测试slug查询");
        request.setSlug("test-slug-query");
        request.setContent("测试内容");
        request.setAuthorId(1L);

        articleService.addArticle(request);

        // 根据slug获取文章
        Article article = articleService.getArticleBySlug("test-slug-query");

        // 验证结果
        assertNotNull(article);
        assertEquals(request.getSlug(), article.getSlug());
        assertEquals(request.getTitle(), article.getTitle());
    }

    /**
     * 测试分页查询文章
     */
    @Test
    void testListArticlesByPage() {
        // 先创建几篇文章
        for (int i = 1; i <= 3; i++) {
            ArticleAddRequest request = new ArticleAddRequest();
            request.setTitle("测试文章 " + i);
            request.setSlug("test-article-" + i);
            request.setContent("测试内容 " + i);
            request.setAuthorId(1L);
            request.setStatus(1);
            articleService.addArticle(request);
        }

        // 准备查询请求
        ArticleQueryRequest queryRequest = new ArticleQueryRequest();
        queryRequest.setCurrent(1);
        queryRequest.setPageSize(10);
        queryRequest.setStatus(1);

        // 执行查询
        IPage<Article> result = articleService.listArticlesByPage(queryRequest);

        // 验证结果
        assertNotNull(result);
        assertTrue(result.getTotal() >= 3);
        assertTrue(result.getRecords().size() >= 3);
    }

    /**
     * 测试删除文章
     */
    @Test
    void testDeleteArticle() {
        // 先创建一篇文章
        ArticleAddRequest request = new ArticleAddRequest();
        request.setTitle("待删除文章");
        request.setContent("测试内容");
        request.setAuthorId(1L);

        Long articleId = articleService.addArticle(request);

        // 删除文章
        Boolean result = articleService.deleteArticle(articleId);

        // 验证结果
        assertTrue(result);

        // 验证文章是否被删除（逻辑删除，应该抛出异常）
        assertThrows(BusinessException.class, () -> {
            articleService.getArticleById(articleId);
        });
    }

    /**
     * 测试批量删除文章
     */
    @Test
    void testBatchDeleteArticles() {
        // 先创建几篇文章
        Long articleId1 = articleService.addArticle(createTestArticleRequest("批量删除测试1"));
        Long articleId2 = articleService.addArticle(createTestArticleRequest("批量删除测试2"));

        // 批量删除
        List<Long> ids = Arrays.asList(articleId1, articleId2);
        Boolean result = articleService.batchDeleteArticles(ids);

        // 验证结果
        assertTrue(result);
    }

    /**
     * 测试发布文章
     */
    @Test
    void testPublishArticle() {
        // 先创建一篇草稿文章
        ArticleAddRequest request = new ArticleAddRequest();
        request.setTitle("待发布文章");
        request.setContent("测试内容");
        request.setAuthorId(1L);
        request.setStatus(2); // 草稿状态

        Long articleId = articleService.addArticle(request);

        // 发布文章
        Boolean result = articleService.publishArticle(articleId);

        // 验证结果
        assertTrue(result);

        // 验证文章状态是否更新
        Article article = articleService.getArticleById(articleId);
        assertEquals(1, article.getStatus());
        assertNotNull(article.getPublishTime());
    }

    /**
     * 测试设置文章置顶
     */
    @Test
    void testSetArticleTop() {
        // 先创建一篇文章
        Long articleId = articleService.addArticle(createTestArticleRequest("置顶测试"));

        // 设置置顶
        Boolean result = articleService.setArticleTop(articleId, 1);

        // 验证结果
        assertTrue(result);

        // 验证置顶状态
        Article article = articleService.getArticleById(articleId);
        assertEquals(1, article.getIsTop());
    }

    /**
     * 测试设置文章精选
     */
    @Test
    void testSetArticleFeatured() {
        // 先创建一篇文章
        Long articleId = articleService.addArticle(createTestArticleRequest("精选测试"));

        // 设置精选
        Boolean result = articleService.setArticleFeatured(articleId, 1);

        // 验证结果
        assertTrue(result);

        // 验证精选状态
        Article article = articleService.getArticleById(articleId);
        assertEquals(1, article.getIsFeatured());
    }

    /**
     * 测试获取置顶文章
     */
    @Test
    void testGetTopArticles() {
        // 先创建一篇置顶文章
        Long articleId = articleService.addArticle(createTestArticleRequest("置顶文章"));
        articleService.setArticleTop(articleId, 1);

        // 获取置顶文章
        List<Article> topArticles = articleService.getTopArticles(5);

        // 验证结果
        assertNotNull(topArticles);
        assertTrue(topArticles.size() >= 1);
        assertTrue(topArticles.stream().anyMatch(article -> article.getId().equals(articleId)));
    }

    /**
     * 测试获取精选文章
     */
    @Test
    void testGetFeaturedArticles() {
        // 先创建一篇精选文章
        Long articleId = articleService.addArticle(createTestArticleRequest("精选文章"));
        articleService.setArticleFeatured(articleId, 1);

        // 获取精选文章
        List<Article> featuredArticles = articleService.getFeaturedArticles(5);

        // 验证结果
        assertNotNull(featuredArticles);
        assertTrue(featuredArticles.size() >= 1);
        assertTrue(featuredArticles.stream().anyMatch(article -> article.getId().equals(articleId)));
    }

    /**
     * 测试文章验证功能
     */
    @Test
    void testValidArticle() {
        // 测试正常文章
        Article validArticle = new Article();
        validArticle.setTitle("有效标题");
        validArticle.setContent("有效内容");
        validArticle.setAuthorId(1L);
        validArticle.setSlug("valid-slug");

        assertDoesNotThrow(() -> {
            articleService.validArticle(validArticle);
        });

        // 测试标题为空
        Article invalidArticle1 = new Article();
        invalidArticle1.setTitle("");
        invalidArticle1.setContent("有效内容");
        invalidArticle1.setAuthorId(1L);

        assertThrows(BusinessException.class, () -> {
            articleService.validArticle(invalidArticle1);
        });

        // 测试内容为空
        Article invalidArticle2 = new Article();
        invalidArticle2.setTitle("有效标题");
        invalidArticle2.setContent("");
        invalidArticle2.setAuthorId(1L);

        assertThrows(BusinessException.class, () -> {
            articleService.validArticle(invalidArticle2);
        });

        // 测试作者ID为空
        Article invalidArticle3 = new Article();
        invalidArticle3.setTitle("有效标题");
        invalidArticle3.setContent("有效内容");
        invalidArticle3.setAuthorId(null);

        assertThrows(BusinessException.class, () -> {
            articleService.validArticle(invalidArticle3);
        });
    }

    /**
     * 创建测试文章请求的辅助方法
     */
    private ArticleAddRequest createTestArticleRequest(String title) {
        ArticleAddRequest request = new ArticleAddRequest();
        request.setTitle(title);
        request.setSlug(title.toLowerCase().replaceAll("\\s+", "-"));
        request.setContent("这是" + title + "的测试内容");
        request.setAuthorId(1L);
        request.setStatus(1);
        return request;
    }
}