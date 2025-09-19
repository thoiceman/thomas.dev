package com.xu.blogapi.model.dto.travel;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import javax.validation.constraints.DecimalMax;
import javax.validation.constraints.DecimalMin;
import javax.validation.constraints.Max;
import javax.validation.constraints.Min;
import java.io.Serializable;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

/**
 * 旅行记录更新请求DTO
 *
 * @author xu
 */
@Data
@ApiModel(description = "旅行记录更新请求")
public class TravelUpdateRequest implements Serializable {

    /**
     * 旅行记录ID
     */
    @ApiModelProperty(value = "旅行记录ID", required = true, example = "1")
    @NotNull(message = "旅行记录ID不能为空")
    private Long id;

    /**
     * 旅行标题
     */
    @ApiModelProperty(value = "旅行标题", example = "日本关西之旅")
    @Size(max = 200, message = "旅行标题长度不能超过200个字符")
    private String title;

    /**
     * 目的地
     */
    @ApiModelProperty(value = "目的地", example = "日本关西")
    @Size(max = 100, message = "目的地长度不能超过100个字符")
    private String destination;

    /**
     * 国家
     */
    @ApiModelProperty(value = "国家", example = "日本")
    @Size(max = 50, message = "国家名称长度不能超过50个字符")
    private String country;

    /**
     * 城市
     */
    @ApiModelProperty(value = "城市", example = "大阪")
    @Size(max = 50, message = "城市名称长度不能超过50个字符")
    private String city;

    /**
     * 旅行描述
     */
    @ApiModelProperty(value = "旅行描述", example = "一次难忘的日本关西文化之旅")
    private String description;

    /**
     * 详细游记内容
     */
    @ApiModelProperty(value = "详细游记内容", example = "第一天：抵达大阪...")
    private String content;

    /**
     * 封面图片
     */
    @ApiModelProperty(value = "封面图片", example = "https://example.com/cover.jpg")
    @Size(max = 500, message = "封面图片URL长度不能超过500个字符")
    private String coverImage;

    /**
     * 相册图片列表
     */
    @ApiModelProperty(value = "相册图片列表", example = "[\"https://example.com/photo1.jpg\", \"https://example.com/photo2.jpg\"]")
    private List<String> images;

    /**
     * 开始日期
     */
    @ApiModelProperty(value = "开始日期", example = "2024-03-01")
    private LocalDate startDate;

    /**
     * 结束日期
     */
    @ApiModelProperty(value = "结束日期", example = "2024-03-07")
    private LocalDate endDate;

    /**
     * 旅行天数
     */
    @ApiModelProperty(value = "旅行天数", example = "7")
    @Min(value = 1, message = "旅行天数不能小于1天")
    private Integer duration;

    /**
     * 预算/花费
     */
    @ApiModelProperty(value = "预算/花费", example = "5000.00")
    @DecimalMin(value = "0.00", message = "预算不能为负数")
    @DecimalMax(value = "99999999.99", message = "预算金额过大")
    private BigDecimal budget;

    /**
     * 同行人员
     */
    @ApiModelProperty(value = "同行人员", example = "朋友小王、小李")
    @Size(max = 200, message = "同行人员信息长度不能超过200个字符")
    private String companions;

    /**
     * 交通方式
     */
    @ApiModelProperty(value = "交通方式", example = "飞机+地铁")
    @Size(max = 100, message = "交通方式长度不能超过100个字符")
    private String transportation;

    /**
     * 住宿信息
     */
    @ApiModelProperty(value = "住宿信息", example = "大阪心斋桥酒店")
    @Size(max = 200, message = "住宿信息长度不能超过200个字符")
    private String accommodation;

    /**
     * 亮点/推荐
     */
    @ApiModelProperty(value = "亮点/推荐", example = "[\"清水寺\", \"金阁寺\", \"奈良公园\"]")
    private List<String> highlights;

    /**
     * 纬度
     */
    @ApiModelProperty(value = "纬度", example = "34.6937")
    @DecimalMin(value = "-90.00000000", message = "纬度范围为-90到90")
    @DecimalMax(value = "90.00000000", message = "纬度范围为-90到90")
    private BigDecimal latitude;

    /**
     * 经度
     */
    @ApiModelProperty(value = "经度", example = "135.5023")
    @DecimalMin(value = "-180.00000000", message = "经度范围为-180到180")
    @DecimalMax(value = "180.00000000", message = "经度范围为-180到180")
    private BigDecimal longitude;

    /**
     * 天气情况
     */
    @ApiModelProperty(value = "天气情况", example = "晴朗")
    @Size(max = 50, message = "天气情况长度不能超过50个字符")
    private String weather;

    /**
     * 评分（1-5星）
     */
    @ApiModelProperty(value = "评分", example = "5", notes = "1-5星评分")
    @Min(value = 1, message = "评分不能小于1星")
    @Max(value = 5, message = "评分不能大于5星")
    private Integer rating;

    /**
     * 状态：0-私密，1-公开
     */
    @ApiModelProperty(value = "状态", example = "1", notes = "0-私密，1-公开")
    private Integer status;

    private static final long serialVersionUID = 1L;
}