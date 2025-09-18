package com.xu.blogapi.model.dto.user;

import java.io.Serializable;
import lombok.Data;

/**
 * 用户创建请求
 */
@Data
public class UserAddRequest implements Serializable {

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
     * 头像URL
     */
    private String avatar;

    /**
     * 个人简介
     */
    private String bio;

    /**
     * 用户角色：0-普通用户 1-管理员 2-封禁用户
     */
    private Integer role;

    private static final long serialVersionUID = 1L;
}