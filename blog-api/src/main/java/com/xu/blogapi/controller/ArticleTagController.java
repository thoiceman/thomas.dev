package com.xu.blogapi.controller;

import com.xu.blogapi.common.BaseResponse;
import com.xu.blogapi.common.ErrorCode;
import com.xu.blogapi.common.ResultUtils;
import com.xu.blogapi.exception.BusinessException;
import com.xu.blogapi.service.ArticleTagService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import javax.annotation.Resource;
import java.util.List;

/**
 * 文章标签关联接口控制器
 *
 * @author xu
 */
@RestController
@RequestMapping("/article-tag")
@Slf4j
@Api(tags = "文章标签关联管理接口")
public class ArticleTagController {

    @Resource
    private ArticleTagService articleTagService;

    /**
     * 为文章添加标签
     *
     * @param articleId 文章ID
     * @param tagIds    标签ID列表
     * @return 操作结果
     */
    @PostMapping("/add")
    @ApiOperation(value = "为文章添加标签")
    public BaseResponse<Boolean> addTagsToArticle(
            @ApiParam(value = "文章ID", required = true) @RequestParam Long articleId,
            @ApiParam(value = "标签ID列表", required = true) @RequestBody List<Long> tagIds) {
        if (articleId == null || articleId <= 0) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR, "文章ID不能为空");
        }
        Boolean result = articleTagService.addTagsToArticle(articleId, tagIds);
        return ResultUtils.success(result);
    }

    /**
     * 移除文章的标签
     *
     * @param articleId 文章ID
     * @param tagIds    标签ID列表
     * @return 操作结果
     */
    @PostMapping("/remove")
    @ApiOperation(value = "移除文章的标签")
    public BaseResponse<Boolean> removeTagsFromArticle(
            @ApiParam(value = "文章ID", required = true) @RequestParam Long articleId,
            @ApiParam(value = "标签ID列表", required = true) @RequestBody List<Long> tagIds) {
        if (articleId == null || articleId <= 0) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR, "文章ID不能为空");
        }
        Boolean result = articleTagService.removeTagsFromArticle(articleId, tagIds);
        return ResultUtils.success(result);
    }

    /**
     * 更新文章的标签（替换所有标签）
     *
     * @param articleId 文章ID
     * @param tagIds    新的标签ID列表
     * @return 操作结果
     */
    @PostMapping("/update")
    @ApiOperation(value = "更新文章的标签")
    public BaseResponse<Boolean> updateArticleTags(
            @ApiParam(value = "文章ID", required = true) @RequestParam Long articleId,
            @ApiParam(value = "新的标签ID列表") @RequestBody List<Long> tagIds) {
        if (articleId == null || articleId <= 0) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR, "文章ID不能为空");
        }
        Boolean result = articleTagService.updateArticleTags(articleId, tagIds);
        return ResultUtils.success(result);
    }

    /**
     * 删除文章的所有标签关联
     *
     * @param articleId 文章ID
     * @return 操作结果
     */
    @PostMapping("/remove-all")
    @ApiOperation(value = "删除文章的所有标签关联")
    public BaseResponse<Boolean> removeAllTagsFromArticle(
            @ApiParam(value = "文章ID", required = true) @RequestParam Long articleId) {
        if (articleId == null || articleId <= 0) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR, "文章ID不能为空");
        }
        Boolean result = articleTagService.removeAllTagsFromArticle(articleId);
        return ResultUtils.success(result);
    }

    /**
     * 根据文章ID获取标签ID列表
     *
     * @param articleId 文章ID
     * @return 标签ID列表
     */
    @GetMapping("/tags")
    @ApiOperation(value = "根据文章ID获取标签ID列表")
    public BaseResponse<List<Long>> getTagIdsByArticleId(
            @ApiParam(value = "文章ID", required = true) @RequestParam Long articleId) {
        if (articleId == null || articleId <= 0) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR, "文章ID不能为空");
        }
        List<Long> tagIds = articleTagService.getTagIdsByArticleId(articleId);
        return ResultUtils.success(tagIds);
    }

    /**
     * 根据标签ID获取文章ID列表
     *
     * @param tagId 标签ID
     * @return 文章ID列表
     */
    @GetMapping("/articles")
    @ApiOperation(value = "根据标签ID获取文章ID列表")
    public BaseResponse<List<Long>> getArticleIdsByTagId(
            @ApiParam(value = "标签ID", required = true) @RequestParam Long tagId) {
        if (tagId == null || tagId <= 0) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR, "标签ID不能为空");
        }
        List<Long> articleIds = articleTagService.getArticleIdsByTagId(tagId);
        return ResultUtils.success(articleIds);
    }

    /**
     * 检查文章标签关联是否存在
     *
     * @param articleId 文章ID
     * @param tagId     标签ID
     * @return 是否存在
     */
    @GetMapping("/exists")
    @ApiOperation(value = "检查文章标签关联是否存在")
    public BaseResponse<Boolean> existsRelation(
            @ApiParam(value = "文章ID", required = true) @RequestParam Long articleId,
            @ApiParam(value = "标签ID", required = true) @RequestParam Long tagId) {
        if (articleId == null || articleId <= 0 || tagId == null || tagId <= 0) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR, "文章ID和标签ID不能为空");
        }
        Boolean exists = articleTagService.existsRelation(articleId, tagId);
        return ResultUtils.success(exists);
    }

    /**
     * 统计文章的标签数量
     *
     * @param articleId 文章ID
     * @return 标签数量
     */
    @GetMapping("/count/tags")
    @ApiOperation(value = "统计文章的标签数量")
    public BaseResponse<Long> countTagsByArticleId(
            @ApiParam(value = "文章ID", required = true) @RequestParam Long articleId) {
        if (articleId == null || articleId <= 0) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR, "文章ID不能为空");
        }
        Long count = articleTagService.countTagsByArticleId(articleId);
        return ResultUtils.success(count);
    }

    /**
     * 统计标签的文章数量
     *
     * @param tagId 标签ID
     * @return 文章数量
     */
    @GetMapping("/count/articles")
    @ApiOperation(value = "统计标签的文章数量")
    public BaseResponse<Long> countArticlesByTagId(
            @ApiParam(value = "标签ID", required = true) @RequestParam Long tagId) {
        if (tagId == null || tagId <= 0) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR, "标签ID不能为空");
        }
        Long count = articleTagService.countArticlesByTagId(tagId);
        return ResultUtils.success(count);
    }
}