package com.xu.blogapi.model.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;

import java.io.Serializable;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

/**
 * 项目实体类
 *
 * @author xu
 */
@Data
@TableName("project")
public class Project implements Serializable {

    /**
     * 项目ID
     */
    @TableId(type = IdType.AUTO)
    private Long id;

    /**
     * 项目名称
     */
    private String name;

    /**
     * 项目别名（URL友好）
     */
    private String slug;

    /**
     * 项目描述
     */
    private String description;

    /**
     * 项目详细介绍
     */
    private String content;

    /**
     * 项目封面图
     */
    private String coverImage;

    /**
     * 项目截图列表（JSON数组）
     */
    @TableField(typeHandler = com.xu.blogapi.common.JsonListTypeHandler.class)
    private List<String> images;

    /**
     * 演示地址
     */
    private String demoUrl;

    /**
     * GitHub地址
     */
    private String githubUrl;

    /**
     * 下载地址
     */
    private String downloadUrl;

    /**
     * 技术栈（JSON数组）
     */
    @TableField(typeHandler = com.xu.blogapi.common.JsonListTypeHandler.class)
    private List<String> techStack;

    /**
     * 主要功能（JSON数组）
     */
    @TableField(typeHandler = com.xu.blogapi.common.JsonListTypeHandler.class)
    private List<String> features;

    /**
     * 项目类型（Web应用/移动应用/桌面应用/开源库等）
     */
    private String projectType;

    /**
     * 项目状态：0-停止维护，1-正在开发，2-已完成，3-暂停
     */
    private Integer status;

    /**
     * 是否精选：0-否，1-是
     */
    private Integer isFeatured;

    /**
     * 是否开源：0-否，1-是
     */
    private Integer isOpenSource;

    /**
     * 开始日期
     */
    private LocalDate startDate;

    /**
     * 完成日期
     */
    private LocalDate endDate;

    /**
     * 排序权重
     */
    private Integer sortOrder;

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