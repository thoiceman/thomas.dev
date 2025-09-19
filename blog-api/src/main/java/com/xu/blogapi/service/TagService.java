package com.xu.blogapi.service;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.service.IService;
import com.xu.blogapi.model.dto.tag.TagAddRequest;
import com.xu.blogapi.model.dto.tag.TagQueryRequest;
import com.xu.blogapi.model.dto.tag.TagUpdateRequest;
import com.xu.blogapi.model.entity.Tag;
import com.xu.blogapi.model.vo.TagVO;

import java.util.List;

/**
 * 标签服务接口
 *
 * @author xu
 */
public interface TagService extends IService<Tag> {

    /**
     * 创建标签
     *
     * @param tagAddRequest 标签添加请求
     * @return 标签ID
     */
    Long addTag(TagAddRequest tagAddRequest);

    /**
     * 删除标签
     *
     * @param id 标签ID
     * @return 是否删除成功
     */
    Boolean deleteTag(Long id);

    /**
     * 更新标签
     *
     * @param tagUpdateRequest 标签更新请求
     * @return 是否更新成功
     */
    Boolean updateTag(TagUpdateRequest tagUpdateRequest);

    /**
     * 根据ID获取标签
     *
     * @param id 标签ID
     * @return 标签VO
     */
    TagVO getTagById(Long id);

    /**
     * 根据别名获取标签
     *
     * @param slug 标签别名
     * @return 标签VO
     */
    TagVO getTagBySlug(String slug);

    /**
     * 分页查询标签
     *
     * @param tagQueryRequest 查询请求
     * @return 分页结果
     */
    IPage<TagVO> listTagsByPage(TagQueryRequest tagQueryRequest);

    /**
     * 获取所有标签
     *
     * @return 标签列表
     */
    List<TagVO> listAllTags();

    /**
     * 获取热门标签
     *
     * @param limit 限制数量
     * @return 热门标签列表
     */
    List<TagVO> listPopularTags(Integer limit);

    /**
     * 根据文章ID获取标签列表
     *
     * @param articleId 文章ID
     * @return 标签列表
     */
    List<TagVO> listTagsByArticleId(Long articleId);

    /**
     * 增加标签使用次数
     *
     * @param tagIds 标签ID列表
     */
    void incrementUseCount(List<Long> tagIds);

    /**
     * 减少标签使用次数
     *
     * @param tagIds 标签ID列表
     */
    void decrementUseCount(List<Long> tagIds);

    /**
     * 校验标签是否存在
     *
     * @param tag 标签实体
     * @param add 是否为添加操作
     */
    void validTag(Tag tag, boolean add);

    /**
     * 将实体转换为VO
     *
     * @param tag 标签实体
     * @return 标签VO
     */
    TagVO getTagVO(Tag tag);

    /**
     * 检查标签是否存在（根据ID）
     *
     * @param id 标签ID
     * @return 是否存在
     */
    Boolean existsById(Long id);

    /**
     * 检查标签名称是否存在
     *
     * @param name 标签名称
     * @return 是否存在
     */
    Boolean existsByName(String name);

    /**
     * 检查标签别名是否存在
     *
     * @param slug 标签别名
     * @return 是否存在
     */
    Boolean existsBySlug(String slug);

    /**
     * 检查标签名称是否存在（排除指定ID）
     *
     * @param name 标签名称
     * @param excludeId 排除的标签ID
     * @return 是否存在
     */
    Boolean existsByNameAndNotId(String name, Long excludeId);

    /**
     * 检查标签别名是否存在（排除指定ID）
     *
     * @param slug 标签别名
     * @param excludeId 排除的标签ID
     * @return 是否存在
     */
    Boolean existsBySlugAndNotId(String slug, Long excludeId);
}