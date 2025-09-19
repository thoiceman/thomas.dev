package com.xu.blogapi.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.xu.blogapi.common.ErrorCode;
import com.xu.blogapi.exception.BusinessException;
import com.xu.blogapi.mapper.ArticleMapper;
import com.xu.blogapi.model.dto.article.ArticleAddRequest;
import com.xu.blogapi.model.dto.article.ArticleQueryRequest;
import com.xu.blogapi.model.dto.article.ArticleUpdateRequest;
import com.xu.blogapi.model.entity.Article;
import com.xu.blogapi.service.ArticleService;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.regex.Pattern;

/**
 * 文章服务实现类
 *
 * @author xu
 */
@Service
public class ArticleServiceImpl extends ServiceImpl<ArticleMapper, Article> implements ArticleService {

    @Override
    public Long addArticle(ArticleAddRequest articleAddRequest) {
        // 参数校验
        if (articleAddRequest == null) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR);
        }

        // 创建文章对象
        Article article = new Article();
        BeanUtils.copyProperties(articleAddRequest, article);

        // 生成slug（如果未提供）
        if (StringUtils.isBlank(article.getSlug())) {
            article.setSlug(generateSlug(article.getTitle()));
        }

        // 计算字数和阅读时间
        calculateWordCountAndReadingTime(article);

        // 设置发布时间（如果状态为已发布且未指定发布时间）
        if (article.getStatus() != null && article.getStatus() == 1 && article.getPublishTime() == null) {
            article.setPublishTime(LocalDateTime.now());
        }

        // 验证文章数据
        validArticle(article);

        // 检查slug是否重复
        if (isSlugExists(article.getSlug(), null)) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR, "文章别名已存在");
        }

        // 保存文章
        boolean result = this.save(article);
        if (!result) {
            throw new BusinessException(ErrorCode.SYSTEM_ERROR, "文章创建失败");
        }

        return article.getId();
    }

    @Override
    public Boolean updateArticle(ArticleUpdateRequest articleUpdateRequest) {
        // 参数校验
        if (articleUpdateRequest == null || articleUpdateRequest.getId() == null) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR);
        }

        // 获取原文章
        Article oldArticle = this.getById(articleUpdateRequest.getId());
        if (oldArticle == null) {
            throw new BusinessException(ErrorCode.NOT_FOUND_ERROR, "文章不存在");
        }

        // 更新文章对象
        Article article = new Article();
        BeanUtils.copyProperties(articleUpdateRequest, article);
        
        // 保留原有的作者ID（更新时不允许修改作者）
        article.setAuthorId(oldArticle.getAuthorId());

        // 如果更新了内容，重新计算字数和阅读时间
        if (StringUtils.isNotBlank(article.getContent())) {
            calculateWordCountAndReadingTime(article);
        }

        // 如果状态改为已发布且原来不是已发布状态，设置发布时间
        if (article.getStatus() != null && article.getStatus() == 1 
            && (oldArticle.getStatus() == null || oldArticle.getStatus() != 1)
            && article.getPublishTime() == null) {
            article.setPublishTime(LocalDateTime.now());
        }

        // 验证文章数据
        validArticle(article);

        // 检查slug是否重复（排除自己）
        if (StringUtils.isNotBlank(article.getSlug()) && isSlugExists(article.getSlug(), article.getId())) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR, "文章别名已存在");
        }

        // 更新文章
        boolean result = this.updateById(article);
        if (!result) {
            throw new BusinessException(ErrorCode.SYSTEM_ERROR, "文章更新失败");
        }

        return true;
    }

    @Override
    public Article getArticleById(Long id) {
        if (id == null || id <= 0) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR);
        }

        Article article = this.getById(id);
        if (article == null) {
            throw new BusinessException(ErrorCode.NOT_FOUND_ERROR, "文章不存在");
        }

        return article;
    }

    @Override
    public Article getArticleBySlug(String slug) {
        if (StringUtils.isBlank(slug)) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR);
        }

        Article article = this.baseMapper.selectBySlug(slug);
        if (article == null) {
            throw new BusinessException(ErrorCode.NOT_FOUND_ERROR, "文章不存在");
        }

        return article;
    }

    @Override
    public IPage<Article> listArticlesByPage(ArticleQueryRequest articleQueryRequest) {
        if (articleQueryRequest == null) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR);
        }

        // 创建分页对象
        Page<Article> page = new Page<>(articleQueryRequest.getCurrent(), articleQueryRequest.getPageSize());

        // 调用自定义查询方法
        return this.baseMapper.selectArticleListPage(page, 
            articleQueryRequest.getStatus(),
            articleQueryRequest.getCategoryId(),
            articleQueryRequest.getAuthorId());
    }

    @Override
    public Boolean deleteArticle(Long id) {
        if (id == null || id <= 0) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR);
        }

        // 检查文章是否存在
        Article article = this.getById(id);
        if (article == null) {
            throw new BusinessException(ErrorCode.NOT_FOUND_ERROR, "文章不存在");
        }

        // 逻辑删除
        boolean result = this.removeById(id);
        if (!result) {
            throw new BusinessException(ErrorCode.SYSTEM_ERROR, "文章删除失败");
        }

        return true;
    }

    @Override
    public Boolean removeArticle(Long id) {
        if (id == null || id <= 0) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR);
        }

        // 检查文章是否存在
        Article article = this.getById(id);
        if (article == null) {
            throw new BusinessException(ErrorCode.NOT_FOUND_ERROR, "文章不存在");
        }

        // 物理删除
        QueryWrapper<Article> queryWrapper = new QueryWrapper<>();
        queryWrapper.eq("id", id);
        boolean result = this.remove(queryWrapper);
        if (!result) {
            throw new BusinessException(ErrorCode.SYSTEM_ERROR, "文章删除失败");
        }

        return true;
    }

    @Override
    public Boolean batchDeleteArticles(List<Long> ids) {
        if (ids == null || ids.isEmpty()) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR);
        }

        // 批量逻辑删除
        boolean result = this.removeByIds(ids);
        if (!result) {
            throw new BusinessException(ErrorCode.SYSTEM_ERROR, "批量删除文章失败");
        }

        return true;
    }

    @Override
    public List<Article> getTopArticles(Integer limit) {
        return this.baseMapper.selectTopArticles(limit);
    }

    @Override
    public List<Article> getFeaturedArticles(Integer limit) {
        return this.baseMapper.selectFeaturedArticles(limit);
    }

    @Override
    public Boolean publishArticle(Long id) {
        if (id == null || id <= 0) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR);
        }

        Article article = new Article();
        article.setId(id);
        article.setStatus(1);
        article.setPublishTime(LocalDateTime.now());

        boolean result = this.updateById(article);
        if (!result) {
            throw new BusinessException(ErrorCode.SYSTEM_ERROR, "文章发布失败");
        }

        return true;
    }

    @Override
    public Boolean unpublishArticle(Long id) {
        if (id == null || id <= 0) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR);
        }

        Article article = new Article();
        article.setId(id);
        article.setStatus(2);

        boolean result = this.updateById(article);
        if (!result) {
            throw new BusinessException(ErrorCode.SYSTEM_ERROR, "文章下线失败");
        }

        return true;
    }

    @Override
    public Boolean setArticleTop(Long id, Integer isTop) {
        if (id == null || id <= 0 || isTop == null) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR);
        }

        Article article = new Article();
        article.setId(id);
        article.setIsTop(isTop);

        boolean result = this.updateById(article);
        if (!result) {
            throw new BusinessException(ErrorCode.SYSTEM_ERROR, "设置置顶状态失败");
        }

        return true;
    }

    @Override
    public Boolean setArticleFeatured(Long id, Integer isFeatured) {
        if (id == null || id <= 0 || isFeatured == null) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR);
        }

        Article article = new Article();
        article.setId(id);
        article.setIsFeatured(isFeatured);

        boolean result = this.updateById(article);
        if (!result) {
            throw new BusinessException(ErrorCode.SYSTEM_ERROR, "设置精选状态失败");
        }

        return true;
    }

    @Override
    public void validArticle(Article article) {
        if (article == null) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR);
        }

        String title = article.getTitle();
        String content = article.getContent();
        Long authorId = article.getAuthorId();

        // 标题不能为空
        if (StringUtils.isBlank(title)) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR, "文章标题不能为空");
        }

        // 标题长度限制
        if (title.length() > 200) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR, "文章标题过长");
        }

        // 内容不能为空
        if (StringUtils.isBlank(content)) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR, "文章内容不能为空");
        }

        // 作者ID不能为空
        if (authorId == null || authorId <= 0) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR, "作者ID不能为空");
        }

        // 验证slug格式（如果提供）
        String slug = article.getSlug();
        if (StringUtils.isNotBlank(slug)) {
            if (!isValidSlug(slug)) {
                throw new BusinessException(ErrorCode.PARAMS_ERROR, "文章别名格式不正确");
            }
        }
    }

    /**
     * 生成slug
     *
     * @param title 标题
     * @return slug
     */
    private String generateSlug(String title) {
        if (StringUtils.isBlank(title)) {
            return "";
        }

        // 简单的slug生成逻辑：转小写，替换空格为连字符，移除特殊字符
        return title.toLowerCase()
                .replaceAll("\\s+", "-")
                .replaceAll("[^a-z0-9\\-]", "")
                .replaceAll("-+", "-")
                .replaceAll("^-|-$", "");
    }

    /**
     * 验证slug格式
     *
     * @param slug slug
     * @return 是否有效
     */
    private boolean isValidSlug(String slug) {
        // slug只能包含小写字母、数字和连字符
        Pattern pattern = Pattern.compile("^[a-z0-9\\-]+$");
        return pattern.matcher(slug).matches();
    }

    /**
     * 检查slug是否存在
     *
     * @param slug slug
     * @param excludeId 排除的文章ID
     * @return 是否存在
     */
    private boolean isSlugExists(String slug, Long excludeId) {
        QueryWrapper<Article> queryWrapper = new QueryWrapper<>();
        queryWrapper.eq("slug", slug);
        if (excludeId != null) {
            queryWrapper.ne("id", excludeId);
        }
        return this.count(queryWrapper) > 0;
    }

    /**
     * 计算字数和阅读时间
     *
     * @param article 文章对象
     */
    private void calculateWordCountAndReadingTime(Article article) {
        if (StringUtils.isBlank(article.getContent())) {
            article.setWordCount(0);
            article.setReadingTime(0);
            return;
        }

        // 简单的字数统计（去除Markdown标记）
        String content = article.getContent()
                .replaceAll("```[\\s\\S]*?```", "") // 移除代码块
                .replaceAll("`[^`]*`", "") // 移除行内代码
                .replaceAll("!\\[[^\\]]*\\]\\([^)]*\\)", "") // 移除图片
                .replaceAll("\\[[^\\]]*\\]\\([^)]*\\)", "") // 移除链接
                .replaceAll("[#*_~`>-]", "") // 移除Markdown标记
                .replaceAll("\\s+", " ") // 合并空白字符
                .trim();

        int wordCount = content.length();
        article.setWordCount(wordCount);

        // 按照每分钟200字的阅读速度计算阅读时间
        int readingTime = Math.max(1, (int) Math.ceil(wordCount / 200.0));
        article.setReadingTime(readingTime);
    }
}