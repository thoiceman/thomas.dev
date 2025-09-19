package com.xu.blogapi.service.impl;

import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.xu.blogapi.common.ErrorCode;
import com.xu.blogapi.exception.BusinessException;
import com.xu.blogapi.mapper.ArticleTagMapper;
import com.xu.blogapi.model.entity.ArticleTag;
import com.xu.blogapi.service.ArticleTagService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.annotation.Resource;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

/**
 * 文章标签关联服务实现类
 *
 * @author xu
 */
@Service
@Slf4j
public class ArticleTagServiceImpl extends ServiceImpl<ArticleTagMapper, ArticleTag> implements ArticleTagService {

    @Resource
    private ArticleTagMapper articleTagMapper;

    @Override
    @Transactional(rollbackFor = Exception.class)
    public Boolean addTagsToArticle(Long articleId, List<Long> tagIds) {
        // 参数校验
        if (articleId == null || articleId <= 0) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR, "文章ID不能为空");
        }
        if (tagIds == null || tagIds.isEmpty()) {
            return true; // 空列表直接返回成功
        }

        // 去重并过滤已存在的关联
        List<Long> uniqueTagIds = new ArrayList<>();
        for (Long tagId : tagIds) {
            if (tagId != null && tagId > 0 && !uniqueTagIds.contains(tagId)) {
                // 检查关联是否已存在
                if (!articleTagMapper.existsByArticleIdAndTagId(articleId, tagId)) {
                    uniqueTagIds.add(tagId);
                }
            }
        }

        if (uniqueTagIds.isEmpty()) {
            return true; // 没有需要添加的关联
        }

        // 批量创建关联
        List<ArticleTag> articleTagList = new ArrayList<>();
        LocalDateTime now = LocalDateTime.now();
        for (Long tagId : uniqueTagIds) {
            ArticleTag articleTag = new ArticleTag();
            articleTag.setArticleId(articleId);
            articleTag.setTagId(tagId);
            articleTag.setCreateTime(now);
            articleTagList.add(articleTag);
        }

        int insertCount = articleTagMapper.batchInsert(articleTagList);
        return insertCount > 0;
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public Boolean removeTagsFromArticle(Long articleId, List<Long> tagIds) {
        // 参数校验
        if (articleId == null || articleId <= 0) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR, "文章ID不能为空");
        }
        if (tagIds == null || tagIds.isEmpty()) {
            return true; // 空列表直接返回成功
        }

        // 去重
        List<Long> uniqueTagIds = new ArrayList<>();
        for (Long tagId : tagIds) {
            if (tagId != null && tagId > 0 && !uniqueTagIds.contains(tagId)) {
                uniqueTagIds.add(tagId);
            }
        }

        if (uniqueTagIds.isEmpty()) {
            return true;
        }

        int deleteCount = articleTagMapper.batchDeleteByArticleIdAndTagIds(articleId, uniqueTagIds);
        return deleteCount >= 0; // 即使删除0条也算成功
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public Boolean updateArticleTags(Long articleId, List<Long> tagIds) {
        // 参数校验
        if (articleId == null || articleId <= 0) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR, "文章ID不能为空");
        }

        // 先删除所有关联
        articleTagMapper.deleteByArticleId(articleId);

        // 如果新标签列表为空，直接返回
        if (tagIds == null || tagIds.isEmpty()) {
            return true;
        }

        // 添加新的关联
        return addTagsToArticle(articleId, tagIds);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public Boolean removeAllTagsFromArticle(Long articleId) {
        // 参数校验
        if (articleId == null || articleId <= 0) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR, "文章ID不能为空");
        }

        int deleteCount = articleTagMapper.deleteByArticleId(articleId);
        return deleteCount >= 0;
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public Boolean removeAllArticlesFromTag(Long tagId) {
        // 参数校验
        if (tagId == null || tagId <= 0) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR, "标签ID不能为空");
        }

        int deleteCount = articleTagMapper.deleteByTagId(tagId);
        return deleteCount >= 0;
    }

    @Override
    public List<Long> getTagIdsByArticleId(Long articleId) {
        // 参数校验
        if (articleId == null || articleId <= 0) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR, "文章ID不能为空");
        }

        return articleTagMapper.selectTagIdsByArticleId(articleId);
    }

    @Override
    public List<Long> getArticleIdsByTagId(Long tagId) {
        // 参数校验
        if (tagId == null || tagId <= 0) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR, "标签ID不能为空");
        }

        return articleTagMapper.selectArticleIdsByTagId(tagId);
    }

    @Override
    public Boolean existsRelation(Long articleId, Long tagId) {
        // 参数校验
        if (articleId == null || articleId <= 0 || tagId == null || tagId <= 0) {
            return false;
        }

        return articleTagMapper.existsByArticleIdAndTagId(articleId, tagId);
    }

    @Override
    public Long countTagsByArticleId(Long articleId) {
        // 参数校验
        if (articleId == null || articleId <= 0) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR, "文章ID不能为空");
        }

        return articleTagMapper.countTagsByArticleId(articleId);
    }

    @Override
    public Long countArticlesByTagId(Long tagId) {
        // 参数校验
        if (tagId == null || tagId <= 0) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR, "标签ID不能为空");
        }

        return articleTagMapper.countArticlesByTagId(tagId);
    }

    @Override
    public List<Long> getPopularTagIds(Integer limit) {
        if (limit == null || limit <= 0) {
            limit = 10; // 默认限制10个
        }

        return articleTagMapper.selectPopularTagIds(limit);
    }
}