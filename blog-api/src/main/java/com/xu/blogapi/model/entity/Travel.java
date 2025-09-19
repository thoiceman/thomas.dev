package com.xu.blogapi.model.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;

import java.io.Serializable;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

/**
 * 旅行记录实体类
 *
 * @author xu
 */
@Data
@TableName("travel")
public class Travel implements Serializable {

    /**
     * 旅行记录ID
     */
    @TableId(type = IdType.AUTO)
    private Long id;

    /**
     * 旅行标题
     */
    private String title;

    /**
     * 目的地
     */
    private String destination;

    /**
     * 国家
     */
    private String country;

    /**
     * 城市
     */
    private String city;

    /**
     * 旅行描述
     */
    private String description;

    /**
     * 详细游记内容
     */
    private String content;

    /**
     * 封面图片
     */
    private String coverImage;

    /**
     * 相册图片列表
     */
    @TableField(typeHandler = com.xu.blogapi.common.JsonListTypeHandler.class)
    private List<String> images;

    /**
     * 开始日期
     */
    private LocalDate startDate;

    /**
     * 结束日期
     */
    private LocalDate endDate;

    /**
     * 旅行天数
     */
    private Integer duration;

    /**
     * 预算/花费
     */
    private BigDecimal budget;

    /**
     * 同行人员
     */
    private String companions;

    /**
     * 交通方式
     */
    private String transportation;

    /**
     * 住宿信息
     */
    private String accommodation;

    /**
     * 亮点/推荐
     */
    @TableField(typeHandler = com.xu.blogapi.common.JsonListTypeHandler.class)
    private List<String> highlights;

    /**
     * 纬度
     */
    private BigDecimal latitude;

    /**
     * 经度
     */
    private BigDecimal longitude;

    /**
     * 天气情况
     */
    private String weather;

    /**
     * 评分（1-5星）
     */
    private Integer rating;

    /**
     * 状态：0-私密，1-公开
     */
    private Integer status;

    /**
     * 作者ID
     */
    private Long authorId;

    /**
     * 创建时间
     */
    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createTime;

    /**
     * 更新时间
     */
    @TableField(fill = FieldFill.INSERT_UPDATE)
    private LocalDateTime updateTime;

    /**
     * 是否删除：0-未删除，1-已删除
     */
    @TableLogic
    @TableField(value = "is_delete")
    private Integer isDelete;

    private static final long serialVersionUID = 1L;
}