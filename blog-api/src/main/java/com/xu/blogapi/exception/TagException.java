package com.xu.blogapi.exception;

import com.xu.blogapi.common.ErrorCode;

/**
 * 标签相关异常
 *
 * @author xu
 */
public class TagException extends BusinessException {

    /**
     * 标签不存在异常
     */
    public static final TagException TAG_NOT_FOUND = new TagException(ErrorCode.NOT_FOUND_ERROR, "标签不存在");

    /**
     * 标签名称已存在异常
     */
    public static final TagException TAG_NAME_EXISTS = new TagException(ErrorCode.PARAMS_ERROR, "标签名称已存在");

    /**
     * 标签别名已存在异常
     */
    public static final TagException TAG_SLUG_EXISTS = new TagException(ErrorCode.PARAMS_ERROR, "标签别名已存在");

    /**
     * 标签正在使用中异常
     */
    public static final TagException TAG_IN_USE = new TagException(ErrorCode.OPERATION_ERROR, "标签正在使用中，无法删除");

    /**
     * 标签名称格式错误异常
     */
    public static final TagException INVALID_TAG_NAME = new TagException(ErrorCode.PARAMS_ERROR, "标签名称格式不正确");

    /**
     * 标签别名格式错误异常
     */
    public static final TagException INVALID_TAG_SLUG = new TagException(ErrorCode.PARAMS_ERROR, "标签别名格式不正确");

    /**
     * 颜色代码格式错误异常
     */
    public static final TagException INVALID_COLOR_CODE = new TagException(ErrorCode.PARAMS_ERROR, "颜色代码格式不正确");

    /**
     * 标签数量超限异常
     */
    public static final TagException TAG_LIMIT_EXCEEDED = new TagException(ErrorCode.OPERATION_ERROR, "标签数量超出限制");

    /**
     * 文章标签关联不存在异常
     */
    public static final TagException ARTICLE_TAG_NOT_FOUND = new TagException(ErrorCode.NOT_FOUND_ERROR, "文章标签关联不存在");

    /**
     * 文章标签关联已存在异常
     */
    public static final TagException ARTICLE_TAG_EXISTS = new TagException(ErrorCode.PARAMS_ERROR, "文章标签关联已存在");

    public TagException(ErrorCode errorCode) {
        super(errorCode);
    }

    public TagException(ErrorCode errorCode, String message) {
        super(errorCode, message);
    }

    public TagException(ErrorCode errorCode, String message, Throwable cause) {
        super(errorCode, message, cause);
    }

    /**
     * 创建标签不存在异常
     *
     * @param tagId 标签ID
     * @return 异常实例
     */
    public static TagException tagNotFound(Long tagId) {
        return new TagException(ErrorCode.NOT_FOUND_ERROR, "标签不存在，ID: " + tagId);
    }

    /**
     * 创建标签名称已存在异常
     *
     * @param name 标签名称
     * @return 异常实例
     */
    public static TagException tagNameExists(String name) {
        return new TagException(ErrorCode.PARAMS_ERROR, "标签名称已存在: " + name);
    }

    /**
     * 创建标签别名已存在异常
     *
     * @param slug 标签别名
     * @return 异常实例
     */
    public static TagException tagSlugExists(String slug) {
        return new TagException(ErrorCode.PARAMS_ERROR, "标签别名已存在: " + slug);
    }

    /**
     * 创建标签正在使用中异常
     *
     * @param tagId 标签ID
     * @param useCount 使用次数
     * @return 异常实例
     */
    public static TagException tagInUse(Long tagId, Integer useCount) {
        return new TagException(ErrorCode.OPERATION_ERROR, 
            String.format("标签正在使用中，无法删除。标签ID: %d，使用次数: %d", tagId, useCount));
    }

    /**
     * 创建标签名称格式错误异常
     *
     * @param name 标签名称
     * @return 异常实例
     */
    public static TagException invalidTagName(String name) {
        return new TagException(ErrorCode.PARAMS_ERROR, 
            "标签名称格式不正确: " + name + "，只能包含中英文、数字、下划线和连字符，长度1-20个字符");
    }

    /**
     * 创建标签别名格式错误异常
     *
     * @param slug 标签别名
     * @return 异常实例
     */
    public static TagException invalidTagSlug(String slug) {
        return new TagException(ErrorCode.PARAMS_ERROR, 
            "标签别名格式不正确: " + slug + "，只能包含小写字母、数字和连字符，长度1-50个字符");
    }

    /**
     * 创建颜色代码格式错误异常
     *
     * @param color 颜色代码
     * @return 异常实例
     */
    public static TagException invalidColorCode(String color) {
        return new TagException(ErrorCode.PARAMS_ERROR, 
            "颜色代码格式不正确: " + color + "，请使用十六进制格式（如：#FF0000）");
    }

    /**
     * 创建标签数量超限异常
     *
     * @param currentCount 当前数量
     * @param maxCount 最大数量
     * @return 异常实例
     */
    public static TagException tagLimitExceeded(int currentCount, int maxCount) {
        return new TagException(ErrorCode.OPERATION_ERROR, 
            String.format("标签数量超出限制，当前: %d，最大: %d", currentCount, maxCount));
    }

    /**
     * 创建文章标签关联不存在异常
     *
     * @param articleId 文章ID
     * @param tagId 标签ID
     * @return 异常实例
     */
    public static TagException articleTagNotFound(Long articleId, Long tagId) {
        return new TagException(ErrorCode.NOT_FOUND_ERROR, 
            String.format("文章标签关联不存在，文章ID: %d，标签ID: %d", articleId, tagId));
    }

    /**
     * 创建文章标签关联已存在异常
     *
     * @param articleId 文章ID
     * @param tagId 标签ID
     * @return 异常实例
     */
    public static TagException articleTagExists(Long articleId, Long tagId) {
        return new TagException(ErrorCode.PARAMS_ERROR, 
            String.format("文章标签关联已存在，文章ID: %d，标签ID: %d", articleId, tagId));
    }
}