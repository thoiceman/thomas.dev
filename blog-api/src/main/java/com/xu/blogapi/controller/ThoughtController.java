package com.xu.blogapi.controller;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.xu.blogapi.common.BaseResponse;
import com.xu.blogapi.common.DeleteRequest;
import com.xu.blogapi.common.ErrorCode;
import com.xu.blogapi.common.ResultUtils;
import com.xu.blogapi.exception.BusinessException;
import com.xu.blogapi.model.dto.thought.ThoughtAddRequest;
import com.xu.blogapi.model.dto.thought.ThoughtQueryRequest;
import com.xu.blogapi.model.dto.thought.ThoughtResponse;
import com.xu.blogapi.model.dto.thought.ThoughtUpdateRequest;
import com.xu.blogapi.model.entity.Thought;
import com.xu.blogapi.model.entity.User;
import com.xu.blogapi.service.ThoughtService;
import com.xu.blogapi.service.UserService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.BeanUtils;
import org.springframework.web.bind.annotation.*;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.validation.Valid;
import java.util.List;
import java.util.stream.Collectors;

/**
 * 想法控制器
 *
 * @author xu
 */
@RestController
@RequestMapping("/thought")
@Slf4j
@Api(tags = "想法管理")
public class ThoughtController {

    @Resource
    private ThoughtService thoughtService;

    @Resource
    private UserService userService;

    /**
     * 创建想法
     *
     * @param thoughtAddRequest 想法创建请求
     * @param request           HTTP请求
     * @return 想法ID
     */
    @PostMapping("/add")
    @ApiOperation(value = "创建想法")
    public BaseResponse<Long> addThought(@RequestBody @Valid ThoughtAddRequest thoughtAddRequest,
                                        HttpServletRequest request) {
        if (thoughtAddRequest == null) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR);
        }

        // 获取当前登录用户
        User loginUser = userService.getLoginUser();
        
        // 创建想法
        Long thoughtId = thoughtService.addThought(thoughtAddRequest, loginUser);
        
        return ResultUtils.success(thoughtId);
    }

    /**
     * 删除想法
     *
     * @param deleteRequest 删除请求
     * @param request       HTTP请求
     * @return 是否成功
     */
    @PostMapping("/delete")
    @ApiOperation(value = "删除想法")
    public BaseResponse<Boolean> deleteThought(@RequestBody DeleteRequest deleteRequest,
                                              HttpServletRequest request) {
        if (deleteRequest == null || deleteRequest.getId() == null) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR);
        }

        // 获取当前登录用户
        User loginUser = userService.getLoginUser();
        
        // 删除想法
        Boolean result = thoughtService.deleteThought(deleteRequest.getId(), loginUser);
        
        return ResultUtils.success(result);
    }

    /**
     * 更新想法
     *
     * @param thoughtUpdateRequest 想法更新请求
     * @param request              HTTP请求
     * @return 是否成功
     */
    @PostMapping("/update")
    @ApiOperation(value = "更新想法")
    public BaseResponse<Boolean> updateThought(@RequestBody @Valid ThoughtUpdateRequest thoughtUpdateRequest,
                                              HttpServletRequest request) {
        if (thoughtUpdateRequest == null || thoughtUpdateRequest.getId() == null) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR);
        }

        // 获取当前登录用户
        User loginUser = userService.getLoginUser();
        
        // 更新想法
        Boolean result = thoughtService.updateThought(thoughtUpdateRequest, loginUser);
        
        return ResultUtils.success(result);
    }

    /**
     * 根据ID获取想法
     *
     * @param id      想法ID
     * @param request HTTP请求
     * @return 想法信息
     */
    @GetMapping("/get")
    @ApiOperation(value = "根据ID获取想法")
    public BaseResponse<ThoughtResponse> getThoughtById(@RequestParam("id") Long id,
                                                       HttpServletRequest request) {
        if (id == null || id <= 0) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR);
        }

        // 获取当前登录用户（可能为空）
        User loginUser = userService.getLoginUserPermitNull();
        
        // 获取想法
        Thought thought = thoughtService.getThoughtById(id, loginUser);
        
        // 转换为响应对象
        ThoughtResponse thoughtResponse = new ThoughtResponse();
        BeanUtils.copyProperties(thought, thoughtResponse);
        
        return ResultUtils.success(thoughtResponse);
    }

    /**
     * 分页获取想法列表
     *
     * @param thoughtQueryRequest 查询请求
     * @param request             HTTP请求
     * @return 分页结果
     */
    @PostMapping("/list/page")
    @ApiOperation(value = "分页获取想法列表")
    public BaseResponse<Page<ThoughtResponse>> listThoughtsByPage(@RequestBody ThoughtQueryRequest thoughtQueryRequest,
                                                                 HttpServletRequest request) {
        if (thoughtQueryRequest == null) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR);
        }

        // 获取当前登录用户（可能为空）
        User loginUser = userService.getLoginUserPermitNull();
        
        // 分页查询
        Page<Thought> thoughtPage = thoughtService.listThoughtsByPage(thoughtQueryRequest, loginUser);
        
        // 转换为响应对象
        Page<ThoughtResponse> thoughtResponsePage = new Page<>(
                thoughtPage.getCurrent(),
                thoughtPage.getSize(),
                thoughtPage.getTotal()
        );
        
        List<ThoughtResponse> thoughtResponseList = thoughtPage.getRecords().stream()
                .map(thought -> {
                    ThoughtResponse thoughtResponse = new ThoughtResponse();
                    BeanUtils.copyProperties(thought, thoughtResponse);
                    return thoughtResponse;
                })
                .collect(Collectors.toList());
        
        thoughtResponsePage.setRecords(thoughtResponseList);
        
        return ResultUtils.success(thoughtResponsePage);
    }







    /**
     * 统计用户想法数量
     *
     * @param authorId 作者ID
     * @return 想法数量
     */
    @GetMapping("/count/user")
    @ApiOperation(value = "统计用户想法数量")
    public BaseResponse<Long> countUserThoughts(@RequestParam("authorId") Long authorId) {
        if (authorId == null || authorId <= 0) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR);
        }

        Long count = thoughtService.countUserThoughts(authorId);
        return ResultUtils.success(count);
    }




}