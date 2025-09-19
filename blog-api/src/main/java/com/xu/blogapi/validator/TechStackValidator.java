package com.xu.blogapi.validator;

import com.xu.blogapi.exception.TechStackException;
import com.xu.blogapi.model.dto.techstack.TechStackAddRequest;
import com.xu.blogapi.model.dto.techstack.TechStackUpdateRequest;
import com.xu.blogapi.model.dto.techstack.TechStackQueryRequest;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

import java.util.Arrays;
import java.util.List;
import java.util.regex.Pattern;

/**
 * 技术栈参数验证器
 *
 * @author xu
 */
@Component
public class TechStackValidator {

    /**
     * URL格式正则表达式
     */
    private static final Pattern URL_PATTERN = Pattern.compile("^(https?://)?[\\w\\-._~:/?#\\[\\]@!$&'()*+,;=]+$");

    /**
     * 支持的排序字段
     */
    private static final List<String> VALID_SORT_FIELDS = Arrays.asList(
            "name", "category", "sortOrder", "status", "createTime", "updateTime"
    );

    /**
     * 支持的排序顺序
     */
    private static final List<String> VALID_SORT_ORDERS = Arrays.asList("asc", "desc", "ASC", "DESC");

    /**
     * 验证技术栈添加请求
     *
     * @param request 添加请求
     */
    public void validateTechStackAddRequest(TechStackAddRequest request) {
        if (request == null) {
            throw new TechStackException("技术栈添加请求不能为空");
        }

        validateTechStackName(request.getName());
        validateTechStackCategory(request.getCategory());
        validateTechStackDescription(request.getDescription());
        validateTechStackIcon(request.getIcon());
        validateTechStackOfficialUrl(request.getOfficialUrl());
        validateSortOrder(request.getSortOrder());
        validateStatus(request.getStatus());
    }

    /**
     * 验证技术栈更新请求
     *
     * @param request 更新请求
     */
    public void validateTechStackUpdateRequest(TechStackUpdateRequest request) {
        if (request == null) {
            throw new TechStackException("技术栈更新请求不能为空");
        }

        validateTechStackId(request.getId());
        validateTechStackName(request.getName());
        validateTechStackCategory(request.getCategory());
        validateTechStackDescription(request.getDescription());
        validateTechStackIcon(request.getIcon());
        validateTechStackOfficialUrl(request.getOfficialUrl());
        validateSortOrder(request.getSortOrder());
        validateStatus(request.getStatus());
    }

    /**
     * 验证技术栈查询请求
     *
     * @param request 查询请求
     */
    public void validateTechStackQueryRequest(TechStackQueryRequest request) {
        if (request == null) {
            throw new TechStackException("技术栈查询请求不能为空");
        }

        validatePageParams(request.getCurrent(), request.getPageSize());
        validateSortField(request.getSortField());
        validateSortOrderValue(request.getSortOrder());
    }

    /**
     * 验证技术栈ID
     *
     * @param id 技术栈ID
     */
    public void validateTechStackId(Long id) {
        if (id == null) {
            throw new TechStackException("技术栈ID不能为空");
        }
        if (id <= 0) {
            throw new TechStackException("技术栈ID必须大于0");
        }
    }

    /**
     * 验证技术名称
     *
     * @param name 技术名称
     */
    public void validateTechStackName(String name) {
        if (!StringUtils.hasText(name)) {
            throw new TechStackException("技术名称不能为空");
        }
        if (name.length() > 100) {
            throw new TechStackException("技术名称长度不能超过100个字符");
        }
    }

    /**
     * 验证技术分类
     *
     * @param category 技术分类
     */
    public void validateTechStackCategory(String category) {
        if (!StringUtils.hasText(category)) {
            throw new TechStackException("技术分类不能为空");
        }
        if (category.length() > 50) {
            throw new TechStackException("技术分类长度不能超过50个字符");
        }
    }

    /**
     * 验证技术描述
     *
     * @param description 技术描述
     */
    public void validateTechStackDescription(String description) {
        if (description != null && description.length() > 1000) {
            throw new TechStackException("技术描述长度不能超过1000个字符");
        }
    }

    /**
     * 验证技术图标URL
     *
     * @param icon 技术图标URL
     */
    public void validateTechStackIcon(String icon) {
        if (StringUtils.hasText(icon)) {
            if (icon.length() > 200) {
                throw new TechStackException("技术图标URL长度不能超过200个字符");
            }
            if (!URL_PATTERN.matcher(icon).matches()) {
                throw new TechStackException("技术图标URL格式不正确");
            }
        }
    }

    /**
     * 验证官方网站URL
     *
     * @param officialUrl 官方网站URL
     */
    public void validateTechStackOfficialUrl(String officialUrl) {
        if (StringUtils.hasText(officialUrl)) {
            if (officialUrl.length() > 200) {
                throw new TechStackException("官方网站URL长度不能超过200个字符");
            }
            if (!URL_PATTERN.matcher(officialUrl).matches()) {
                throw new TechStackException("官方网站URL格式不正确");
            }
        }
    }

    /**
     * 验证排序权重
     *
     * @param sortOrder 排序权重
     */
    public void validateSortOrder(Integer sortOrder) {
        if (sortOrder != null && sortOrder < 0) {
            throw new TechStackException("排序权重不能小于0");
        }
    }

    /**
     * 验证状态
     *
     * @param status 状态
     */
    public void validateStatus(Integer status) {
        if (status != null && status != 0 && status != 1) {
            throw new TechStackException("状态值只能是0（不展示）或1（展示）");
        }
    }

    /**
     * 验证分页参数
     *
     * @param current  当前页码
     * @param pageSize 每页大小
     */
    public void validatePageParams(Integer current, Integer pageSize) {
        if (current == null || current <= 0) {
            throw new TechStackException("页码必须大于0");
        }
        if (pageSize == null || pageSize <= 0) {
            throw new TechStackException("每页大小必须大于0");
        }
        if (pageSize > 100) {
            throw new TechStackException("每页大小不能超过100");
        }
    }

    /**
     * 验证排序字段
     *
     * @param sortField 排序字段
     */
    public void validateSortField(String sortField) {
        if (StringUtils.hasText(sortField) && !VALID_SORT_FIELDS.contains(sortField)) {
            throw new TechStackException("不支持的排序字段: " + sortField);
        }
    }

    /**
     * 验证排序顺序
     *
     * @param sortOrder 排序顺序
     */
    public void validateSortOrderValue(String sortOrder) {
        if (StringUtils.hasText(sortOrder) && !VALID_SORT_ORDERS.contains(sortOrder)) {
            throw new TechStackException("不支持的排序顺序: " + sortOrder);
        }
    }
}