package com.xu.blogapi.validator;

import com.xu.blogapi.common.ErrorCode;
import com.xu.blogapi.exception.BusinessException;
import com.xu.blogapi.model.dto.thought.ThoughtAddRequest;
import com.xu.blogapi.model.dto.thought.ThoughtUpdateRequest;
import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.regex.Pattern;

/**
 * 想法验证器
 *
 * @author xu
 */
@Component
public class ThoughtValidator {

    /**
     * URL正则表达式
     */
    private static final Pattern URL_PATTERN = Pattern.compile(
            "^(https?|ftp)://[^\\s/$.?#].[^\\s]*$",
            Pattern.CASE_INSENSITIVE
    );

    /**
     * 验证想法添加请求
     *
     * @param thoughtAddRequest 想法添加请求
     */
    public void validateThoughtAddRequest(ThoughtAddRequest thoughtAddRequest) {
        if (thoughtAddRequest == null) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR, "请求参数为空");
        }

        // 验证内容
        validateContent(thoughtAddRequest.getContent());

        // 验证心情
        validateMood(thoughtAddRequest.getMood());

        // 验证地理位置
        validateLocation(thoughtAddRequest.getLocation());

        // 验证天气
        validateWeather(thoughtAddRequest.getWeather());

        // 验证状态
        validateStatus(thoughtAddRequest.getStatus());

        // 验证图片
        validateImages(thoughtAddRequest.getImages());
    }

    /**
     * 验证想法更新请求
     *
     * @param thoughtUpdateRequest 想法更新请求
     */
    public void validateThoughtUpdateRequest(ThoughtUpdateRequest thoughtUpdateRequest) {
        if (thoughtUpdateRequest == null) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR, "请求参数为空");
        }

        // 验证ID
        if (thoughtUpdateRequest.getId() == null || thoughtUpdateRequest.getId() <= 0) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR, "想法ID无效");
        }

        // 验证内容（更新时内容可以为空，表示不更新）
        if (StringUtils.isNotBlank(thoughtUpdateRequest.getContent())) {
            validateContent(thoughtUpdateRequest.getContent());
        }

        // 验证心情
        validateMood(thoughtUpdateRequest.getMood());

        // 验证地理位置
        validateLocation(thoughtUpdateRequest.getLocation());

        // 验证天气
        validateWeather(thoughtUpdateRequest.getWeather());

        // 验证状态
        validateStatus(thoughtUpdateRequest.getStatus());

        // 验证图片
        validateImages(thoughtUpdateRequest.getImages());
    }

    /**
     * 验证想法内容
     *
     * @param content 想法内容
     */
    private void validateContent(String content) {
        if (StringUtils.isBlank(content)) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR, "想法内容不能为空");
        }

        if (content.length() > 5000) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR, "想法内容不能超过5000个字符");
        }

        // 检查是否包含敏感词（这里可以扩展敏感词过滤逻辑）
        if (containsSensitiveWords(content)) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR, "想法内容包含敏感词汇");
        }
    }

    /**
     * 验证心情状态
     *
     * @param mood 心情状态
     */
    private void validateMood(String mood) {
        if (StringUtils.isNotBlank(mood)) {
            if (mood.length() > 20) {
                throw new BusinessException(ErrorCode.PARAMS_ERROR, "心情状态不能超过20个字符");
            }

            // 验证心情状态是否合法（可以扩展预定义的心情列表）
            if (!isValidMood(mood)) {
                throw new BusinessException(ErrorCode.PARAMS_ERROR, "心情状态格式不正确");
            }
        }
    }

    /**
     * 验证地理位置
     *
     * @param location 地理位置
     */
    private void validateLocation(String location) {
        if (StringUtils.isNotBlank(location)) {
            if (location.length() > 100) {
                throw new BusinessException(ErrorCode.PARAMS_ERROR, "地理位置不能超过100个字符");
            }

            // 验证地理位置格式（可以扩展更严格的地理位置验证）
            if (!isValidLocation(location)) {
                throw new BusinessException(ErrorCode.PARAMS_ERROR, "地理位置格式不正确");
            }
        }
    }

    /**
     * 验证天气信息
     *
     * @param weather 天气信息
     */
    private void validateWeather(String weather) {
        if (StringUtils.isNotBlank(weather)) {
            if (weather.length() > 50) {
                throw new BusinessException(ErrorCode.PARAMS_ERROR, "天气信息不能超过50个字符");
            }

            // 验证天气信息格式（可以扩展预定义的天气类型）
            if (!isValidWeather(weather)) {
                throw new BusinessException(ErrorCode.PARAMS_ERROR, "天气信息格式不正确");
            }
        }
    }

    /**
     * 验证状态
     *
     * @param status 状态
     */
    private void validateStatus(Integer status) {
        if (status != null) {
            if (status != 0 && status != 1) {
                throw new BusinessException(ErrorCode.PARAMS_ERROR, "状态值无效，只能是0（私有）或1（公开）");
            }
        }
    }

    /**
     * 验证图片列表
     *
     * @param images 图片列表
     */
    private void validateImages(List<String> images) {
        if (images != null) {
            if (images.size() > 9) {
                throw new BusinessException(ErrorCode.PARAMS_ERROR, "图片数量不能超过9张");
            }

            // 验证每个图片URL
            for (String imageUrl : images) {
                if (StringUtils.isNotBlank(imageUrl)) {
                    validateImageUrl(imageUrl);
                }
            }
        }
    }

    /**
     * 验证图片URL
     *
     * @param imageUrl 图片URL
     */
    private void validateImageUrl(String imageUrl) {
        if (imageUrl.length() > 500) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR, "图片URL长度不能超过500个字符");
        }

        // 验证URL格式
        if (!URL_PATTERN.matcher(imageUrl).matches()) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR, "图片URL格式不正确");
        }

        // 验证是否为图片文件
        if (!isImageUrl(imageUrl)) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR, "URL必须指向图片文件");
        }
    }

    /**
     * 检查是否包含敏感词
     *
     * @param content 内容
     * @return 是否包含敏感词
     */
    private boolean containsSensitiveWords(String content) {
        // 这里可以实现敏感词过滤逻辑
        // 可以使用敏感词库或第三方敏感词过滤服务
        
        // 简单示例：检查一些基本的敏感词
        String[] sensitiveWords = {
            "垃圾", "废物", "傻逼", "操你妈", "去死"
        };
        
        String lowerContent = content.toLowerCase();
        for (String word : sensitiveWords) {
            if (lowerContent.contains(word.toLowerCase())) {
                return true;
            }
        }
        
        return false;
    }

    /**
     * 验证心情状态是否合法
     *
     * @param mood 心情状态
     * @return 是否合法
     */
    private boolean isValidMood(String mood) {
        // 这里可以定义预设的心情状态列表
        String[] validMoods = {
            "开心", "快乐", "兴奋", "满足", "平静", "放松", "感激", "希望",
            "悲伤", "难过", "失望", "沮丧", "焦虑", "紧张", "愤怒", "烦躁",
            "疲惫", "困倦", "无聊", "孤独", "思念", "怀念", "期待", "好奇"
        };
        
        for (String validMood : validMoods) {
            if (validMood.equals(mood)) {
                return true;
            }
        }
        
        // 如果不在预设列表中，检查是否为合理的中文字符
        return mood.matches("[\\u4e00-\\u9fa5\\w\\s]+");
    }

    /**
     * 验证地理位置是否合法
     *
     * @param location 地理位置
     * @return 是否合法
     */
    private boolean isValidLocation(String location) {
        // 简单验证：允许中文、英文、数字、空格、常见标点符号
        return location.matches("[\\u4e00-\\u9fa5\\w\\s,，.。-]+");
    }

    /**
     * 验证天气信息是否合法
     *
     * @param weather 天气信息
     * @return 是否合法
     */
    private boolean isValidWeather(String weather) {
        // 这里可以定义预设的天气类型列表
        String[] validWeathers = {
            "晴天", "多云", "阴天", "小雨", "中雨", "大雨", "暴雨", "雷雨",
            "小雪", "中雪", "大雪", "暴雪", "雾", "霾", "沙尘", "台风"
        };
        
        for (String validWeather : validWeathers) {
            if (validWeather.equals(weather)) {
                return true;
            }
        }
        
        // 如果不在预设列表中，检查是否为合理的中文字符
        return weather.matches("[\\u4e00-\\u9fa5\\w\\s]+");
    }

    /**
     * 验证是否为图片URL
     *
     * @param url URL
     * @return 是否为图片URL
     */
    private boolean isImageUrl(String url) {
        String lowerUrl = url.toLowerCase();
        return lowerUrl.endsWith(".jpg") || 
               lowerUrl.endsWith(".jpeg") || 
               lowerUrl.endsWith(".png") || 
               lowerUrl.endsWith(".gif") || 
               lowerUrl.endsWith(".bmp") || 
               lowerUrl.endsWith(".webp") ||
               lowerUrl.contains("image") ||
               lowerUrl.contains("img");
    }
}