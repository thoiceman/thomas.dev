package com.xu.blogapi.model.dto.travel;

import com.xu.blogapi.common.PageRequest;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.io.Serializable;
import java.math.BigDecimal;
import java.time.LocalDate;

/**
 * 旅行记录查询请求DTO
 *
 * @author xu
 */
@Data
@EqualsAndHashCode(callSuper = true)
@ApiModel(description = "旅行记录查询请求")
public class TravelQueryRequest extends PageRequest implements Serializable {

    /**
     * 旅行标题（模糊查询）
     */
    @ApiModelProperty(value = "旅行标题", example = "日本")
    private String title;

    /**
     * 目的地（模糊查询）
     */
    @ApiModelProperty(value = "目的地", example = "关西")
    private String destination;

    /**
     * 国家
     */
    @ApiModelProperty(value = "国家", example = "日本")
    private String country;

    /**
     * 城市
     */
    @ApiModelProperty(value = "城市", example = "大阪")
    private String city;

    /**
     * 旅行描述（模糊查询）
     */
    @ApiModelProperty(value = "旅行描述", example = "文化之旅")
    private String description;

    /**
     * 开始日期范围 - 起始
     */
    @ApiModelProperty(value = "开始日期范围-起始", example = "2024-01-01")
    private LocalDate startDateFrom;

    /**
     * 开始日期范围 - 结束
     */
    @ApiModelProperty(value = "开始日期范围-结束", example = "2024-12-31")
    private LocalDate startDateTo;

    /**
     * 结束日期范围 - 起始
     */
    @ApiModelProperty(value = "结束日期范围-起始", example = "2024-01-01")
    private LocalDate endDateFrom;

    /**
     * 结束日期范围 - 结束
     */
    @ApiModelProperty(value = "结束日期范围-结束", example = "2024-12-31")
    private LocalDate endDateTo;

    /**
     * 旅行天数范围 - 最小值
     */
    @ApiModelProperty(value = "旅行天数最小值", example = "3")
    private Integer minDuration;

    /**
     * 旅行天数范围 - 最大值
     */
    @ApiModelProperty(value = "旅行天数最大值", example = "10")
    private Integer maxDuration;

    /**
     * 预算范围 - 最小值
     */
    @ApiModelProperty(value = "预算最小值", example = "1000.00")
    private BigDecimal minBudget;

    /**
     * 预算范围 - 最大值
     */
    @ApiModelProperty(value = "预算最大值", example = "10000.00")
    private BigDecimal maxBudget;

    /**
     * 交通方式
     */
    @ApiModelProperty(value = "交通方式", example = "飞机")
    private String transportation;

    /**
     * 天气情况
     */
    @ApiModelProperty(value = "天气情况", example = "晴朗")
    private String weather;

    /**
     * 评分
     */
    @ApiModelProperty(value = "评分", example = "5", notes = "1-5星评分")
    private Integer rating;

    /**
     * 状态：0-私密，1-公开
     */
    @ApiModelProperty(value = "状态", example = "1", notes = "0-私密，1-公开")
    private Integer status;

    /**
     * 作者ID
     */
    @ApiModelProperty(value = "作者ID", example = "1")
    private Long authorId;

    /**
     * 排序字段
     */
    @ApiModelProperty(value = "排序字段", example = "createTime", notes = "可选值：createTime, updateTime, startDate, endDate, rating")
    private String sortField;

    /**
     * 排序方向
     */
    @ApiModelProperty(value = "排序方向", example = "desc", notes = "可选值：asc, desc")
    private String sortOrder;

    private static final long serialVersionUID = 1L;
}