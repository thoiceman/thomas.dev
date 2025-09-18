package com.xu.blogapi.exception;

import com.xu.blogapi.common.BaseResponse;
import com.xu.blogapi.common.ErrorCode;
import com.xu.blogapi.common.ResultUtils;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import javax.servlet.http.HttpServletRequest;
import javax.validation.ConstraintViolationException;

/**
 * 全局异常处理器
 *
 * @author xu
 */
@RestControllerAdvice
@Slf4j
public class GlobalExceptionHandler {

    /**
     * 处理业务异常
     */
    @ExceptionHandler(BusinessException.class)
    public BaseResponse<?> businessExceptionHandler(BusinessException e, HttpServletRequest request) {
        log.error("BusinessException at {} : {}", request.getRequestURI(), e.getMessage(), e);
        return ResultUtils.error(e.getCode(), e.getMessage());
    }

    /**
     * 处理分类异常
     */
    @ExceptionHandler(CategoryException.class)
    public BaseResponse<?> categoryExceptionHandler(CategoryException e, HttpServletRequest request) {
        log.error("CategoryException at {} : {}", request.getRequestURI(), e.getMessage(), e);
        return ResultUtils.error(e.getCode(), e.getMessage());
    }

    /**
     * 处理参数校验异常
     */
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public BaseResponse<?> methodArgumentNotValidExceptionHandler(MethodArgumentNotValidException e, HttpServletRequest request) {
        log.error("MethodArgumentNotValidException at {} : {}", request.getRequestURI(), e.getMessage(), e);
        String message = "参数校验失败";
        if (e.getBindingResult().hasFieldErrors()) {
            message = e.getBindingResult().getFieldError().getDefaultMessage();
        }
        return ResultUtils.error(ErrorCode.PARAMS_ERROR.getCode(), message);
    }

    /**
     * 处理约束违反异常
     */
    @ExceptionHandler(ConstraintViolationException.class)
    public BaseResponse<?> constraintViolationExceptionHandler(ConstraintViolationException e, HttpServletRequest request) {
        log.error("ConstraintViolationException at {} : {}", request.getRequestURI(), e.getMessage(), e);
        String message = "参数校验失败";
        if (!e.getConstraintViolations().isEmpty()) {
            message = e.getConstraintViolations().iterator().next().getMessage();
        }
        return ResultUtils.error(ErrorCode.PARAMS_ERROR.getCode(), message);
    }

    /**
     * 处理运行时异常
     */
    @ExceptionHandler(RuntimeException.class)
    public BaseResponse<?> runtimeExceptionHandler(RuntimeException e, HttpServletRequest request) {
        log.error("RuntimeException at {} : {}", request.getRequestURI(), e.getMessage(), e);
        return ResultUtils.error(ErrorCode.SYSTEM_ERROR, "系统错误");
    }

    /**
     * 处理其他异常
     */
    @ExceptionHandler(Exception.class)
    public BaseResponse<?> exceptionHandler(Exception e, HttpServletRequest request) {
        log.error("Exception at {} : {}", request.getRequestURI(), e.getMessage(), e);
        return ResultUtils.error(ErrorCode.SYSTEM_ERROR);
    }
}
