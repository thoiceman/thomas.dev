package com.xu.blogapi.controller;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.xu.blogapi.common.BaseResponse;
import com.xu.blogapi.common.ErrorCode;
import com.xu.blogapi.common.ResultUtils;
import com.xu.blogapi.exception.BusinessException;
import com.xu.blogapi.exception.CategoryException;
import com.xu.blogapi.model.dto.category.CategoryAddRequest;
import com.xu.blogapi.model.dto.category.CategoryQueryRequest;
import com.xu.blogapi.model.dto.category.CategoryUpdateRequest;
import com.xu.blogapi.model.entity.Category;
import com.xu.blogapi.model.vo.CategoryVO;
import com.xu.blogapi.model.vo.CategoryTreeVO;
import com.xu.blogapi.service.CategoryService;
import com.xu.blogapi.validator.CategoryValidator;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import javax.annotation.Resource;
import javax.validation.Valid;
import java.util.List;

/**
 * 分类控制器
 */
@RestController
@RequestMapping("/category")
@Slf4j
@Api(tags = "分类管理")
public class CategoryController {

    @Resource
    private CategoryService categoryService;

    @Resource
    private CategoryValidator categoryValidator;

    /**
     * 创建分类
     *
     * @param categoryAddRequest 分类创建请求
     * @return 分类ID
     */
    @PostMapping("/add")
    @ApiOperation(value = "创建分类")
    public BaseResponse<Long> addCategory(@Valid @RequestBody CategoryAddRequest categoryAddRequest) {
        if (categoryAddRequest == null) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR);
        }
        
        // 调用服务层创建分类
        Long categoryId = categoryService.addCategory(categoryAddRequest);
        return ResultUtils.success(categoryId);
    }

    /**
     * 更新分类
     *
     * @param categoryUpdateRequest 分类更新请求
     * @return 是否成功
     */
    @PostMapping("/update")
    @ApiOperation(value = "更新分类")
    public BaseResponse<Boolean> updateCategory(@Valid @RequestBody CategoryUpdateRequest categoryUpdateRequest) {
        if (categoryUpdateRequest == null) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR);
        }
        
        Boolean result = categoryService.updateCategory(categoryUpdateRequest);
        return ResultUtils.success(result);
    }

    /**
     * 删除分类
     *
     * @param id 分类ID
     * @return 是否成功
     */
    @PostMapping("/delete")
    @ApiOperation(value = "删除分类")
    public BaseResponse<Boolean> deleteCategory(@ApiParam(value = "分类ID", required = true) @RequestParam Long id) {
        if (id == null || id <= 0) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR);
        }
        
        Boolean result = categoryService.deleteCategory(id);
        return ResultUtils.success(result);
    }



    /**
     * 根据ID获取分类
     *
     * @param id 分类ID
     * @return 分类信息
     */
    @GetMapping("/get")
    @ApiOperation(value = "根据ID获取分类")
    public BaseResponse<CategoryVO> getCategoryById(@ApiParam(value = "分类ID", required = true) @RequestParam Long id) {
        if (id == null || id <= 0) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR);
        }
        
        CategoryVO categoryVO = categoryService.getCategoryById(id);
        return ResultUtils.success(categoryVO);
    }

    /**
     * 根据别名获取分类
     *
     * @param slug 分类别名
     * @return 分类信息
     */
    @GetMapping("/get/slug")
    @ApiOperation(value = "根据别名获取分类")
    public BaseResponse<CategoryVO> getCategoryBySlug(@ApiParam(value = "分类别名", required = true) @RequestParam String slug) {
        if (slug == null || slug.trim().isEmpty()) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR);
        }
        
        CategoryVO categoryVO = categoryService.getCategoryBySlug(slug);
        return ResultUtils.success(categoryVO);
    }

    /**
     * 分页查询分类
     *
     * @param categoryQueryRequest 查询请求
     * @return 分页结果
     */
    @PostMapping("/list/page")
    @ApiOperation(value = "分页查询分类")
    public BaseResponse<Page<CategoryVO>> listCategoriesByPage(@Valid @RequestBody CategoryQueryRequest categoryQueryRequest) {
        if (categoryQueryRequest == null) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR);
        }
        
        Page<CategoryVO> categoryVOPage = categoryService.listCategoriesByPage(categoryQueryRequest);
        return ResultUtils.success(categoryVOPage);
    }

    /**
     * 获取所有启用的分类
     *
     * @return 分类列表
     */
    @GetMapping("/list/enabled")
    @ApiOperation(value = "获取所有启用的分类")
    public BaseResponse<List<CategoryVO>> listEnabledCategories() {
        List<CategoryVO> categoryVOList = categoryService.listEnabledCategories();
        return ResultUtils.success(categoryVOList);
    }

    /**
     * 更新分类排序
     *
     * @param categoryIds 分类ID列表（按新的排序顺序）
     * @return 是否成功
     */
    @PostMapping("/sort")
    @ApiOperation(value = "更新分类排序")
    public BaseResponse<Boolean> updateCategorySort(@ApiParam(value = "分类ID列表", required = true) @RequestBody List<Long> categoryIds) {
        if (categoryIds == null || categoryIds.isEmpty()) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR);
        }
        
        Boolean result = categoryService.updateCategorySort(categoryIds);
        return ResultUtils.success(result);
    }

    /**
     * 启用/禁用分类
     *
     * @param id     分类ID
     * @param status 状态（0-禁用，1-启用）
     * @return 是否成功
     */
    @PostMapping("/status")
    @ApiOperation(value = "启用/禁用分类")
    public BaseResponse<Boolean> updateCategoryStatus(
            @ApiParam(value = "分类ID", required = true) @RequestParam Long id,
            @ApiParam(value = "状态（0-禁用，1-启用）", required = true) @RequestParam Integer status) {
        
        if (id == null || id <= 0) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR, "分类ID不能为空");
        }
        if (status == null || (status != 0 && status != 1)) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR, "状态值不正确");
        }
        
        Boolean result = categoryService.updateCategoryStatus(id, status);
        return ResultUtils.success(result);
    }

    /**
     * 检查分类别名是否存在
     *
     * @param slug      分类别名
     * @param excludeId 排除的分类ID（可选）
     * @return 是否存在
     */
    @GetMapping("/check/slug")
    @ApiOperation(value = "检查分类别名是否存在")
    public BaseResponse<Boolean> checkSlugExists(
            @ApiParam(value = "分类别名", required = true) @RequestParam String slug,
            @ApiParam(value = "排除的分类ID") @RequestParam(required = false) Long excludeId) {
        
        if (slug == null || slug.trim().isEmpty()) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR, "分类别名不能为空");
        }
        
        Boolean exists = categoryService.existsBySlug(slug, excludeId);
        return ResultUtils.success(exists);
    }

    /**
     * 检查分类名称是否存在
     *
     * @param name      分类名称
     * @param excludeId 排除的分类ID（可选）
     * @return 是否存在
     */
    @GetMapping("/check/name")
    @ApiOperation(value = "检查分类名称是否存在")
    public BaseResponse<Boolean> checkNameExists(
            @ApiParam(value = "分类名称", required = true) @RequestParam String name,
            @ApiParam(value = "排除的分类ID") @RequestParam(required = false) Long excludeId) {
        
        if (name == null || name.trim().isEmpty()) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR, "分类名称不能为空");
        }
        
        Boolean exists = categoryService.existsByName(name, excludeId);
        return ResultUtils.success(exists);
    }


}