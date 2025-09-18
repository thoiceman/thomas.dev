package com.xu.blogapi.model.dto.user;

import java.io.Serializable;
import lombok.Data;

/**
 * 用户登录请求
 */
@Data
public class UserLoginRequest implements Serializable {

    private static final long serialVersionUID = 3191241716373120793L;

    /**
     * 用户名
     */
    private String username;

    /**
     * 密码
     */
    private String password;
}
