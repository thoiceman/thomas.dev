package com.xu.blogapi.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.xu.blogapi.common.ErrorCode;
import com.xu.blogapi.exception.BusinessException;
import com.xu.blogapi.mapper.TagMapper;
import com.xu.blogapi.model.dto.tag.TagAddRequest;
import com.xu.blogapi.model.dto.tag.TagQueryRequest;
import com.xu.blogapi.model.dto.tag.TagUpdateRequest;
import com.xu.blogapi.model.entity.Tag;
import com.xu.blogapi.model.vo.TagVO;
import com.xu.blogapi.service.TagService;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.annotation.Resource;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

/**
 * 标签服务实现类
 *
 * @author xu
 */
@Service
public class TagServiceImpl extends ServiceImpl<TagMapper, Tag> implements TagService {

    @Resource
    private TagMapper tagMapper;

    @Override
    @Transactional(rollbackFor = Exception.class)
    public Long addTag(TagAddRequest tagAddRequest) {
        // 参数校验
        if (tagAddRequest == null) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR);
        }

        // 创建标签实体
        Tag tag = new Tag();
        BeanUtils.copyProperties(tagAddRequest, tag);
        tag.setUseCount(0);
        tag.setCreateTime(LocalDateTime.now());
        tag.setUpdateTime(LocalDateTime.now());
        tag.setIsDelete(0);

        // 校验标签
        validTag(tag, true);

        // 保存标签
        boolean result = this.save(tag);
        if (!result) {
            throw new BusinessException(ErrorCode.OPERATION_ERROR);
        }

        return tag.getId();
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public Boolean deleteTag(Long id) {
        // 参数校验
        if (id == null || id <= 0) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR);
        }

        // 检查标签是否存在
        Tag tag = this.getById(id);
        if (tag == null) {
            throw new BusinessException(ErrorCode.NOT_FOUND_ERROR);
        }

        // 逻辑删除
        tag.setIsDelete(1);
        tag.setUpdateTime(LocalDateTime.now());
        return this.updateById(tag);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public Boolean updateTag(TagUpdateRequest tagUpdateRequest) {
        // 参数校验
        if (tagUpdateRequest == null || tagUpdateRequest.getId() == null) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR);
        }

        // 检查标签是否存在
        Tag oldTag = this.getById(tagUpdateRequest.getId());
        if (oldTag == null) {
            throw new BusinessException(ErrorCode.NOT_FOUND_ERROR);
        }

        // 创建更新实体
        Tag tag = new Tag();
        BeanUtils.copyProperties(tagUpdateRequest, tag);
        tag.setUpdateTime(LocalDateTime.now());

        // 校验标签
        validTag(tag, false);

        // 更新标签
        return this.updateById(tag);
    }

    @Override
    public TagVO getTagById(Long id) {
        // 参数校验
        if (id == null || id <= 0) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR);
        }

        // 查询标签
        Tag tag = this.getById(id);
        if (tag == null) {
            throw new BusinessException(ErrorCode.NOT_FOUND_ERROR);
        }

        return getTagVO(tag);
    }

    @Override
    public TagVO getTagBySlug(String slug) {
        // 参数校验
        if (StringUtils.isBlank(slug)) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR);
        }

        // 查询标签
        Tag tag = tagMapper.selectBySlug(slug);
        if (tag == null) {
            throw new BusinessException(ErrorCode.NOT_FOUND_ERROR);
        }

        return getTagVO(tag);
    }

    @Override
    public IPage<TagVO> listTagsByPage(TagQueryRequest tagQueryRequest) {
        // 参数校验
        if (tagQueryRequest == null) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR);
        }

        // 构建查询条件
        QueryWrapper<Tag> queryWrapper = getQueryWrapper(tagQueryRequest);

        // 分页查询
        Page<Tag> tagPage = new Page<>(tagQueryRequest.getCurrent(), tagQueryRequest.getPageSize());
        IPage<Tag> tagIPage = this.page(tagPage, queryWrapper);

        // 转换为VO
        IPage<TagVO> tagVOPage = new Page<>(tagIPage.getCurrent(), tagIPage.getSize(), tagIPage.getTotal());
        List<TagVO> tagVOList = tagIPage.getRecords().stream()
                .map(this::getTagVO)
                .collect(Collectors.toList());
        tagVOPage.setRecords(tagVOList);

        return tagVOPage;
    }

    @Override
    public List<TagVO> listAllTags() {
        QueryWrapper<Tag> queryWrapper = new QueryWrapper<>();
        queryWrapper.eq("is_delete", 0);
        queryWrapper.orderByDesc("use_count", "create_time");

        List<Tag> tagList = this.list(queryWrapper);
        return tagList.stream()
                .map(this::getTagVO)
                .collect(Collectors.toList());
    }

    @Override
    public List<TagVO> listPopularTags(Integer limit) {
        if (limit == null || limit <= 0) {
            limit = 10;
        }

        List<Tag> tagList = tagMapper.selectPopularTags(limit);
        return tagList.stream()
                .map(this::getTagVO)
                .collect(Collectors.toList());
    }

    @Override
    public List<TagVO> listTagsByArticleId(Long articleId) {
        // 参数校验
        if (articleId == null || articleId <= 0) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR);
        }

        List<Tag> tagList = tagMapper.selectTagsByArticleId(articleId);
        return tagList.stream()
                .map(this::getTagVO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void incrementUseCount(List<Long> tagIds) {
        if (tagIds == null || tagIds.isEmpty()) {
            return;
        }
        tagMapper.batchIncrementUseCount(tagIds);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void decrementUseCount(List<Long> tagIds) {
        if (tagIds == null || tagIds.isEmpty()) {
            return;
        }
        tagMapper.batchDecrementUseCount(tagIds);
    }

    @Override
    public void validTag(Tag tag, boolean add) {
        if (tag == null) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR);
        }

        String name = tag.getName();
        String slug = tag.getSlug();

        // 创建时，参数不能为空
        if (add) {
            if (StringUtils.isAnyBlank(name, slug)) {
                throw new BusinessException(ErrorCode.PARAMS_ERROR);
            }
        }

        // 有参数则校验
        if (StringUtils.isNotBlank(name)) {
            if (name.length() > 50) {
                throw new BusinessException(ErrorCode.PARAMS_ERROR, "标签名称过长");
            }
            // 检查名称是否已存在
            QueryWrapper<Tag> nameWrapper = new QueryWrapper<>();
            nameWrapper.eq("name", name);
            nameWrapper.eq("is_delete", 0);
            if (!add && tag.getId() != null) {
                nameWrapper.ne("id", tag.getId());
            }
            long nameCount = this.count(nameWrapper);
            if (nameCount > 0) {
                throw new BusinessException(ErrorCode.PARAMS_ERROR, "标签名称已存在");
            }
        }

        if (StringUtils.isNotBlank(slug)) {
            if (slug.length() > 50) {
                throw new BusinessException(ErrorCode.PARAMS_ERROR, "标签别名过长");
            }
            // 检查别名是否已存在
            boolean slugExists = tagMapper.existsBySlug(slug, add ? null : tag.getId());
            if (slugExists) {
                throw new BusinessException(ErrorCode.PARAMS_ERROR, "标签别名已存在");
            }
        }
    }

    @Override
    public TagVO getTagVO(Tag tag) {
        if (tag == null) {
            return null;
        }
        TagVO tagVO = new TagVO();
        BeanUtils.copyProperties(tag, tagVO);
        return tagVO;
    }

    @Override
    public Boolean existsById(Long id) {
        if (id == null || id <= 0) {
            return false;
        }
        return this.getById(id) != null;
    }

    @Override
    public Boolean existsByName(String name) {
        if (StringUtils.isBlank(name)) {
            return false;
        }
        return tagMapper.existsByName(name, null);
    }

    @Override
    public Boolean existsBySlug(String slug) {
        if (StringUtils.isBlank(slug)) {
            return false;
        }
        return tagMapper.existsBySlug(slug, null);
    }

    @Override
    public Boolean existsByNameAndNotId(String name, Long excludeId) {
        if (StringUtils.isBlank(name)) {
            return false;
        }
        return tagMapper.existsByName(name, excludeId);
    }

    @Override
    public Boolean existsBySlugAndNotId(String slug, Long excludeId) {
        if (StringUtils.isBlank(slug)) {
            return false;
        }
        return tagMapper.existsBySlug(slug, excludeId);
    }

    /**
     * 获取查询包装类
     *
     * @param tagQueryRequest 查询请求
     * @return 查询包装类
     */
    private QueryWrapper<Tag> getQueryWrapper(TagQueryRequest tagQueryRequest) {
        QueryWrapper<Tag> queryWrapper = new QueryWrapper<>();

        if (tagQueryRequest == null) {
            return queryWrapper;
        }

        Long id = tagQueryRequest.getId();
        String name = tagQueryRequest.getName();
        String slug = tagQueryRequest.getSlug();
        String searchText = tagQueryRequest.getSearchText();
        String sortField = tagQueryRequest.getSortField();
        String sortOrder = tagQueryRequest.getSortOrder();
        Boolean onlyPopular = tagQueryRequest.getOnlyPopular();
        Integer minUseCount = tagQueryRequest.getMinUseCount();

        // 拼接查询条件
        queryWrapper.eq(id != null, "id", id);
        queryWrapper.eq(StringUtils.isNotBlank(name), "name", name);
        queryWrapper.eq(StringUtils.isNotBlank(slug), "slug", slug);
        queryWrapper.like(StringUtils.isNotBlank(searchText), "name", searchText);
        queryWrapper.ge(minUseCount != null && minUseCount > 0, "use_count", minUseCount);
        queryWrapper.eq("is_delete", 0);

        // 热门标签过滤
        if (onlyPopular != null && onlyPopular) {
            queryWrapper.gt("use_count", 0);
        }

        // 排序
        if (StringUtils.isNotBlank(sortField)) {
            boolean isAsc = "asc".equals(sortOrder);
            queryWrapper.orderBy(true, isAsc, sortField);
        } else {
            // 默认排序：使用次数降序，创建时间降序
            queryWrapper.orderByDesc("use_count", "create_time");
        }

        return queryWrapper;
    }
}