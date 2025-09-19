package com.xu.blogapi.model.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;

import java.io.Serializable;
import java.time.LocalDateTime;
import java.util.List;

/**
 * 想法实体类
 *
 * @author xu
 */
@Data
@TableName("thought")
public class Thought implements Serializable {

    /**
     * 想法ID
     */
    @TableId(type = IdType.AUTO)
    private Long id;

    /**
     * 想法内容
     */
    private String content;

    /**
     * 图片列表（JSON数组）
     */
    @TableField(typeHandler = com.xu.blogapi.common.JsonListTypeHandler.class)
    private List<String> images;

    /**
     * 心情状态
     */
    private String mood;

    /**
     * 地理位置
     */
    private String location;

    /**
     * 天气情况
     */
    private String weather;

    /**
     * 作者ID
     */
    private Long authorId;

    /**
     * 状态：0-私密，1-公开
     */
    private Integer status;

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