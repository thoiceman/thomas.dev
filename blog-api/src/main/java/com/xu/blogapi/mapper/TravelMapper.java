package com.xu.blogapi.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.xu.blogapi.model.entity.Travel;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

/**
 * 旅行记录数据访问层
 *
 * @author xu
 */
public interface TravelMapper extends BaseMapper<Travel> {

    /**
     * 根据作者ID查询旅行记录列表
     *
     * @param authorId 作者ID
     * @return 旅行记录列表
     */
    @Select("SELECT * FROM travel WHERE author_id = #{authorId} AND is_delete = 0 ORDER BY start_date DESC, create_time DESC")
    List<Travel> selectByAuthorId(@Param("authorId") Long authorId);

    /**
     * 根据目的地查询旅行记录列表
     *
     * @param destination 目的地
     * @return 旅行记录列表
     */
    @Select("SELECT * FROM travel WHERE destination LIKE CONCAT('%', #{destination}, '%') AND is_delete = 0 ORDER BY start_date DESC, create_time DESC")
    List<Travel> selectByDestination(@Param("destination") String destination);

    /**
     * 根据国家查询旅行记录列表
     *
     * @param country 国家
     * @return 旅行记录列表
     */
    @Select("SELECT * FROM travel WHERE country = #{country} AND is_delete = 0 ORDER BY start_date DESC, create_time DESC")
    List<Travel> selectByCountry(@Param("country") String country);

    /**
     * 根据城市查询旅行记录列表
     *
     * @param city 城市
     * @return 旅行记录列表
     */
    @Select("SELECT * FROM travel WHERE city = #{city} AND is_delete = 0 ORDER BY start_date DESC, create_time DESC")
    List<Travel> selectByCity(@Param("city") String city);

    /**
     * 根据状态查询旅行记录列表
     *
     * @param status 状态
     * @return 旅行记录列表
     */
    @Select("SELECT * FROM travel WHERE status = #{status} AND is_delete = 0 ORDER BY start_date DESC, create_time DESC")
    List<Travel> selectByStatus(@Param("status") Integer status);

    /**
     * 根据评分查询旅行记录列表
     *
     * @param rating 评分
     * @return 旅行记录列表
     */
    @Select("SELECT * FROM travel WHERE rating = #{rating} AND is_delete = 0 ORDER BY start_date DESC, create_time DESC")
    List<Travel> selectByRating(@Param("rating") Integer rating);

    /**
     * 根据日期范围查询旅行记录列表
     *
     * @param startDate 开始日期
     * @param endDate   结束日期
     * @return 旅行记录列表
     */
    @Select("SELECT * FROM travel WHERE start_date >= #{startDate} AND end_date <= #{endDate} AND is_delete = 0 ORDER BY start_date DESC, create_time DESC")
    List<Travel> selectByDateRange(@Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);

    /**
     * 根据预算范围查询旅行记录列表
     *
     * @param minBudget 最小预算
     * @param maxBudget 最大预算
     * @return 旅行记录列表
     */
    @Select("SELECT * FROM travel WHERE budget >= #{minBudget} AND budget <= #{maxBudget} AND is_delete = 0 ORDER BY start_date DESC, create_time DESC")
    List<Travel> selectByBudgetRange(@Param("minBudget") BigDecimal minBudget, @Param("maxBudget") BigDecimal maxBudget);

    /**
     * 根据旅行天数范围查询旅行记录列表
     *
     * @param minDuration 最小天数
     * @param maxDuration 最大天数
     * @return 旅行记录列表
     */
    @Select("SELECT * FROM travel WHERE duration >= #{minDuration} AND duration <= #{maxDuration} AND is_delete = 0 ORDER BY start_date DESC, create_time DESC")
    List<Travel> selectByDurationRange(@Param("minDuration") Integer minDuration, @Param("maxDuration") Integer maxDuration);

    /**
     * 根据交通方式查询旅行记录列表
     *
     * @param transportation 交通方式
     * @return 旅行记录列表
     */
    @Select("SELECT * FROM travel WHERE transportation LIKE CONCAT('%', #{transportation}, '%') AND is_delete = 0 ORDER BY start_date DESC, create_time DESC")
    List<Travel> selectByTransportation(@Param("transportation") String transportation);

    /**
     * 根据天气情况查询旅行记录列表
     *
     * @param weather 天气情况
     * @return 旅行记录列表
     */
    @Select("SELECT * FROM travel WHERE weather = #{weather} AND is_delete = 0 ORDER BY start_date DESC, create_time DESC")
    List<Travel> selectByWeather(@Param("weather") String weather);

    /**
     * 查询公开的旅行记录列表
     *
     * @return 公开旅行记录列表
     */
    @Select("SELECT * FROM travel WHERE status = 1 AND is_delete = 0 ORDER BY start_date DESC, create_time DESC")
    List<Travel> selectPublicTravels();

    /**
     * 查询高评分旅行记录列表（4星及以上）
     *
     * @return 高评分旅行记录列表
     */
    @Select("SELECT * FROM travel WHERE rating >= 4 AND is_delete = 0 ORDER BY rating DESC, start_date DESC")
    List<Travel> selectHighRatedTravels();

    /**
     * 统计作者的旅行记录数量
     *
     * @param authorId 作者ID
     * @return 旅行记录数量
     */
    @Select("SELECT COUNT(*) FROM travel WHERE author_id = #{authorId} AND is_delete = 0")
    Long countByAuthorId(@Param("authorId") Long authorId);

    /**
     * 统计公开旅行记录数量
     *
     * @return 公开旅行记录数量
     */
    @Select("SELECT COUNT(*) FROM travel WHERE status = 1 AND is_delete = 0")
    Long countPublicTravels();

    /**
     * 统计总旅行记录数量
     *
     * @return 总旅行记录数量
     */
    @Select("SELECT COUNT(*) FROM travel WHERE is_delete = 0")
    Long countTravels();

    /**
     * 根据评分统计旅行记录数量
     *
     * @param rating 评分
     * @return 旅行记录数量
     */
    @Select("SELECT COUNT(*) FROM travel WHERE rating = #{rating} AND is_delete = 0")
    Long countByRating(@Param("rating") Integer rating);
}