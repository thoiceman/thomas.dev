package com.xu.blogapi.validator;

import com.xu.blogapi.exception.CategoryException;
import com.xu.blogapi.model.dto.category.CategoryAddRequest;
import com.xu.blogapi.model.dto.category.CategoryUpdateRequest;
import com.xu.blogapi.model.entity.Category;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

import java.util.regex.Pattern;

/**
 * 分类数据验证器
 *
 * @author xu
 */
@Component
public class CategoryValidator {

    /**
     * 分类名称最大长度
     */
    private static final int MAX_NAME_LENGTH = 50;

    /**
     * 分类别名最大长度
     */
    private static final int MAX_SLUG_LENGTH = 100;

    /**
     * 分类描述最大长度
     */
    private static final int MAX_DESCRIPTION_LENGTH = 500;

    /**
     * 最大分类层级深度
     */
    private static final int MAX_CATEGORY_DEPTH = 5;

    /**
     * 最大排序权重
     */
    private static final int MAX_SORT_ORDER = 9999;

    /**
     * 别名格式正则表达式（只允许字母、数字、连字符和下划线）
     */
    private static final Pattern SLUG_PATTERN = Pattern.compile("^[a-zA-Z0-9_-]+$");

    /**
     * 验证分类添加请求
     *
     * @param request 添加请求
     */
    public void validateAddRequest(CategoryAddRequest request) {
        if (request == null) {
            throw CategoryException.notFound();
        }

        // 验证分类名称
        validateName(request.getName());

        // 验证分类别名
        validateSlug(request.getSlug());

        // 验证分类描述
        validateDescription(request.getDescription());

        // 验证排序权重
        validateSortOrder(request.getSortOrder());

        // 验证状态
        validateStatus(request.getStatus());
    }

    /**
     * 验证分类更新请求
     *
     * @param request 更新请求
     */
    public void validateUpdateRequest(CategoryUpdateRequest request) {
        if (request == null) {
            throw CategoryException.notFound();
        }

        // 验证ID
        if (request.getId() == null || request.getId() <= 0) {
            throw new CategoryException(40000, "分类ID不能为空");
        }

        // 验证分类名称
        if (StringUtils.hasText(request.getName())) {
            validateName(request.getName());
        }

        // 验证分类别名
        if (StringUtils.hasText(request.getSlug())) {
            validateSlug(request.getSlug());
        }

        // 验证分类描述
        if (request.getDescription() != null) {
            validateDescription(request.getDescription());
        }

        // 验证排序权重
        if (request.getSortOrder() != null) {
            validateSortOrder(request.getSortOrder());
        }

        // 验证状态
        if (request.getStatus() != null) {
            validateStatus(request.getStatus());
        }
    }

    /**
     * 验证分类实体
     *
     * @param category 分类实体
     */
    public void validateCategory(Category category) {
        if (category == null) {
            throw CategoryException.notFound();
        }

        // 验证分类名称
        validateName(category.getName());

        // 验证分类别名
        validateSlug(category.getSlug());

        // 验证分类描述
        validateDescription(category.getDescription());

        // 验证排序权重
        validateSortOrder(category.getSortOrder());

        // 验证状态
        validateStatus(category.getStatus());
    }

    /**
     * 验证分类名称
     *
     * @param name 分类名称
     */
    public void validateName(String name) {
        if (!StringUtils.hasText(name)) {
            throw new CategoryException(40000, "分类名称不能为空");
        }

        if (name.trim().length() > MAX_NAME_LENGTH) {
            throw new CategoryException(40000, "分类名称长度不能超过 " + MAX_NAME_LENGTH + " 个字符");
        }

        // 检查是否包含特殊字符
        if (containsSpecialCharacters(name)) {
            throw new CategoryException(40000, "分类名称不能包含特殊字符");
        }
    }

    /**
     * 验证分类别名
     *
     * @param slug 分类别名
     */
    public void validateSlug(String slug) {
        if (!StringUtils.hasText(slug)) {
            throw new CategoryException(40000, "分类别名不能为空");
        }

        if (slug.trim().length() > MAX_SLUG_LENGTH) {
            throw new CategoryException(40000, "分类别名长度不能超过 " + MAX_SLUG_LENGTH + " 个字符");
        }

        // 检查别名格式
        if (!SLUG_PATTERN.matcher(slug.trim()).matches()) {
            throw new CategoryException(40000, "分类别名只能包含字母、数字、连字符和下划线");
        }

        // 检查是否以连字符开头或结尾
        String trimmedSlug = slug.trim();
        if (trimmedSlug.startsWith("-") || trimmedSlug.endsWith("-")) {
            throw new CategoryException(40000, "分类别名不能以连字符开头或结尾");
        }
    }

    /**
     * 验证分类描述
     *
     * @param description 分类描述
     */
    public void validateDescription(String description) {
        if (description != null && description.length() > MAX_DESCRIPTION_LENGTH) {
            throw new CategoryException(40000, "分类描述长度不能超过 " + MAX_DESCRIPTION_LENGTH + " 个字符");
        }
    }

    /**
     * 验证排序权重
     *
     * @param sortOrder 排序权重
     */
    public void validateSortOrder(Integer sortOrder) {
        if (sortOrder != null) {
            if (sortOrder < 0) {
                throw CategoryException.invalidSortOrder(sortOrder);
            }
            if (sortOrder > MAX_SORT_ORDER) {
                throw new CategoryException(40000, "排序权重不能超过 " + MAX_SORT_ORDER);
            }
        }
    }

    /**
     * 验证分类状态
     *
     * @param status 分类状态
     */
    public void validateStatus(Integer status) {
        if (status != null && status != 0 && status != 1) {
            throw CategoryException.invalidStatus(status);
        }
    }

    /**
     * 验证分类层级深度
     *
     * @param depth 层级深度
     */
    public void validateCategoryDepth(Integer depth) {
        if (depth != null && depth >= MAX_CATEGORY_DEPTH) {
            throw CategoryException.tooDeep(MAX_CATEGORY_DEPTH);
        }
    }

    /**
     * 验证分类ID
     *
     * @param categoryId 分类ID
     */
    public void validateCategoryId(Long categoryId) {
        if (categoryId == null || categoryId <= 0) {
            throw new CategoryException(40000, "分类ID不能为空");
        }
    }

    /**
     * 验证父分类ID
     *
     * @param parentId 父分类ID
     */
    public void validateParentId(Long parentId) {
        if (parentId != null && parentId <= 0) {
            throw new CategoryException(40000, "父分类ID无效");
        }
    }

    /**
     * 检查字符串是否包含特殊字符
     *
     * @param str 字符串
     * @return 是否包含特殊字符
     */
    private boolean containsSpecialCharacters(String str) {
        // 允许中文、英文、数字、空格、常见标点符号
        Pattern pattern = Pattern.compile("^[\\u4e00-\\u9fa5a-zA-Z0-9\\s.,;:!?()\\[\\]{}\"'`~@#$%^&*+=|\\\\/<>-]*$");
        return !pattern.matcher(str).matches();
    }

    /**
     * 获取最大分类层级深度
     *
     * @return 最大层级深度
     */
    public static int getMaxCategoryDepth() {
        return MAX_CATEGORY_DEPTH;
    }
}