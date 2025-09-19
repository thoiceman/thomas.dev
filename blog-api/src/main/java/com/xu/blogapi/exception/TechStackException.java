package com.xu.blogapi.exception;

/**
 * 技术栈相关异常
 *
 * @author xu
 */
public class TechStackException extends RuntimeException {

    private static final long serialVersionUID = 1L;

    public TechStackException() {
        super();
    }

    public TechStackException(String message) {
        super(message);
    }

    public TechStackException(String message, Throwable cause) {
        super(message, cause);
    }

    public TechStackException(Throwable cause) {
        super(cause);
    }
}