package com.xu.blogapi.controller;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.xu.blogapi.common.BaseResponse;
import com.xu.blogapi.common.ErrorCode;
import com.xu.blogapi.common.ResultUtils;
import com.xu.blogapi.exception.BusinessException;
import com.xu.blogapi.model.dto.article.ArticleAddRequest;
import com.xu.blogapi.model.dto.article.ArticleQueryRequest;
import com.xu.blogapi.model.dto.article.ArticleUpdateRequest;
import com.xu.blogapi.model.entity.Article;
import com.xu.blogapi.service.ArticleService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import javax.annotation.Resource;
import javax.validation.Valid;
import java.util.List;

/**
 * 文章控制器
 *
 * @author xu
 */
@RestController
@RequestMapping("/article")
@Slf4j
@Api(tags = "文章管理接口")
public class ArticleController {

    @Resource
    private ArticleService articleService;

    /**
     * 创建文章
     *
     * @param articleAddRequest 文章创建请求
     * @return 文章ID
     */
    @PostMapping("/add")
    @ApiOperation(value = "创建文章")
    public BaseResponse<Long> addArticle(@Valid @RequestBody ArticleAddRequest articleAddRequest) {
        if (articleAddRequest == null) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR);
        }

        Long articleId = articleService.addArticle(articleAddRequest);
        return ResultUtils.success(articleId);
    }

    /**
     * 更新文章
     *
     * @param articleUpdateRequest 文章更新请求
     * @return 是否成功
     */
    @PostMapping("/update")
    @ApiOperation(value = "更新文章")
    public BaseResponse<Boolean> updateArticle(@Valid @RequestBody ArticleUpdateRequest articleUpdateRequest) {
        if (articleUpdateRequest == null || articleUpdateRequest.getId() == null) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR);
        }

        Boolean result = articleService.updateArticle(articleUpdateRequest);
        return ResultUtils.success(result);
    }

    /**
     * 根据ID获取文章
     *
     * @param id 文章ID
     * @return 文章信息
     */
    @GetMapping("/get/{id}")
    @ApiOperation(value = "获取文章")
    public BaseResponse<Article> getArticleById(@ApiParam(value = "文章ID", required = true) @PathVariable Long id) {
        if (id == null || id <= 0) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR);
        }

        Article article = articleService.getArticleById(id);
        return ResultUtils.success(article);
    }

    /**
     * 根据slug获取文章
     *
     * @param slug 文章别名
     * @return 文章信息
     */
    @GetMapping("/get/slug/{slug}")
    @ApiOperation(value = "根据别名获取文章")
    public BaseResponse<Article> getArticleBySlug(@ApiParam(value = "文章别名", required = true) @PathVariable String slug) {
        if (slug == null || slug.trim().isEmpty()) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR);
        }

        Article article = articleService.getArticleBySlug(slug);
        return ResultUtils.success(article);
    }

    /**
     * 分页查询文章列表
     *
     * @param articleQueryRequest 查询请求
     * @return 文章列表
     */
    @PostMapping("/list/page")
    @ApiOperation(value = "分页查询文章")
    public BaseResponse<IPage<Article>> listArticlesByPage(@Valid @RequestBody ArticleQueryRequest articleQueryRequest) {
        if (articleQueryRequest == null) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR);
        }

        IPage<Article> articlePage = articleService.listArticlesByPage(articleQueryRequest);
        return ResultUtils.success(articlePage);
    }

    /**
     * 删除文章（逻辑删除）
     *
     * @param id 文章ID
     * @return 是否成功
     */
    @PostMapping("/delete/{id}")
    @ApiOperation(value = "删除文章")
    public BaseResponse<Boolean> deleteArticle(@ApiParam(value = "文章ID", required = true) @PathVariable Long id) {
        if (id == null || id <= 0) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR);
        }

        Boolean result = articleService.deleteArticle(id);
        return ResultUtils.success(result);
    }

    /**
     * 物理删除文章
     *
     * @param id 文章ID
     * @return 是否成功
     */
    @PostMapping("/remove/{id}")
    @ApiOperation(value = "物理删除文章")
    public BaseResponse<Boolean> removeArticle(@ApiParam(value = "文章ID", required = true) @PathVariable Long id) {
        if (id == null || id <= 0) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR);
        }

        Boolean result = articleService.removeArticle(id);
        return ResultUtils.success(result);
    }

    /**
     * 批量删除文章
     *
     * @param ids 文章ID列表
     * @return 是否成功
     */
    @PostMapping("/batch/delete")
    @ApiOperation(value = "批量删除文章")
    public BaseResponse<Boolean> batchDeleteArticles(@RequestBody List<Long> ids) {
        if (ids == null || ids.isEmpty()) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR);
        }

        Boolean result = articleService.batchDeleteArticles(ids);
        return ResultUtils.success(result);
    }

    /**
     * 发布文章
     *
     * @param id 文章ID
     * @return 是否成功
     */
    @PostMapping("/publish/{id}")
    @ApiOperation(value = "发布文章")
    public BaseResponse<Boolean> publishArticle(@ApiParam(value = "文章ID", required = true) @PathVariable Long id) {
        if (id == null || id <= 0) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR);
        }

        Boolean result = articleService.publishArticle(id);
        return ResultUtils.success(result);
    }

    /**
     * 下线文章
     *
     * @param id 文章ID
     * @return 是否成功
     */
    @PostMapping("/unpublish/{id}")
    @ApiOperation(value = "下线文章")
    public BaseResponse<Boolean> unpublishArticle(@ApiParam(value = "文章ID", required = true) @PathVariable Long id) {
        if (id == null || id <= 0) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR);
        }

        Boolean result = articleService.unpublishArticle(id);
        return ResultUtils.success(result);
    }

    /**
     * 设置文章置顶状态
     *
     * @param id 文章ID
     * @param isTop 是否置顶（1-置顶，0-不置顶）
     * @return 是否成功
     */
    @PostMapping("/top/{id}")
    @ApiOperation(value = "设置置顶")
    public BaseResponse<Boolean> setArticleTop(@ApiParam(value = "文章ID", required = true) @PathVariable Long id,
                                               @ApiParam(value = "是否置顶", required = true) @RequestParam Integer isTop) {
        if (id == null || id <= 0 || isTop == null) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR);
        }

        Boolean result = articleService.setArticleTop(id, isTop);
        return ResultUtils.success(result);
    }

    /**
     * 设置文章精选状态
     *
     * @param id 文章ID
     * @param isFeatured 是否精选（1-精选，0-不精选）
     * @return 是否成功
     */
    @PostMapping("/featured/{id}")
    @ApiOperation(value = "设置精选")
    public BaseResponse<Boolean> setArticleFeatured(@ApiParam(value = "文章ID", required = true) @PathVariable Long id,
                                                    @ApiParam(value = "是否精选", required = true) @RequestParam Integer isFeatured) {
        if (id == null || id <= 0 || isFeatured == null) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR);
        }

        Boolean result = articleService.setArticleFeatured(id, isFeatured);
        return ResultUtils.success(result);
    }

    /**
     * 获取置顶文章
     *
     * @param limit 限制数量
     * @return 置顶文章列表
     */
    @GetMapping("/top")
    @ApiOperation(value = "获取置顶文章")
    public BaseResponse<List<Article>> getTopArticles(@ApiParam(value = "限制数量") @RequestParam(defaultValue = "5") Integer limit) {
        List<Article> articles = articleService.getTopArticles(limit);
        return ResultUtils.success(articles);
    }

    /**
     * 获取精选文章
     *
     * @param limit 限制数量
     * @return 精选文章列表
     */
    @GetMapping("/featured")
    @ApiOperation(value = "获取精选文章")
    public BaseResponse<List<Article>> getFeaturedArticles(@ApiParam(value = "限制数量") @RequestParam(defaultValue = "5") Integer limit) {
        List<Article> articles = articleService.getFeaturedArticles(limit);
        return ResultUtils.success(articles);
    }
}