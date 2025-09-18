package com.xu.blogapi.model.dto.user;

import com.xu.blogapi.common.PageRequest;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.io.Serializable;

/**
 * 用户查询请求
 */
@EqualsAndHashCode(callSuper = true)
@Data
public class UserQueryRequest extends PageRequest implements Serializable {

    /**
     * 用户ID
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
     * 角色：0-普通用户，1-管理员
     */
    private Integer role;

    /**
     * 状态：0-禁用，1-启用
     */
    private Integer status;

    private static final long serialVersionUID = 1L;
}