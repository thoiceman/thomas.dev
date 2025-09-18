package com.xu.blogapi.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.xu.blogapi.common.ErrorCode;
import com.xu.blogapi.exception.BusinessException;
import com.xu.blogapi.exception.CategoryException;
import com.xu.blogapi.mapper.CategoryMapper;
import com.xu.blogapi.model.dto.category.CategoryAddRequest;
import com.xu.blogapi.model.dto.category.CategoryQueryRequest;
import com.xu.blogapi.model.dto.category.CategoryUpdateRequest;
import com.xu.blogapi.model.entity.Category;
import com.xu.blogapi.model.vo.CategoryTreeVO;
import com.xu.blogapi.model.vo.CategoryVO;
import com.xu.blogapi.service.CategoryService;
import com.xu.blogapi.service.CategoryService.CategoryRelationInfo;
import com.xu.blogapi.validator.CategoryValidator;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import javax.annotation.Resource;
import java.time.LocalDateTime;
import java.util.*;
import java.util.function.Function;
import java.util.stream.Collectors;

/**
 * 分类服务实现类
 */
@Service
@Slf4j
public class CategoryServiceImpl extends ServiceImpl<CategoryMapper, Category> implements CategoryService {

    @Resource
    private CategoryMapper categoryMapper;

    @Resource
    private CategoryValidator categoryValidator;

    @Override
    @Transactional(rollbackFor = Exception.class)
    public Long addCategory(CategoryAddRequest categoryAddRequest) {
        // 参数验证
        categoryValidator.validateAddRequest(categoryAddRequest);

        // 检查分类名称是否已存在
        if (categoryMapper.existsByName(categoryAddRequest.getName(), null)) {
            throw CategoryException.nameExists(categoryAddRequest.getName());
        }

        // 检查分类别名是否已存在
        if (categoryMapper.existsBySlug(categoryAddRequest.getSlug(), null)) {
            throw CategoryException.slugExists(categoryAddRequest.getSlug());
        }

        // 创建分类对象
        Category category = new Category();
        BeanUtils.copyProperties(categoryAddRequest, category);

        // 设置排序权重
        if (category.getSortOrder() == null) {
            Integer maxSortOrder = categoryMapper.getMaxSortOrder();
            category.setSortOrder(maxSortOrder != null ? maxSortOrder + 1 : 1);
        }

        // 设置默认状态
        if (category.getStatus() == null) {
            category.setStatus(1); // 默认启用
        }

        // 保存分类
        boolean result = this.save(category);
        if (!result) {
            throw new BusinessException(ErrorCode.OPERATION_ERROR, "分类创建失败");
        }

        return category.getId();
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public Boolean updateCategory(CategoryUpdateRequest categoryUpdateRequest) {
        // 参数验证
        categoryValidator.validateUpdateRequest(categoryUpdateRequest);

        Long id = categoryUpdateRequest.getId();
        
        // 检查分类是否存在
        Category existingCategory = categoryMapper.selectById(id);
        if (existingCategory == null) {
            throw CategoryException.notFound(id);
        }

        // 检查名称是否重复（排除自己）
        String newName = categoryUpdateRequest.getName();
        if (StringUtils.hasText(newName) && !newName.equals(existingCategory.getName())) {
            if (categoryMapper.existsByName(newName, categoryUpdateRequest.getId())) {
                throw CategoryException.nameExists(newName);
            }
        }

        // 检查别名是否重复（排除自己）
        String newSlug = categoryUpdateRequest.getSlug();
        if (StringUtils.hasText(newSlug) && !newSlug.equals(existingCategory.getSlug())) {
            if (categoryMapper.existsBySlug(newSlug, categoryUpdateRequest.getId())) {
                throw CategoryException.slugExists(newSlug);
            }
        }

        // 验证父分类变更
        // 更新分类信息
        Category category = new Category();
        BeanUtils.copyProperties(categoryUpdateRequest, category);

        boolean result = this.updateById(category);
        if (!result) {
            throw new BusinessException(ErrorCode.OPERATION_ERROR, "分类更新失败");
        }

        return true;
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public Boolean deleteCategory(Long id) {
        // 参数验证
        categoryValidator.validateCategoryId(id);

        // 检查分类是否存在
        Category category = categoryMapper.selectById(id);
        if (category == null) {
            throw CategoryException.notFound(id);
        }

        // 检查是否有关联的文章
        CategoryRelationInfo relationInfo = checkCategoryRelations(id);
        if (relationInfo.getArticleCount() > 0) {
            throw CategoryException.hasArticles(relationInfo.getArticleCount());
        }

        // 删除分类
        boolean result = this.removeById(id);
        if (!result) {
            throw new BusinessException(ErrorCode.OPERATION_ERROR, "分类删除失败");
        }

        return true;
    }

    @Override
    public CategoryVO getCategoryById(Long id) {
        // 参数验证
        categoryValidator.validateCategoryId(id);

        Category category = categoryMapper.selectById(id);
        if (category == null) {
            throw CategoryException.notFound(id);
        }

        return getCategoryVO(category);
    }

    @Override
    public CategoryVO getCategoryBySlug(String slug) {
        // 参数校验
        if (!StringUtils.hasText(slug)) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR, "分类别名不能为空");
        }

        // 查询分类
        Category category = categoryMapper.selectBySlug(slug);
        if (category == null) {
            throw new BusinessException(ErrorCode.NOT_FOUND_ERROR, "分类不存在");
        }

        return getCategoryVO(category);
    }

