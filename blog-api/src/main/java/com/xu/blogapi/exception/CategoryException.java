package com.xu.blogapi.exception;

import com.xu.blogapi.common.ErrorCode;

/**
 * 分类相关异常
 *
 * @author xu
 */
public class CategoryException extends BusinessException {

    private static final long serialVersionUID = 1L;

    public CategoryException(ErrorCode errorCode) {
        super(errorCode);
    }

    public CategoryException(ErrorCode errorCode, String message) {
        super(errorCode, message);
    }

    public CategoryException(int code, String message) {
        super(code, message);
    }

    /**
     * 分类不存在异常
     */
    public static CategoryException notFound() {
        return new CategoryException(ErrorCode.NOT_FOUND_ERROR, "分类不存在");
    }

    /**
     * 分类不存在异常（带ID）
     */
    public static CategoryException notFound(Long categoryId) {
        return new CategoryException(ErrorCode.NOT_FOUND_ERROR, "分类不存在，ID: " + categoryId);
    }

    /**
     * 分类名称已存在异常
     */
    public static CategoryException nameExists(String name) {
        return new CategoryException(ErrorCode.PARAMS_ERROR, "分类名称已存在: " + name);
    }

    /**
     * 分类别名已存在异常
     */
    public static CategoryException slugExists(String slug) {
        return new CategoryException(ErrorCode.PARAMS_ERROR, "分类别名已存在: " + slug);
    }

    /**
     * 分类层级过深异常
     */
    public static CategoryException tooDeep(int maxDepth) {
        return new CategoryException(ErrorCode.PARAMS_ERROR, "分类层级过深，最多支持 " + maxDepth + " 级");
    }

    /**
     * 循环引用异常
     */
    public static CategoryException circularReference() {
        return new CategoryException(ErrorCode.PARAMS_ERROR, "不能将分类移动到其子分类下，会形成循环引用");
    }

    /**
     * 分类有关联文章异常
     */
    public static CategoryException hasArticles(Long articleCount) {
        return new CategoryException(ErrorCode.OPERATION_ERROR, "分类下还有 " + articleCount + " 篇文章，无法删除");
    }

    /**
     * 分类有子分类异常
     */
    public static CategoryException hasChildren() {
        return new CategoryException(ErrorCode.OPERATION_ERROR, "分类下还有子分类，无法删除");
    }

    /**
     * 父分类不存在异常
     */
    public static CategoryException parentNotFound(Long parentId) {
        return new CategoryException(ErrorCode.NOT_FOUND_ERROR, "父分类不存在，ID: " + parentId);
    }

    /**
     * 分类状态无效异常
     */
    public static CategoryException invalidStatus(Integer status) {
        return new CategoryException(ErrorCode.PARAMS_ERROR, "无效的分类状态: " + status);
    }

    /**
     * 分类排序权重无效异常
     */
    public static CategoryException invalidSortOrder(Integer sortOrder) {
        return new CategoryException(ErrorCode.PARAMS_ERROR, "无效的排序权重: " + sortOrder);
    }
}