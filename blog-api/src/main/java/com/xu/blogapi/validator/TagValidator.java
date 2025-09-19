package com.xu.blogapi.validator;

import com.xu.blogapi.common.ErrorCode;
import com.xu.blogapi.exception.BusinessException;
import com.xu.blogapi.model.dto.tag.TagAddRequest;
import com.xu.blogapi.model.dto.tag.TagUpdateRequest;
import com.xu.blogapi.service.TagService;
import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Component;

import javax.annotation.Resource;
import java.util.regex.Pattern;

/**
 * 标签参数验证器
 *
 * @author xu
 */
@Component
public class TagValidator {

    @Resource
    private TagService tagService;

    /**
     * 标签名称正则表达式（支持中英文、数字、下划线、连字符）
     */
    private static final Pattern TAG_NAME_PATTERN = Pattern.compile("^[\\u4e00-\\u9fa5a-zA-Z0-9_-]+$");

    /**
     * 标签别名正则表达式（只允许小写字母、数字、连字符）
     */
    private static final Pattern TAG_SLUG_PATTERN = Pattern.compile("^[a-z0-9-]+$");

    /**
     * 颜色代码正则表达式（支持3位和6位十六进制颜色）
     */
    private static final Pattern COLOR_PATTERN = Pattern.compile("^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$");

    /**
     * 验证标签添加请求
     *
     * @param request 标签添加请求
     */
    public void validateTagAddRequest(TagAddRequest request) {
        if (request == null) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR, "请求参数不能为空");
        }

        // 验证标签名称
        validateTagName(request.getName());

        // 验证标签别名
        validateTagSlug(request.getSlug());

        // 验证颜色代码
        validateColor(request.getColor());

        // 检查标签名称是否已存在
        if (tagService.existsByName(request.getName())) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR, "标签名称已存在");
        }

        // 检查标签别名是否已存在
        if (tagService.existsBySlug(request.getSlug())) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR, "标签别名已存在");
        }
    }

    /**
     * 验证标签更新请求
     *
     * @param request 标签更新请求
     */
    public void validateTagUpdateRequest(TagUpdateRequest request) {
        if (request == null) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR, "请求参数不能为空");
        }

        // 验证ID
        if (request.getId() == null || request.getId() <= 0) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR, "标签ID不能为空且必须大于0");
        }

        // 检查标签是否存在
        if (!tagService.existsById(request.getId())) {
            throw new BusinessException(ErrorCode.NOT_FOUND_ERROR, "标签不存在");
        }

        // 验证标签名称
        if (StringUtils.isNotBlank(request.getName())) {
            validateTagName(request.getName());
            // 检查名称是否与其他标签重复
            if (tagService.existsByNameAndNotId(request.getName(), request.getId())) {
                throw new BusinessException(ErrorCode.PARAMS_ERROR, "标签名称已存在");
            }
        }

        // 验证标签别名
        if (StringUtils.isNotBlank(request.getSlug())) {
            validateTagSlug(request.getSlug());
            // 检查别名是否与其他标签重复
            if (tagService.existsBySlugAndNotId(request.getSlug(), request.getId())) {
                throw new BusinessException(ErrorCode.PARAMS_ERROR, "标签别名已存在");
            }
        }

        // 验证颜色代码
        if (StringUtils.isNotBlank(request.getColor())) {
            validateColor(request.getColor());
        }
    }

    /**
     * 验证标签名称
     *
     * @param name 标签名称
     */
    public void validateTagName(String name) {
        if (StringUtils.isBlank(name)) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR, "标签名称不能为空");
        }

        if (name.length() < 1 || name.length() > 20) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR, "标签名称长度必须在1-20个字符之间");
        }

        if (!TAG_NAME_PATTERN.matcher(name).matches()) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR, "标签名称只能包含中英文、数字、下划线和连字符");
        }
    }

    /**
     * 验证标签别名
     *
     * @param slug 标签别名
     */
    public void validateTagSlug(String slug) {
        if (StringUtils.isBlank(slug)) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR, "标签别名不能为空");
        }

        if (slug.length() < 1 || slug.length() > 50) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR, "标签别名长度必须在1-50个字符之间");
        }

        if (!TAG_SLUG_PATTERN.matcher(slug).matches()) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR, "标签别名只能包含小写字母、数字和连字符");
        }

        if (slug.startsWith("-") || slug.endsWith("-")) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR, "标签别名不能以连字符开头或结尾");
        }

        if (slug.contains("--")) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR, "标签别名不能包含连续的连字符");
        }
    }

    /**
     * 验证颜色代码
     *
     * @param color 颜色代码
     */
    private void validateColor(String color) {
        if (StringUtils.isBlank(color)) {
            return; // 颜色可以为空，使用默认颜色
        }

        if (!COLOR_PATTERN.matcher(color).matches()) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR, "颜色代码格式不正确，请使用十六进制格式（如：#FF0000）");
        }
    }

    /**
     * 验证颜色代码（公共方法）
     *
     * @param color 颜色代码
     */
    public void validateColorCode(String color) {
        validateColor(color);
    }

    /**
     * 验证标签ID
     *
     * @param tagId 标签ID
     */
    public void validateTagId(Long tagId) {
        if (tagId == null || tagId <= 0) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR, "标签ID不能为空且必须大于0");
        }

        if (!tagService.existsById(tagId)) {
            throw new BusinessException(ErrorCode.NOT_FOUND_ERROR, "标签不存在");
        }
    }

    /**
     * 验证文章ID
     *
     * @param articleId 文章ID
     */
    public void validateArticleId(Long articleId) {
        if (articleId == null || articleId <= 0) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR, "文章ID不能为空且必须大于0");
        }
        // 注意：这里需要注入ArticleService来验证文章是否存在
        // 为了避免循环依赖，可以在Controller层进行验证
    }

    /**
     * 验证分页参数
     *
     * @param current 当前页码
     * @param size    每页大小
     */
    public void validatePageParams(long current, long size) {
        if (current < 1) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR, "页码必须大于0");
        }

        if (size < 1 || size > 100) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR, "每页大小必须在1-100之间");
        }
    }

    /**
     * 验证排序字段
     *
     * @param sortField 排序字段
     */
    public void validateSortField(String sortField) {
        if (StringUtils.isBlank(sortField)) {
            return; // 排序字段可以为空，使用默认排序
        }

        // 定义允许的排序字段
        String[] allowedFields = {"id", "name", "slug", "useCount", "createTime", "updateTime"};
        boolean isValid = false;
        for (String field : allowedFields) {
            if (field.equals(sortField)) {
                isValid = true;
                break;
            }
        }

        if (!isValid) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR, 
                "不支持的排序字段，允许的字段：id, name, slug, useCount, createTime, updateTime");
        }
    }

    /**
     * 验证排序方向
     *
     * @param sortOrder 排序方向
     */
    public void validateSortOrder(String sortOrder) {
        if (StringUtils.isBlank(sortOrder)) {
            return; // 排序方向可以为空，使用默认排序
        }

        if (!"asc".equalsIgnoreCase(sortOrder) && !"desc".equalsIgnoreCase(sortOrder)) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR, "排序方向只能是asc或desc");
        }
    }
}