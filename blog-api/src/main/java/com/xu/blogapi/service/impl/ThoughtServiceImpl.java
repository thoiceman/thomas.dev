package com.xu.blogapi.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.xu.blogapi.common.ErrorCode;
import com.xu.blogapi.exception.BusinessException;
import com.xu.blogapi.mapper.ThoughtMapper;
import com.xu.blogapi.model.dto.thought.ThoughtAddRequest;
import com.xu.blogapi.model.dto.thought.ThoughtQueryRequest;
import com.xu.blogapi.model.dto.thought.ThoughtUpdateRequest;
import com.xu.blogapi.model.entity.Thought;
import com.xu.blogapi.model.entity.User;
import com.xu.blogapi.model.enums.UserRoleEnum;
import com.xu.blogapi.service.ThoughtService;
import com.xu.blogapi.service.UserService;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.annotation.Resource;
import java.util.List;

/**
 * 想法服务实现类
 *
 * @author xu
 */
@Service
public class ThoughtServiceImpl extends ServiceImpl<ThoughtMapper, Thought> implements ThoughtService {

    @Resource
    private ThoughtMapper thoughtMapper;

    @Resource
    private UserService userService;

    @Override
    @Transactional(rollbackFor = Exception.class)
    public Long addThought(ThoughtAddRequest thoughtAddRequest, User loginUser) {
        // 参数校验
        if (thoughtAddRequest == null) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR, "请求参数为空");
        }
        if (loginUser == null) {
            throw new BusinessException(ErrorCode.NOT_LOGIN_ERROR);
        }

        // 创建想法对象
        Thought thought = new Thought();
        BeanUtils.copyProperties(thoughtAddRequest, thought);
        thought.setAuthorId(loginUser.getId());

        // 校验想法参数
        validThought(thought);

        // 保存到数据库
        boolean result = this.save(thought);
        if (!result) {
            throw new BusinessException(ErrorCode.OPERATION_ERROR, "创建想法失败");
        }

        return thought.getId();
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public Boolean updateThought(ThoughtUpdateRequest thoughtUpdateRequest, User loginUser) {
        // 参数校验
        if (thoughtUpdateRequest == null || thoughtUpdateRequest.getId() == null) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR, "请求参数为空");
        }
        if (loginUser == null) {
            throw new BusinessException(ErrorCode.NOT_LOGIN_ERROR);
        }

        // 获取原想法
        Thought oldThought = this.getById(thoughtUpdateRequest.getId());
        if (oldThought == null) {
            throw new BusinessException(ErrorCode.NOT_FOUND_ERROR, "想法不存在");
        }

        // 更新想法对象
        Thought thought = new Thought();
        BeanUtils.copyProperties(thoughtUpdateRequest, thought);
        thought.setAuthorId(oldThought.getAuthorId()); // 保持原作者不变

        // 校验想法参数
        validThought(thought);

        // 更新到数据库
        boolean result = this.updateById(thought);
        if (!result) {
            throw new BusinessException(ErrorCode.OPERATION_ERROR, "更新想法失败");
        }

        return true;
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public Boolean deleteThought(Long id, User loginUser) {
        // 参数校验
        if (id == null || id <= 0) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR, "想法ID无效");
        }
        if (loginUser == null) {
            throw new BusinessException(ErrorCode.NOT_LOGIN_ERROR);
        }

        // 检查想法是否存在
        Thought thought = this.getById(id);
        if (thought == null) {
            throw new BusinessException(ErrorCode.NOT_FOUND_ERROR, "想法不存在");
        }

        // 使用MyBatis-Plus的逻辑删除方法 - 任何登录用户都可以删除想法
        boolean result = this.removeById(id);
        if (!result) {
            throw new BusinessException(ErrorCode.OPERATION_ERROR, "删除想法失败");
        }

        return true;
    }

    @Override
    public Thought getThoughtById(Long id, User loginUser) {
        // 参数校验
        if (id == null || id <= 0) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR, "想法ID无效");
        }

        // 获取想法
        Thought thought = this.getById(id);
        if (thought == null) {
            throw new BusinessException(ErrorCode.NOT_FOUND_ERROR, "想法不存在");
        }

        return thought;
    }

    @Override
    public Page<Thought> listThoughtsByPage(ThoughtQueryRequest thoughtQueryRequest, User loginUser) {
        // 参数校验
        if (thoughtQueryRequest == null) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR, "请求参数为空");
        }

        long current = thoughtQueryRequest.getCurrent();
        long size = thoughtQueryRequest.getPageSize();

        // 限制爬虫
        if (size > 50) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR, "每页数量不能超过50");
        }

        // 构建查询条件
        QueryWrapper<Thought> queryWrapper = new QueryWrapper<>();
        queryWrapper.eq("is_delete", 0);

        // 允许所有用户查看所有想法，不再进行权限限制

        // 添加查询条件
        if (StringUtils.isNotBlank(thoughtQueryRequest.getContent())) {
            queryWrapper.like("content", thoughtQueryRequest.getContent());
        }
        if (StringUtils.isNotBlank(thoughtQueryRequest.getMood())) {
            queryWrapper.eq("mood", thoughtQueryRequest.getMood());
        }
        if (StringUtils.isNotBlank(thoughtQueryRequest.getLocation())) {
            queryWrapper.like("location", thoughtQueryRequest.getLocation());
        }
        if (StringUtils.isNotBlank(thoughtQueryRequest.getWeather())) {
            queryWrapper.eq("weather", thoughtQueryRequest.getWeather());
        }
        if (thoughtQueryRequest.getAuthorId() != null) {
            queryWrapper.eq("author_id", thoughtQueryRequest.getAuthorId());
        }
        if (thoughtQueryRequest.getStatus() != null) {
            queryWrapper.eq("status", thoughtQueryRequest.getStatus());
        }
        if (StringUtils.isNotBlank(thoughtQueryRequest.getSearchText())) {
            queryWrapper.like("content", thoughtQueryRequest.getSearchText());
        }

        // 排序
        String sortField = thoughtQueryRequest.getSortField();
        String sortOrder = thoughtQueryRequest.getSortOrder();
        if (StringUtils.isNotBlank(sortField)) {
            // 将驼峰命名转换为数据库字段名
            String dbSortField = convertToDbField(sortField);
            boolean isAsc = "asc".equals(sortOrder);
            queryWrapper.orderBy(true, isAsc, dbSortField);
        } else {
            // 默认按创建时间倒序
            queryWrapper.orderByDesc("create_time");
        }

        return this.page(new Page<>(current, size), queryWrapper);
    }



    @Override
    public void validThought(Thought thought) {
        if (thought == null) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR, "想法信息为空");
        }

        String content = thought.getContent();
        String mood = thought.getMood();
        String location = thought.getLocation();
        String weather = thought.getWeather();
        Integer status = thought.getStatus();

        // 内容校验
        if (StringUtils.isBlank(content)) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR, "想法内容不能为空");
        }
        if (content.length() > 5000) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR, "想法内容过长");
        }

        // 心情校验
        if (StringUtils.isNotBlank(mood) && mood.length() > 20) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR, "心情状态过长");
        }

        // 地理位置校验
        if (StringUtils.isNotBlank(location) && location.length() > 100) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR, "地理位置过长");
        }

        // 天气校验
        if (StringUtils.isNotBlank(weather) && weather.length() > 50) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR, "天气信息过长");
        }

        // 状态校验
        if (status != null && status != 0 && status != 1) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR, "想法状态无效");
        }

        // 图片数量校验
        if (thought.getImages() != null && thought.getImages().size() > 9) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR, "图片数量不能超过9张");
        }
    }

    @Override
    public Boolean existsById(Long id) {
        if (id == null || id <= 0) {
            return false;
        }
        return thoughtMapper.existsById(id);
    }

    @Override
    public Long countUserThoughts(Long authorId) {
        if (authorId == null || authorId <= 0) {
            return 0L;
        }
        return thoughtMapper.countByAuthorId(authorId);
    }



    /**
     * 将驼峰命名的字段转换为数据库字段名
     * 
     * @param fieldName 驼峰命名的字段名
     * @return 数据库字段名
     */
    private String convertToDbField(String fieldName) {
        if (StringUtils.isBlank(fieldName)) {
            return "create_time"; // 默认字段
        }
        
        switch (fieldName) {
            case "createTime":
                return "create_time";
            case "updateTime":
                return "update_time";
            case "authorId":
                return "author_id";
            case "id":
            case "content":
            case "mood":
            case "location":
            case "weather":
            case "status":
                return fieldName; // 这些字段名相同
            default:
                return "create_time"; // 不支持的字段使用默认排序
        }
    }
}