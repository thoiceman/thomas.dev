package com.xu.blogapi.service;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.IService;
import com.xu.blogapi.model.dto.travel.TravelAddRequest;
import com.xu.blogapi.model.dto.travel.TravelQueryRequest;
import com.xu.blogapi.model.dto.travel.TravelUpdateRequest;
import com.xu.blogapi.model.entity.Travel;
import com.xu.blogapi.model.entity.User;

import java.util.List;

/**
 * 旅行记录服务接口
 *
 * @author xu
 */
public interface TravelService extends IService<Travel> {

    /**
     * 创建旅行记录
     *
     * @param travelAddRequest 旅行记录创建请求
     * @param loginUser        当前登录用户
     * @return 旅行记录ID
     */
    Long addTravel(TravelAddRequest travelAddRequest, User loginUser);

    /**
     * 更新旅行记录
     *
     * @param travelUpdateRequest 旅行记录更新请求
     * @param loginUser           当前登录用户
     * @return 是否成功
     */
    Boolean updateTravel(TravelUpdateRequest travelUpdateRequest, User loginUser);

    /**
     * 删除旅行记录（逻辑删除）
     *
     * @param id        旅行记录ID
     * @param loginUser 当前登录用户
     * @return 是否成功
     */
    Boolean deleteTravel(Long id, User loginUser);

    /**
     * 根据ID获取旅行记录
     *
     * @param id        旅行记录ID
     * @param loginUser 当前登录用户
     * @return 旅行记录
     */
    Travel getTravelById(Long id, User loginUser);

    /**
     * 分页查询旅行记录
     *
     * @param travelQueryRequest 查询请求
     * @param loginUser          当前登录用户
     * @return 分页结果
     */
    Page<Travel> listTravelsByPage(TravelQueryRequest travelQueryRequest, User loginUser);

    /**
     * 根据作者查询旅行记录列表
     *
     * @param authorId  作者ID
     * @param loginUser 当前登录用户
     * @return 旅行记录列表
     */
    List<Travel> listTravelsByAuthor(Long authorId, User loginUser);

    /**
     * 根据目的地查询旅行记录列表
     *
     * @param destination 目的地
     * @param loginUser   当前登录用户
     * @return 旅行记录列表
     */
    List<Travel> listTravelsByDestination(String destination, User loginUser);

    /**
     * 根据国家查询旅行记录列表
     *
     * @param country   国家
     * @param loginUser 当前登录用户
     * @return 旅行记录列表
     */
    List<Travel> listTravelsByCountry(String country, User loginUser);

    /**
     * 根据城市查询旅行记录列表
     *
     * @param city      城市
     * @param loginUser 当前登录用户
     * @return 旅行记录列表
     */
    List<Travel> listTravelsByCity(String city, User loginUser);

    /**
     * 查询公开的旅行记录列表
     *
     * @param loginUser 当前登录用户
     * @return 公开旅行记录列表
     */
    List<Travel> listPublicTravels(User loginUser);

    /**
     * 查询高评分旅行记录列表（4星及以上）
     *
     * @param loginUser 当前登录用户
     * @return 高评分旅行记录列表
     */
    List<Travel> listHighRatedTravels(User loginUser);

    /**
     * 根据评分查询旅行记录列表
     *
     * @param rating    评分
     * @param loginUser 当前登录用户
     * @return 旅行记录列表
     */
    List<Travel> listTravelsByRating(Integer rating, User loginUser);

    /**
     * 校验旅行记录数据
     *
     * @param travel 旅行记录
     */
    void validTravel(Travel travel);

    /**
     * 检查旅行记录是否存在
     *
     * @param id 旅行记录ID
     * @return 是否存在
     */
    Boolean existsById(Long id);

    /**
     * 统计用户的旅行记录数量
     *
     * @param authorId 作者ID
     * @return 旅行记录数量
     */
    Long countUserTravels(Long authorId);

    /**
     * 统计公开旅行记录数量
     *
     * @return 公开旅行记录数量
     */
    Long countPublicTravels();

    /**
     * 统计高评分旅行记录数量
     *
     * @return 高评分旅行记录数量
     */
    Long countHighRatedTravels();

    /**
     * 根据评分统计旅行记录数量
     *
     * @param rating 评分
     * @return 旅行记录数量
     */
    Long countTravelsByRating(Integer rating);
}