package com.xu.blogapi.service;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.IService;
import com.xu.blogapi.model.dto.category.CategoryAddRequest;
import com.xu.blogapi.model.dto.category.CategoryQueryRequest;
import com.xu.blogapi.model.dto.category.CategoryUpdateRequest;
import com.xu.blogapi.model.entity.Category;
import com.xu.blogapi.model.vo.CategoryVO;
import com.xu.blogapi.model.vo.CategoryTreeVO;

import java.util.List;

/**
 * 分类服务接口
 */
public interface CategoryService extends IService<Category> {

    /**
     * 创建分类
     *
     * @param categoryAddRequest 分类创建请求
     * @return 分类ID
     */
    Long addCategory(CategoryAddRequest categoryAddRequest);

    /**
     * 更新分类
     *
     * @param categoryUpdateRequest 分类更新请求
     * @return 是否成功
     */
    Boolean updateCategory(CategoryUpdateRequest categoryUpdateRequest);

    /**
     * 删除分类
     *
     * @param id 分类ID
     * @return 是否成功
     */
    Boolean deleteCategory(Long id);

    /**
     * 根据ID获取分类
     *
     * @param id 分类ID
     * @return 分类信息
     */
    CategoryVO getCategoryById(Long id);

    /**
     * 根据别名获取分类
     *
     * @param slug 分类别名
     * @return 分类信息
     */
    CategoryVO getCategoryBySlug(String slug);

    /**
     * 分页查询分类
     *
     * @param categoryQueryRequest 查询请求
     * @return 分页结果
     */
    Page<CategoryVO> listCategoriesByPage(CategoryQueryRequest categoryQueryRequest);

    /**
     * 获取所有启用的分类
     *
     * @return 分类列表
     */
    List<CategoryVO> listEnabledCategories();

    /**
     * 校验分类数据
     *
     * @param category 分类信息
     * @param isAdd    是否为新增操作
     */
    void validCategory(Category category, boolean isAdd);

    /**
     * 获取查询条件
     *
     * @param categoryQueryRequest 查询请求
     * @return 查询条件
     */
    QueryWrapper<Category> getQueryWrapper(CategoryQueryRequest categoryQueryRequest);

    /**
     * 将实体转换为VO
     *
     * @param category 分类实体
     * @return 分类VO
     */
    CategoryVO getCategoryVO(Category category);

    /**
     * 批量将实体转换为VO
     *
     * @param categoryList 分类实体列表
     * @return 分类VO列表
     */
    List<CategoryVO> getCategoryVOList(List<Category> categoryList);

    /**
     * 检查分类是否存在
     *
     * @param id 分类ID
     * @return 是否存在
     */
    Boolean existsById(Long id);

    /**
     * 检查分类别名是否存在
     *
     * @param slug      分类别名
     * @param excludeId 排除的分类ID（用于更新时检查）
     * @return 是否存在
     */
    Boolean existsBySlug(String slug, Long excludeId);

    /**
     * 检查分类名称是否存在
     *
     * @param name      分类名称
     * @param excludeId 排除的分类ID（用于更新时检查）
     * @return 是否存在
     */
    Boolean existsByName(String name, Long excludeId);

    /**
     * 更新分类排序
     *
     * @param categoryIds 分类ID列表（按新的排序顺序）
     * @return 是否成功
     */
    Boolean updateCategorySort(List<Long> categoryIds);

    /**
     * 启用/禁用分类
     *
     * @param id     分类ID
     * @param status 状态（0-禁用，1-启用）
     * @return 是否成功
     */
    Boolean updateCategoryStatus(Long id, Integer status);

    /**
     * 根据文章ID获取分类信息
     *
     * @param articleId 文章ID
     * @return 分类信息
     */
    CategoryVO getCategoryByArticleId(Long articleId);

    /**
     * 批量更新文章的分类
     *
     * @param oldCategoryId 原分类ID
     * @param newCategoryId 新分类ID
     * @return 是否成功
     */
    Boolean updateArticleCategory(Long oldCategoryId, Long newCategoryId);

    /**
     * 清空指定分类下所有文章的分类关联
     *
     * @param categoryId 分类ID
     * @return 是否成功
     */
    Boolean clearArticleCategoryRelation(Long categoryId);

    /**
     * 获取分类下的文章ID列表
     *
     * @param categoryId 分类ID
     * @param status     文章状态（可选，null表示所有状态）
     * @param limit      限制数量（可选，null表示不限制）
     * @return 文章ID列表
     */
    List<Long> getArticleIdsByCategoryId(Long categoryId, Integer status, Integer limit);

    /**
     * 检查分类删除前的关联关系
     * @param categoryId 分类ID
     * @return 关联关系信息
     */
    CategoryRelationInfo checkCategoryRelations(Long categoryId);

    /**
     * 分类关联信息类
     */
    class CategoryRelationInfo {
        private Long articleCount;
        private List<Long> articleIds;

        public CategoryRelationInfo(Long articleCount, List<Long> articleIds) {
            this.articleCount = articleCount;
            this.articleIds = articleIds;
        }

        public Long getArticleCount() {
            return articleCount;
        }

        public void setArticleCount(Long articleCount) {
            this.articleCount = articleCount;
        }

        public List<Long> getArticleIds() {
            return articleIds;
        }

        public void setArticleIds(List<Long> articleIds) {
            this.articleIds = articleIds;
        }
    }
}