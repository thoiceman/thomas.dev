package com.xu.blogapi.controller;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.xu.blogapi.common.BaseResponse;
import com.xu.blogapi.common.ErrorCode;
import com.xu.blogapi.common.ResultUtils;
import com.xu.blogapi.exception.BusinessException;
import com.xu.blogapi.model.dto.tag.TagAddRequest;
import com.xu.blogapi.model.dto.tag.TagQueryRequest;
import com.xu.blogapi.model.dto.tag.TagUpdateRequest;
import com.xu.blogapi.model.vo.TagVO;
import com.xu.blogapi.service.TagService;
import com.xu.blogapi.validator.TagValidator;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import javax.annotation.Resource;
import javax.validation.Valid;
import java.util.List;

/**
 * 标签接口控制器
 *
 * @author xu
 */
@RestController
@RequestMapping("/tag")
@Slf4j
@Api(tags = "标签管理接口")
public class TagController {

    @Resource
    private TagService tagService;

    @Resource
    private TagValidator tagValidator;

    /**
     * 创建标签
     *
     * @param tagAddRequest 标签添加请求
     * @return 标签ID
     */
    @PostMapping("/add")
    @ApiOperation(value = "创建标签")
    public BaseResponse<Long> addTag(@Valid @RequestBody TagAddRequest tagAddRequest) {
        // 参数验证
        tagValidator.validateTagAddRequest(tagAddRequest);
        
        Long tagId = tagService.addTag(tagAddRequest);
        return ResultUtils.success(tagId);
    }

    /**
     * 删除标签
     *
     * @param id 标签ID
     * @return 是否删除成功
     */
    @PostMapping("/delete")
    @ApiOperation(value = "删除标签")
    public BaseResponse<Boolean> deleteTag(@ApiParam(value = "标签ID", required = true) @RequestParam Long id) {
        // 参数验证
        tagValidator.validateTagId(id);
        
        Boolean result = tagService.deleteTag(id);
        return ResultUtils.success(result);
    }

    /**
     * 更新标签
     *
     * @param tagUpdateRequest 标签更新请求
     * @return 是否更新成功
     */
    @PostMapping("/update")
    @ApiOperation(value = "更新标签")
    public BaseResponse<Boolean> updateTag(@Valid @RequestBody TagUpdateRequest tagUpdateRequest) {
        // 参数验证
        tagValidator.validateTagUpdateRequest(tagUpdateRequest);
        
        Boolean result = tagService.updateTag(tagUpdateRequest);
        return ResultUtils.success(result);
    }

    /**
     * 根据ID获取标签
     *
     * @param id 标签ID
     * @return 标签信息
     */
    @GetMapping("/get")
    @ApiOperation(value = "根据ID获取标签")
    public BaseResponse<TagVO> getTagById(@ApiParam(value = "标签ID", required = true) @RequestParam Long id) {
        // 参数验证
        tagValidator.validateTagId(id);
        
        TagVO tagVO = tagService.getTagById(id);
        return ResultUtils.success(tagVO);
    }

    /**
     * 根据别名获取标签
     *
     * @param slug 标签别名
     * @return 标签信息
     */
    @GetMapping("/get/slug")
    @ApiOperation(value = "根据别名获取标签")
    public BaseResponse<TagVO> getTagBySlug(@ApiParam(value = "标签别名", required = true) @RequestParam String slug) {
        // 参数验证
        tagValidator.validateTagSlug(slug);
        
        TagVO tagVO = tagService.getTagBySlug(slug);
        return ResultUtils.success(tagVO);
    }

    /**
     * 分页获取标签列表
     *
     * @param tagQueryRequest 查询请求
     * @return 标签分页列表
     */
    @PostMapping("/list/page")
    @ApiOperation(value = "分页获取标签列表")
    public BaseResponse<IPage<TagVO>> listTagsByPage(@RequestBody TagQueryRequest tagQueryRequest) {
        // 参数验证
        if (tagQueryRequest != null) {
            tagValidator.validatePageParams(tagQueryRequest.getCurrent(), tagQueryRequest.getPageSize());
            tagValidator.validateSortField(tagQueryRequest.getSortField());
            tagValidator.validateSortOrder(tagQueryRequest.getSortOrder());
        }
        
        IPage<TagVO> tagVOPage = tagService.listTagsByPage(tagQueryRequest);
        return ResultUtils.success(tagVOPage);
    }

    /**
     * 获取所有标签
     *
     * @return 标签列表
     */
    @GetMapping("/list/all")
    @ApiOperation(value = "获取所有标签")
    public BaseResponse<List<TagVO>> listAllTags() {
        List<TagVO> tagList = tagService.listAllTags();
        return ResultUtils.success(tagList);
    }

    /**
     * 获取热门标签
     *
     * @param limit 限制数量
     * @return 热门标签列表
     */
    @GetMapping("/list/popular")
    @ApiOperation(value = "获取热门标签")
    public BaseResponse<List<TagVO>> listPopularTags(
            @ApiParam(value = "限制数量", example = "10") @RequestParam(defaultValue = "10") Integer limit) {
        List<TagVO> tagList = tagService.listPopularTags(limit);
        return ResultUtils.success(tagList);
    }

    /**
     * 根据文章ID获取标签列表
     *
     * @param articleId 文章ID
     * @return 标签列表
     */
    @GetMapping("/list/article")
    @ApiOperation(value = "根据文章ID获取标签列表")
    public BaseResponse<List<TagVO>> listTagsByArticleId(
            @ApiParam(value = "文章ID", required = true) @RequestParam Long articleId) {
        // 参数验证
        tagValidator.validateArticleId(articleId);
        
        List<TagVO> tagVOList = tagService.listTagsByArticleId(articleId);
        return ResultUtils.success(tagVOList);
    }

    // endregion

    // region 标签使用次数管理

    /**
     * 增加标签使用次数
     *
     * @param tagIds 标签ID列表
     * @return 操作结果
     */
    @PostMapping("/increment")
    @ApiOperation(value = "增加标签使用次数")
    public BaseResponse<Boolean> incrementUseCount(@RequestBody List<Long> tagIds) {
        if (tagIds == null || tagIds.isEmpty()) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR);
        }
        tagService.incrementUseCount(tagIds);
        return ResultUtils.success(true);
    }

    /**
     * 减少标签使用次数
     *
     * @param tagIds 标签ID列表
     * @return 操作结果
     */
    @PostMapping("/decrement")
    @ApiOperation(value = "减少标签使用次数")
    public BaseResponse<Boolean> decrementUseCount(@RequestBody List<Long> tagIds) {
        if (tagIds == null || tagIds.isEmpty()) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR);
        }
        tagService.decrementUseCount(tagIds);
        return ResultUtils.success(true);
    }

    // endregion
}