package com.xu.blogapi.model.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;

import java.io.Serializable;
import java.time.LocalDateTime;

/**
 * 技术栈实体类
 * 对应数据库表：tech_stack
 *
 * @author xu
 */
@TableName(value = "tech_stack")
@Data
public class TechStack implements Serializable {

    /**
     * 技术栈ID
     */
    @TableId(value = "id", type = IdType.AUTO)
    private Long id;

    /**
     * 技术名称
     */
    @TableField(value = "name")
    private String name;

    /**
     * 技术分类（前端/后端/数据库/工具等）
     */
    @TableField(value = "category")
    private String category;

    /**
     * 技术描述
     */
    @TableField(value = "description")
    private String description;

    /**
     * 技术图标URL
     */
    @TableField(value = "icon")
    private String icon;

    /**
     * 官方网站
     */
    @TableField(value = "official_url")
    private String officialUrl;

    /**
     * 排序权重
     */
    @TableField(value = "sort_order")
    private Integer sortOrder;

    /**
     * 状态：0-不展示，1-展示
     */
    @TableField(value = "status")
    private Integer status;

    /**
     * 创建时间
     */
    @TableField(value = "create_time", fill = FieldFill.INSERT)
    private LocalDateTime createTime;

    /**
     * 更新时间
     */
    @TableField(value = "update_time", fill = FieldFill.INSERT_UPDATE)
    private LocalDateTime updateTime;

    /**
     * 是否删除：0-未删除，1-已删除
     */
    @TableLogic
    @TableField(value = "is_delete")
    private Integer isDelete;

    @TableField(exist = false)
    private static final long serialVersionUID = 1L;
}