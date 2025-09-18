package com.xu.blogapi.model.vo;

import java.io.Serializable;
import java.util.Date;
import lombok.Data;

/**
 * 已登录用户视图（脱敏）
 **/
@Data
public class LoginUserVO implements Serializable {

    /**
     * 用户 id
     */
    private Long id;

    /**
     * 用户名
     */
    private String username;

    /**
     * 邮箱
     */
    private String email;

    /**
     * 昵称
     */
    private String nickname;

    /**
     * 用户头像
     */
    private String avatar;

    /**
     * 个人简介
     */
    private String bio;

    /**
     * 个人网站
     */
    private String website;

    /**
     * GitHub用户名
     */
    private String github;

    /**
     * 角色：0-普通用户，1-管理员
     */
    private Integer role;

    /**
     * 状态：0-禁用，1-启用
     */
    private Integer status;

    /**
     * 最后登录时间
     */
    private Date lastLoginTime;

    /**
     * 创建时间
     */
    private Date createTime;

    /**
     * 更新时间
     */
    private Date updateTime;

    private static final long serialVersionUID = 1L;
}