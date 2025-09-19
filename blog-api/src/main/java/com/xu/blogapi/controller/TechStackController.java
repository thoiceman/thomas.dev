package com.xu.blogapi.controller;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.xu.blogapi.common.BaseResponse;
import com.xu.blogapi.common.ResultUtils;
import com.xu.blogapi.model.dto.techstack.TechStackAddRequest;
import com.xu.blogapi.model.dto.techstack.TechStackQueryRequest;
import com.xu.blogapi.model.dto.techstack.TechStackUpdateRequest;
import com.xu.blogapi.model.dto.techstack.TechStackResponse;
import com.xu.blogapi.service.TechStackService;
import com.xu.blogapi.validator.TechStackValidator;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import javax.annotation.Resource;
import javax.validation.Valid;
import java.util.List;

/**
 * 技术栈接口控制器
 *
 * @author xu
 */
@RestController
@RequestMapping("/techstack")
@Slf4j
@Api(tags = "技术栈管理接口")
public class TechStackController {

    @Resource
    private TechStackService techStackService;

    @Resource
    private TechStackValidator techStackValidator;

    /**
     * 创建技术栈
     *
     * @param techStackAddRequest 技术栈添加请求
     * @return 技术栈ID
     */
    @PostMapping("/add")
    @ApiOperation(value = "创建技术栈")
    public BaseResponse<Long> addTechStack(@Valid @RequestBody TechStackAddRequest techStackAddRequest) {
        // 参数验证
        techStackValidator.validateTechStackAddRequest(techStackAddRequest);
        
        Long techStackId = techStackService.addTechStack(techStackAddRequest);
        return ResultUtils.success(techStackId);
    }

    /**
     * 删除技术栈
     *
     * @param id 技术栈ID
     * @return 是否删除成功
     */
    @PostMapping("/delete")
    @ApiOperation(value = "删除技术栈")
    public BaseResponse<Boolean> deleteTechStack(@ApiParam(value = "技术栈ID", required = true) @RequestParam Long id) {
        // 参数验证
        techStackValidator.validateTechStackId(id);
        
        Boolean result = techStackService.deleteTechStack(id);
        return ResultUtils.success(result);
    }

    /**
     * 更新技术栈
     *
     * @param techStackUpdateRequest 技术栈更新请求
     * @return 是否更新成功
     */
    @PostMapping("/update")
    @ApiOperation(value = "更新技术栈")
    public BaseResponse<Boolean> updateTechStack(@Valid @RequestBody TechStackUpdateRequest techStackUpdateRequest) {
        // 参数验证
        techStackValidator.validateTechStackUpdateRequest(techStackUpdateRequest);
        
        Boolean result = techStackService.updateTechStack(techStackUpdateRequest);
        return ResultUtils.success(result);
    }

    /**
     * 根据ID获取技术栈
     *
     * @param id 技术栈ID
     * @return 技术栈信息
     */
    @GetMapping("/get")
    @ApiOperation(value = "根据ID获取技术栈")
    public BaseResponse<TechStackResponse> getTechStackById(@ApiParam(value = "技术栈ID", required = true) @RequestParam Long id) {
        // 参数验证
        techStackValidator.validateTechStackId(id);
        
        TechStackResponse techStackResponse = techStackService.getTechStackById(id);
        return ResultUtils.success(techStackResponse);
    }

    /**
     * 根据名称获取技术栈
     *
     * @param name 技术栈名称
     * @return 技术栈信息
     */
    @GetMapping("/get/name")
    @ApiOperation(value = "根据名称获取技术栈")
    public BaseResponse<TechStackResponse> getTechStackByName(@ApiParam(value = "技术栈名称", required = true) @RequestParam String name) {
        // 参数验证
        techStackValidator.validateTechStackName(name);
        
        TechStackResponse techStackResponse = techStackService.getTechStackByName(name);
        return ResultUtils.success(techStackResponse);
    }

    /**
     * 分页获取技术栈列表
     *
     * @param techStackQueryRequest 技术栈查询请求
     * @return 分页结果
     */
    @PostMapping("/list/page")
    @ApiOperation(value = "分页获取技术栈列表")
    public BaseResponse<IPage<TechStackResponse>> listTechStacksByPage(@RequestBody TechStackQueryRequest techStackQueryRequest) {
        // 参数验证
        if (techStackQueryRequest == null) {
            techStackQueryRequest = new TechStackQueryRequest();
        }
        techStackValidator.validateTechStackQueryRequest(techStackQueryRequest);
        
        IPage<TechStackResponse> techStackPage = techStackService.listTechStacksByPage(techStackQueryRequest);
        return ResultUtils.success(techStackPage);
    }

    /**
     * 获取所有技术栈
     *
     * @return 技术栈列表
     */
    @GetMapping("/list/all")
    @ApiOperation(value = "获取所有技术栈")
    public BaseResponse<List<TechStackResponse>> listAllTechStacks() {
        List<TechStackResponse> techStackList = techStackService.listAllTechStacks();
        return ResultUtils.success(techStackList);
    }

    /**
     * 根据分类获取技术栈列表
     *
     * @param category 技术分类
     * @return 技术栈列表
     */
    @GetMapping("/list/category")
    @ApiOperation(value = "根据分类获取技术栈列表")
    public BaseResponse<List<TechStackResponse>> listTechStacksByCategory(
            @ApiParam(value = "技术分类", required = true) @RequestParam String category) {
        // 参数验证
        techStackValidator.validateTechStackCategory(category);
        
        List<TechStackResponse> techStackList = techStackService.listTechStacksByCategory(category);
        return ResultUtils.success(techStackList);
    }

    /**
     * 获取所有技术分类
     *
     * @return 分类列表
     */
    @GetMapping("/list/categories")
    @ApiOperation(value = "获取所有技术分类")
    public BaseResponse<List<String>> listAllCategories() {
        List<String> categories = techStackService.listAllCategories();
        return ResultUtils.success(categories);
    }

    /**
     * 检查技术栈名称是否存在
     *
     * @param name 技术栈名称
     * @return 是否存在
     */
    @GetMapping("/exists/name")
    @ApiOperation(value = "检查技术栈名称是否存在")
    public BaseResponse<Boolean> existsByName(@ApiParam(value = "技术栈名称", required = true) @RequestParam String name) {
        // 参数验证
        techStackValidator.validateTechStackName(name);
        
        Boolean exists = techStackService.existsByName(name);
        return ResultUtils.success(exists);
    }

    /**
     * 检查技术栈是否存在（排除指定ID）
     *
     * @param name      技术栈名称
     * @param excludeId 排除的ID
     * @return 是否存在
     */
    @GetMapping("/exists/name/exclude")
    @ApiOperation(value = "检查技术栈名称是否存在（排除指定ID）")
    public BaseResponse<Boolean> existsByNameAndNotId(
            @ApiParam(value = "技术栈名称", required = true) @RequestParam String name,
            @ApiParam(value = "排除的ID", required = true) @RequestParam Long excludeId) {
        // 参数验证
        techStackValidator.validateTechStackName(name);
        techStackValidator.validateTechStackId(excludeId);
        
        Boolean exists = techStackService.existsByNameAndNotId(name, excludeId);
        return ResultUtils.success(exists);
    }
}