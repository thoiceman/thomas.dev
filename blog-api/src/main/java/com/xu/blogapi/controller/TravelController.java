package com.xu.blogapi.controller;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.xu.blogapi.common.BaseResponse;
import com.xu.blogapi.common.DeleteRequest;
import com.xu.blogapi.common.ErrorCode;
import com.xu.blogapi.common.ResultUtils;
import com.xu.blogapi.exception.BusinessException;
import com.xu.blogapi.model.dto.travel.TravelAddRequest;
import com.xu.blogapi.model.dto.travel.TravelQueryRequest;
import com.xu.blogapi.model.dto.travel.TravelUpdateRequest;
import com.xu.blogapi.model.entity.Travel;
import com.xu.blogapi.model.entity.User;
import com.xu.blogapi.service.TravelService;
import com.xu.blogapi.service.UserService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.validation.Valid;
import java.util.List;

/**
 * 旅行记录控制器
 *
 * @author xu
 */
@RestController
@RequestMapping("/travel")
@Slf4j
@Api(tags = "旅行记录管理")
public class TravelController {

    @Resource
    private TravelService travelService;

    @Resource
    private UserService userService;

    /**
     * 创建旅行记录
     *
     * @param travelAddRequest 旅行记录创建请求
     * @param request          HTTP请求
     * @return 旅行记录ID
     */
    @PostMapping("/add")
    @ApiOperation(value = "创建旅行记录")
    public BaseResponse<Long> addTravel(@RequestBody @Valid TravelAddRequest travelAddRequest,
                                        HttpServletRequest request) {
        if (travelAddRequest == null) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR);
        }
        User loginUser = userService.getLoginUser();
        Long travelId = travelService.addTravel(travelAddRequest, loginUser);
        return ResultUtils.success(travelId);
    }

    /**
     * 删除旅行记录
     *
     * @param deleteRequest 删除请求
     * @param request       HTTP请求
     * @return 是否成功
     */
    @PostMapping("/delete")
    @ApiOperation(value = "删除旅行记录")
    public BaseResponse<Boolean> deleteTravel(@RequestBody DeleteRequest deleteRequest,
                                              HttpServletRequest request) {
        if (deleteRequest == null || deleteRequest.getId() <= 0) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR);
        }
        User loginUser = userService.getLoginUser();
        Boolean result = travelService.deleteTravel(deleteRequest.getId(), loginUser);
        return ResultUtils.success(result);
    }

    /**
     * 更新旅行记录
     *
     * @param travelUpdateRequest 旅行记录更新请求
     * @param request             HTTP请求
     * @return 是否成功
     */
    @PostMapping("/update")
    @ApiOperation(value = "更新旅行记录")
    public BaseResponse<Boolean> updateTravel(@RequestBody @Valid TravelUpdateRequest travelUpdateRequest,
                                              HttpServletRequest request) {
        if (travelUpdateRequest == null || travelUpdateRequest.getId() == null) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR);
        }
        User loginUser = userService.getLoginUser();
        Boolean result = travelService.updateTravel(travelUpdateRequest, loginUser);
        return ResultUtils.success(result);
    }

    /**
     * 根据ID获取旅行记录
     *
     * @param id      旅行记录ID
     * @param request HTTP请求
     * @return 旅行记录信息
     */
    @GetMapping("/get")
    @ApiOperation(value = "根据ID获取旅行记录")
    public BaseResponse<Travel> getTravelById(@RequestParam("id") Long id,
                                              HttpServletRequest request) {
        if (id == null || id <= 0) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR);
        }
        User loginUser = userService.getLoginUserPermitNull();
        Travel travel = travelService.getTravelById(id, loginUser);
        return ResultUtils.success(travel);
    }

    /**
     * 分页获取旅行记录列表
     *
     * @param travelQueryRequest 查询请求
     * @param request            HTTP请求
     * @return 分页旅行记录列表
     */
    @PostMapping("/list/page")
    @ApiOperation(value = "分页获取旅行记录列表")
    public BaseResponse<Page<Travel>> listTravelsByPage(@RequestBody TravelQueryRequest travelQueryRequest,
                                                        HttpServletRequest request) {
        if (travelQueryRequest == null) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR);
        }
        User loginUser = userService.getLoginUserPermitNull();
        Page<Travel> travelPage = travelService.listTravelsByPage(travelQueryRequest, loginUser);
        return ResultUtils.success(travelPage);
    }

    /**
     * 获取公开旅行记录列表
     *
     * @param request HTTP请求
     * @return 公开旅行记录列表
     */
    @GetMapping("/list/public")
    @ApiOperation(value = "获取公开旅行记录列表")
    public BaseResponse<List<Travel>> listPublicTravels(HttpServletRequest request) {
        User loginUser = userService.getLoginUserPermitNull();
        List<Travel> travels = travelService.listPublicTravels(loginUser);
        return ResultUtils.success(travels);
    }

    /**
     * 获取高评分旅行记录列表
     *
     * @param request HTTP请求
     * @return 高评分旅行记录列表
     */
    @GetMapping("/list/high-rated")
    @ApiOperation(value = "获取高评分旅行记录列表")
    public BaseResponse<List<Travel>> listHighRatedTravels(HttpServletRequest request) {
        User loginUser = userService.getLoginUserPermitNull();
        List<Travel> travels = travelService.listHighRatedTravels(loginUser);
        return ResultUtils.success(travels);
    }

    /**
     * 根据作者ID获取旅行记录列表
     *
     * @param authorId 作者ID
     * @param request  HTTP请求
     * @return 旅行记录列表
     */
    @GetMapping("/list/author")
    @ApiOperation(value = "根据作者ID获取旅行记录列表")
    public BaseResponse<List<Travel>> listTravelsByAuthor(@RequestParam("authorId") Long authorId,
                                                          HttpServletRequest request) {
        if (authorId == null || authorId <= 0) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR);
        }
        User loginUser = userService.getLoginUserPermitNull();
        List<Travel> travels = travelService.listTravelsByAuthor(authorId, loginUser);
        return ResultUtils.success(travels);
    }

    /**
     * 根据目的地获取旅行记录列表
     *
     * @param destination 目的地
     * @param request     HTTP请求
     * @return 旅行记录列表
     */
    @GetMapping("/list/destination")
    @ApiOperation(value = "根据目的地获取旅行记录列表")
    public BaseResponse<List<Travel>> listTravelsByDestination(@RequestParam("destination") String destination,
                                                               HttpServletRequest request) {
        if (destination == null || destination.trim().isEmpty()) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR, "目的地不能为空");
        }
        User loginUser = userService.getLoginUserPermitNull();
        List<Travel> travels = travelService.listTravelsByDestination(destination, loginUser);
        return ResultUtils.success(travels);
    }

    /**
     * 根据国家获取旅行记录列表
     *
     * @param country 国家
     * @param request HTTP请求
     * @return 旅行记录列表
     */
    @GetMapping("/list/country")
    @ApiOperation(value = "根据国家获取旅行记录列表")
    public BaseResponse<List<Travel>> listTravelsByCountry(@RequestParam("country") String country,
                                                           HttpServletRequest request) {
        if (country == null || country.trim().isEmpty()) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR, "国家不能为空");
        }
        User loginUser = userService.getLoginUserPermitNull();
        List<Travel> travels = travelService.listTravelsByCountry(country, loginUser);
        return ResultUtils.success(travels);
    }

    /**
     * 根据城市获取旅行记录列表
     *
     * @param city    城市
     * @param request HTTP请求
     * @return 旅行记录列表
     */
    @GetMapping("/list/city")
    @ApiOperation(value = "根据城市获取旅行记录列表")
    public BaseResponse<List<Travel>> listTravelsByCity(@RequestParam("city") String city,
                                                        HttpServletRequest request) {
        if (city == null || city.trim().isEmpty()) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR, "城市不能为空");
        }
        User loginUser = userService.getLoginUserPermitNull();
        List<Travel> travels = travelService.listTravelsByCity(city, loginUser);
        return ResultUtils.success(travels);
    }

    /**
     * 根据评分获取旅行记录列表
     *
     * @param rating  评分
     * @param request HTTP请求
     * @return 旅行记录列表
     */
    @GetMapping("/list/rating")
    @ApiOperation(value = "根据评分获取旅行记录列表")
    public BaseResponse<List<Travel>> listTravelsByRating(@RequestParam("rating") Integer rating,
                                                          HttpServletRequest request) {
        if (rating == null || rating < 1 || rating > 5) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR, "评分必须在1-5之间");
        }
        User loginUser = userService.getLoginUserPermitNull();
        List<Travel> travels = travelService.listTravelsByRating(rating, loginUser);
        return ResultUtils.success(travels);
    }

    /**
     * 统计用户旅行记录数量
     *
     * @param authorId 作者ID
     * @param request  HTTP请求
     * @return 旅行记录数量
     */
    @GetMapping("/count/author")
    @ApiOperation(value = "统计用户旅行记录数量")
    public BaseResponse<Long> countUserTravels(@RequestParam("authorId") Long authorId,
                                               HttpServletRequest request) {
        if (authorId == null || authorId <= 0) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR);
        }
        Long count = travelService.countUserTravels(authorId);
        return ResultUtils.success(count);
    }

    /**
     * 统计公开旅行记录数量
     *
     * @param request HTTP请求
     * @return 公开旅行记录数量
     */
    @GetMapping("/count/public")
    @ApiOperation(value = "统计公开旅行记录数量")
    public BaseResponse<Long> countPublicTravels(HttpServletRequest request) {
        Long count = travelService.countPublicTravels();
        return ResultUtils.success(count);
    }

    /**
     * 统计高评分旅行记录数量
     *
     * @param request HTTP请求
     * @return 高评分旅行记录数量
     */
    @GetMapping("/count/high-rated")
    @ApiOperation(value = "统计高评分旅行记录数量")
    public BaseResponse<Long> countHighRatedTravels(HttpServletRequest request) {
        Long count = travelService.countHighRatedTravels();
        return ResultUtils.success(count);
    }

    /**
     * 统计指定评分的旅行记录数量
     *
     * @param rating  评分
     * @param request HTTP请求
     * @return 旅行记录数量
     */
    @GetMapping("/count/rating")
    @ApiOperation(value = "统计指定评分的旅行记录数量")
    public BaseResponse<Long> countTravelsByRating(@RequestParam("rating") Integer rating,
                                                   HttpServletRequest request) {
        if (rating == null || rating < 1 || rating > 5) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR, "评分必须在1-5之间");
        }
        Long count = travelService.countTravelsByRating(rating);
        return ResultUtils.success(count);
    }
}