    @Override
    public Page<CategoryVO> listCategoriesByPage(CategoryQueryRequest categoryQueryRequest) {
        // 参数校验
        if (categoryQueryRequest == null) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR, "请求参数不能为空");
        }

        long current = categoryQueryRequest.getCurrent();
        long size = categoryQueryRequest.getPageSize();

        // 查询数据
        Page<Category> categoryPage = this.page(new Page<>(current, size),
                this.getQueryWrapper(categoryQueryRequest));

        // 转换为VO
        Page<CategoryVO> categoryVOPage = new Page<>(current, size, categoryPage.getTotal());
        List<CategoryVO> categoryVOList = getCategoryVOList(categoryPage.getRecords());
        categoryVOPage.setRecords(categoryVOList);

        return categoryVOPage;
    }

    @Override
    public List<CategoryVO> listEnabledCategories() {
        return getCategoryVOList(categoryMapper.selectEnabledCategories());
    }

    @Override
    public void validCategory(Category category, boolean isAdd) {
        if (category == null) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR, "分类信息不能为空");
        }

        String name = category.getName();
        String slug = category.getSlug();

        // 校验分类名称
        if (!StringUtils.hasText(name)) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR, "分类名称不能为空");
        }
        if (name.length() > 50) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR, "分类名称不能超过50个字符");
        }

        // 校验分类别名
        if (!StringUtils.hasText(slug)) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR, "分类别名不能为空");
        }
        if (slug.length() > 100) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR, "分类别名不能超过100个字符");
        }
        // 别名只能包含字母、数字、连字符和下划线
        if (!slug.matches("^[a-zA-Z0-9_-]+$")) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR, "分类别名只能包含字母、数字、连字符和下划线");
        }

        // 校验描述长度
        if (StringUtils.hasText(category.getDescription()) && category.getDescription().length() > 500) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR, "分类描述不能超过500个字符");
        }

        // 校验图标长度
        if (StringUtils.hasText(category.getIcon()) && category.getIcon().length() > 50) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR, "分类图标不能超过50个字符");
        }

        // 校验颜色格式
        if (StringUtils.hasText(category.getColor())) {
            if (category.getColor().length() > 20) {
                throw new BusinessException(ErrorCode.PARAMS_ERROR, "分类颜色不能超过20个字符");
            }
            // 简单的颜色格式校验（支持十六进制和颜色名称）
            if (!category.getColor().matches("^(#[0-9a-fA-F]{3,8}|[a-zA-Z]+)$")) {
                throw new BusinessException(ErrorCode.PARAMS_ERROR, "分类颜色格式不正确");
            }
        }

        // 校验排序权重
        if (category.getSortOrder() != null && category.getSortOrder() < 0) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR, "排序权重不能为负数");
        }

        // 校验状态
        if (category.getStatus() != null && (category.getStatus() < 0 || category.getStatus() > 1)) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR, "分类状态值不正确");
        }

        // 检查名称和别名的唯一性
        Long excludeId = isAdd ? null : category.getId();
        
        if (existsByName(name, excludeId)) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR, "分类名称已存在");
        }
        
        if (existsBySlug(slug, excludeId)) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR, "分类别名已存在");
        }
    }

    @Override
    public QueryWrapper<Category> getQueryWrapper(CategoryQueryRequest categoryQueryRequest) {
        QueryWrapper<Category> queryWrapper = new QueryWrapper<>();
        
        if (categoryQueryRequest == null) {
            return queryWrapper;
        }

        Long id = categoryQueryRequest.getId();
        String name = categoryQueryRequest.getName();
        String slug = categoryQueryRequest.getSlug();
        Integer status = categoryQueryRequest.getStatus();
        String searchText = categoryQueryRequest.getSearchText();
        String sortField = categoryQueryRequest.getSortField();
        String sortOrder = categoryQueryRequest.getSortOrder();

        // 拼接查询条件
        queryWrapper.eq(id != null, "id", id);
        queryWrapper.like(StringUtils.hasText(name), "name", name);
        queryWrapper.eq(StringUtils.hasText(slug), "slug", slug);
        queryWrapper.eq(status != null, "status", status);
        
        // 搜索文本（名称或描述）
        if (StringUtils.hasText(searchText)) {
            queryWrapper.and(qw -> qw.like("name", searchText).or().like("description", searchText));
        }

        // 排序
        if (StringUtils.hasText(sortField)) {
            boolean isAsc = "asc".equals(sortOrder);
            queryWrapper.orderBy(true, isAsc, sortField);
        } else {
            // 默认按排序权重升序，创建时间降序
            queryWrapper.orderByAsc("sort_order").orderByDesc("create_time");
        }

        return queryWrapper;
    }

    @Override
    public CategoryVO getCategoryVO(Category category) {
        if (category == null) {
            return null;
        }

        CategoryVO categoryVO = new CategoryVO();
        BeanUtils.copyProperties(category, categoryVO);

        // 查询文章数量
        Long articleCount = categoryMapper.countArticlesByCategory(category.getId());
        categoryVO.setArticleCount(articleCount);

        return categoryVO;
    }

    @Override
    public List<CategoryVO> getCategoryVOList(List<Category> categoryList) {
        if (categoryList == null || categoryList.isEmpty()) {
            return new ArrayList<>();
        }

        // 批量查询文章数量
        List<Long> categoryIds = categoryList.stream()
                .map(Category::getId)
                .collect(Collectors.toList());
        
        List<CategoryMapper.CategoryArticleCount> articleCounts = 
                categoryMapper.countArticlesByCategoryIds(categoryIds);
        
        Map<Long, Long> articleCountMap = articleCounts.stream()
                .collect(Collectors.toMap(
                        CategoryMapper.CategoryArticleCount::getCategoryId,
                        CategoryMapper.CategoryArticleCount::getArticleCount
                ));

        // 转换为VO
        return categoryList.stream().map(category -> {
            CategoryVO categoryVO = new CategoryVO();
            BeanUtils.copyProperties(category, categoryVO);
            
            // 设置文章数量
            Long articleCount = articleCountMap.getOrDefault(category.getId(), 0L);
            categoryVO.setArticleCount(articleCount);
            
            return categoryVO;
        }).collect(Collectors.toList());
    }

    @Override
    public Boolean existsById(Long id) {
        if (id == null || id <= 0) {
            return false;
        }
        return this.getById(id) != null;
    }

    @Override
    public Boolean existsBySlug(String slug, Long excludeId) {
        if (!StringUtils.hasText(slug)) {
            return false;
        }
        
        QueryWrapper<Category> queryWrapper = new QueryWrapper<>();
        queryWrapper.eq("slug", slug);
        if (excludeId != null) {
            queryWrapper.ne("id", excludeId);
        }
        
        return this.count(queryWrapper) > 0;
    }

    @Override
    public Boolean existsByName(String name, Long excludeId) {
        if (!org.springframework.util.StringUtils.hasText(name)) {
            return false;
        }
        
        QueryWrapper<Category> queryWrapper = new QueryWrapper<>();
        queryWrapper.eq("name", name);
        if (excludeId != null) {
            queryWrapper.ne("id", excludeId);
        }
        
        return this.count(queryWrapper) > 0;
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public Boolean updateCategorySort(List<Long> categoryIds) {
        if (categoryIds == null || categoryIds.isEmpty()) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR, "分类ID列表不能为空");
        }

        // 批量更新排序
        for (int i = 0; i < categoryIds.size(); i++) {
            Long categoryId = categoryIds.get(i);
            Category category = new Category();
            category.setId(categoryId);
            category.setSortOrder(i + 1);
            category.setUpdateTime(LocalDateTime.now());
            
            boolean result = this.updateById(category);
            if (!result) {
                throw new BusinessException(ErrorCode.OPERATION_ERROR, "更新分类排序失败");
            }
        }

        return true;
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public Boolean updateCategoryStatus(Long id, Integer status) {
        // 参数校验
        if (id == null || id <= 0) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR, "分类ID不能为空");
        }
        if (status == null || (status != 0 && status != 1)) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR, "状态值不正确");
        }

        // 检查分类是否存在
        Category category = this.getById(id);
        if (category == null) {
            throw new BusinessException(ErrorCode.NOT_FOUND_ERROR, "分类不存在");
        }

        // 更新状态
        category.setStatus(status);
        category.setUpdateTime(LocalDateTime.now());
        
        boolean result = this.updateById(category);
        if (!result) {
            throw new BusinessException(ErrorCode.OPERATION_ERROR, "更新分类状态失败");
        }

        return true;
    }

    @Override
    public CategoryVO getCategoryByArticleId(Long articleId) {
        // 参数校验
        if (articleId == null || articleId <= 0) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR, "文章ID不能为空");
        }

        // 查询分类
        Category category = categoryMapper.selectCategoryByArticleId(articleId);
        if (category == null) {
            return null; // 文章可能没有关联分类
        }

        return getCategoryVO(category);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public Boolean updateArticleCategory(Long oldCategoryId, Long newCategoryId) {
        // 参数校验
        if (oldCategoryId == null || oldCategoryId <= 0) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR, "原分类ID不能为空");
        }

        // 检查原分类是否存在
        if (!existsById(oldCategoryId)) {
            throw new BusinessException(ErrorCode.NOT_FOUND_ERROR, "原分类不存在");
        }

        // 检查新分类是否存在（如果不为null）
        if (newCategoryId != null && !existsById(newCategoryId)) {
            throw new BusinessException(ErrorCode.NOT_FOUND_ERROR, "新分类不存在");
        }

        // 执行批量更新
        int affectedRows = categoryMapper.updateArticleCategory(oldCategoryId, newCategoryId);
        log.info("批量更新文章分类，原分类ID: {}, 新分类ID: {}, 影响行数: {}", 
                oldCategoryId, newCategoryId, affectedRows);

        return affectedRows >= 0;
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public Boolean clearArticleCategoryRelation(Long categoryId) {
        // 参数校验
        if (categoryId == null || categoryId <= 0) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR, "分类ID不能为空");
        }

        // 检查分类是否存在
        if (!existsById(categoryId)) {
            throw new BusinessException(ErrorCode.NOT_FOUND_ERROR, "分类不存在");
        }

        // 清空关联关系
        int affectedRows = categoryMapper.clearArticleCategoryRelation(categoryId);
        log.info("清空分类关联关系，分类ID: {}, 影响行数: {}", categoryId, affectedRows);

        return affectedRows >= 0;
    }

    @Override
    public List<Long> getArticleIdsByCategoryId(Long categoryId, Integer status, Integer limit) {
        // 参数校验
        if (categoryId == null || categoryId <= 0) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR, "分类ID不能为空");
        }

        // 查询文章ID列表
        return categoryMapper.selectArticlesByCategoryId(categoryId, status, null, null, limit);
    }

    @Override
    public CategoryRelationInfo checkCategoryRelations(Long categoryId) {
        // 参数校验
        if (categoryId == null || categoryId <= 0) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR, "分类ID不能为空");
        }

        // 查询关联的文章数量和ID列表
        List<Long> articleIds = getArticleIdsByCategoryId(categoryId, null, null);
        Long articleCount = (long) articleIds.size();

        return new CategoryRelationInfo(articleCount, articleIds);
    }

    private static final Integer MAX_CATEGORY_DEPTH = CategoryValidator.getMaxCategoryDepth();
}