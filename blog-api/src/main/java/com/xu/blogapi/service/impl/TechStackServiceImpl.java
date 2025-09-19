package com.xu.blogapi.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.xu.blogapi.common.ErrorCode;
import com.xu.blogapi.exception.BusinessException;
import com.xu.blogapi.exception.TechStackException;
import com.xu.blogapi.mapper.TechStackMapper;
import com.xu.blogapi.model.dto.techstack.TechStackAddRequest;
import com.xu.blogapi.model.dto.techstack.TechStackQueryRequest;
import com.xu.blogapi.model.dto.techstack.TechStackUpdateRequest;
import com.xu.blogapi.model.dto.techstack.TechStackResponse;
import com.xu.blogapi.model.entity.TechStack;
import com.xu.blogapi.service.TechStackService;
import com.xu.blogapi.validator.TechStackValidator;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.annotation.Resource;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

/**
 * 技术栈服务实现类
 *
 * @author xu
 */
@Service
public class TechStackServiceImpl extends ServiceImpl<TechStackMapper, TechStack> implements TechStackService {

    @Resource
    private TechStackMapper techStackMapper;

    @Resource
    private TechStackValidator techStackValidator;

    @Override
    @Transactional(rollbackFor = Exception.class)
    public Long addTechStack(TechStackAddRequest techStackAddRequest) {
        // 参数校验
        techStackValidator.validateTechStackAddRequest(techStackAddRequest);

        // 创建技术栈实体
        TechStack techStack = new TechStack();
        BeanUtils.copyProperties(techStackAddRequest, techStack);
        techStack.setCreateTime(LocalDateTime.now());
        techStack.setUpdateTime(LocalDateTime.now());
        techStack.setIsDelete(0);

        // 设置默认值
        if (techStack.getSortOrder() == null) {
            techStack.setSortOrder(0);
        }
        if (techStack.getStatus() == null) {
            techStack.setStatus(1);
        }

        // 校验技术栈
        validTechStack(techStack, true);

        // 保存技术栈
        boolean result = this.save(techStack);
        if (!result) {
            throw new BusinessException(ErrorCode.OPERATION_ERROR);
        }

        return techStack.getId();
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public Boolean deleteTechStack(Long id) {
        // 参数校验
        techStackValidator.validateTechStackId(id);

        // 检查技术栈是否存在
        TechStack techStack = this.getById(id);
        if (techStack == null) {
            throw new BusinessException(ErrorCode.NOT_FOUND_ERROR, "技术栈不存在");
        }

        // 逻辑删除
        techStack.setIsDelete(1);
        techStack.setUpdateTime(LocalDateTime.now());
        boolean result = this.updateById(techStack);
        if (!result) {
            throw new BusinessException(ErrorCode.OPERATION_ERROR);
        }

        return true;
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public Boolean updateTechStack(TechStackUpdateRequest techStackUpdateRequest) {
        // 参数校验
        techStackValidator.validateTechStackUpdateRequest(techStackUpdateRequest);

        // 检查技术栈是否存在
        if (!techStackMapper.existsById(techStackUpdateRequest.getId())) {
            throw new TechStackException("技术栈不存在");
        }

        // 检查名称是否重复（排除当前记录）
        if (techStackMapper.existsByNameAndNotId(techStackUpdateRequest.getName(), techStackUpdateRequest.getId())) {
            throw new TechStackException("技术栈名称已存在");
        }

        // 更新技术栈实体
        TechStack techStack = new TechStack();
        BeanUtils.copyProperties(techStackUpdateRequest, techStack);
        techStack.setUpdateTime(LocalDateTime.now());

        // 校验技术栈
        validTechStack(techStack, false);

        // 更新技术栈
        boolean result = this.updateById(techStack);
        if (!result) {
            throw new BusinessException(ErrorCode.OPERATION_ERROR);
        }

        return true;
    }

    @Override
    public TechStackResponse getTechStackById(Long id) {
        // 参数校验
        techStackValidator.validateTechStackId(id);

        TechStack techStack = this.getById(id);
        if (techStack == null) {
            throw new BusinessException(ErrorCode.NOT_FOUND_ERROR, "技术栈不存在");
        }

        return getTechStackResponse(techStack);
    }

    @Override
    public TechStackResponse getTechStackByName(String name) {
        // 参数校验
        techStackValidator.validateTechStackName(name);

        TechStack techStack = techStackMapper.selectByName(name);
        if (techStack == null) {
            throw new BusinessException(ErrorCode.NOT_FOUND_ERROR, "技术栈不存在");
        }

        return getTechStackResponse(techStack);
    }

    @Override
    public IPage<TechStackResponse> listTechStacksByPage(TechStackQueryRequest techStackQueryRequest) {
        // 参数校验
        techStackValidator.validateTechStackQueryRequest(techStackQueryRequest);

        // 构建查询条件
        QueryWrapper<TechStack> queryWrapper = getQueryWrapper(techStackQueryRequest);

        // 分页查询
        Page<TechStack> page = new Page<>(techStackQueryRequest.getCurrent(), techStackQueryRequest.getPageSize());
        IPage<TechStack> techStackPage = this.page(page, queryWrapper);

        // 转换为响应对象
        IPage<TechStackResponse> responsePage = new Page<>();
        BeanUtils.copyProperties(techStackPage, responsePage);
        List<TechStackResponse> responseList = techStackPage.getRecords().stream()
                .map(this::getTechStackResponse)
                .collect(Collectors.toList());
        responsePage.setRecords(responseList);

        return responsePage;
    }

    @Override
    public List<TechStackResponse> listAllTechStacks() {
        QueryWrapper<TechStack> queryWrapper = new QueryWrapper<>();
        queryWrapper.eq("is_delete", 0)
                .eq("status", 1)
                .orderByAsc("sort_order")
                .orderByDesc("create_time");

        List<TechStack> techStackList = this.list(queryWrapper);
        return techStackList.stream()
                .map(this::getTechStackResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<TechStackResponse> listTechStacksByCategory(String category) {
        // 参数校验
        techStackValidator.validateTechStackCategory(category);

        List<TechStack> techStackList = techStackMapper.selectByCategory(category);
        return techStackList.stream()
                .map(this::getTechStackResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<String> listAllCategories() {
        return techStackMapper.selectAllCategories();
    }

    @Override
    public void validTechStack(TechStack techStack, boolean add) {
        if (techStack == null) {
            throw new TechStackException("技术栈不能为空");
        }

        String name = techStack.getName();
        String category = techStack.getCategory();

        // 校验必填字段
        if (StringUtils.isBlank(name)) {
            throw new TechStackException("技术名称不能为空");
        }
        if (StringUtils.isBlank(category)) {
            throw new TechStackException("技术分类不能为空");
        }

        // 校验名称唯一性
        if (add) {
            // 添加时检查名称是否已存在
            if (existsByName(name)) {
                throw new TechStackException("技术名称已存在");
            }
        } else {
            // 更新时检查名称是否与其他记录重复
            if (existsByNameAndNotId(name, techStack.getId())) {
                throw new TechStackException("技术名称已存在");
            }
        }
    }

    @Override
    public TechStackResponse getTechStackResponse(TechStack techStack) {
        if (techStack == null) {
            return null;
        }

        TechStackResponse techStackResponse = new TechStackResponse();
        BeanUtils.copyProperties(techStack, techStackResponse);
        return techStackResponse;
    }

    @Override
    public Boolean existsById(Long id) {
        if (id == null || id <= 0) {
            return false;
        }
        return techStackMapper.existsById(id);
    }

    @Override
    public Boolean existsByName(String name) {
        if (StringUtils.isBlank(name)) {
            return false;
        }
        return techStackMapper.existsByName(name);
    }

    @Override
    public Boolean existsByNameAndNotId(String name, Long excludeId) {
        if (StringUtils.isBlank(name) || excludeId == null) {
            return false;
        }
        return techStackMapper.existsByNameAndNotId(name, excludeId);
    }

    /**
     * 构建查询条件
     *
     * @param techStackQueryRequest 查询请求
     * @return 查询条件
     */
    private QueryWrapper<TechStack> getQueryWrapper(TechStackQueryRequest techStackQueryRequest) {
        QueryWrapper<TechStack> queryWrapper = new QueryWrapper<>();

        if (techStackQueryRequest == null) {
            return queryWrapper;
        }

        String name = techStackQueryRequest.getName();
        String category = techStackQueryRequest.getCategory();
        Integer status = techStackQueryRequest.getStatus();
        String searchText = techStackQueryRequest.getSearchText();
        String sortField = techStackQueryRequest.getSortField();
        String sortOrder = techStackQueryRequest.getSortOrder();

        // 基础条件
        queryWrapper.eq("is_delete", 0);

        // 名称条件
        if (StringUtils.isNotBlank(name)) {
            queryWrapper.like("name", name);
        }

        // 分类条件
        if (StringUtils.isNotBlank(category)) {
            queryWrapper.eq("category", category);
        }

        // 状态条件
        if (status != null) {
            queryWrapper.eq("status", status);
        }

        // 搜索条件
        if (StringUtils.isNotBlank(searchText)) {
            queryWrapper.and(wrapper -> wrapper
                    .like("name", searchText)
                    .or()
                    .like("category", searchText)
                    .or()
                    .like("description", searchText)
            );
        }

        // 排序条件
        if (StringUtils.isNotBlank(sortField)) {
            if ("desc".equalsIgnoreCase(sortOrder)) {
                queryWrapper.orderByDesc(sortField);
            } else {
                queryWrapper.orderByAsc(sortField);
            }
        } else {
            // 默认排序
            queryWrapper.orderByAsc("sort_order").orderByDesc("create_time");
        }

        return queryWrapper;
    }
}