package com.xu.blogapi.model.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;

import java.io.Serializable;
import java.time.LocalDateTime;

/**
 * 标签实体类
 * 对应数据库表：tag
 *
 * @author xu
 */
@TableName(value = "tag")
@Data
public class Tag implements Serializable {

    /**
     * 标签ID
     */
    @TableId(value = "id", type = IdType.AUTO)
    private Long id;

    /**
     * 标签名称
     */
    @TableField(value = "name")
    private String name;

    /**
     * 标签别名（URL友好）
     */
    @TableField(value = "slug")
    private String slug;

    /**
     * 标签颜色
     */
    @TableField(value = "color")
    private String color;

    /**
     * 使用次数
     */
    @TableField(value = "use_count")
    private Integer useCount;

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