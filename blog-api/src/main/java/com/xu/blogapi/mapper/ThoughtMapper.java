package com.xu.blogapi.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.xu.blogapi.model.entity.Thought;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

import java.util.List;

/**
 * 想法数据访问层
 *
 * @author xu
 */
public interface ThoughtMapper extends BaseMapper<Thought> {

    /**
     * 根据作者ID查询想法列表
     *
     * @param authorId 作者ID
     * @return 想法列表
     */
    @Select("SELECT * FROM thought WHERE author_id = #{authorId} AND is_delete = 0 ORDER BY create_time DESC")
    List<Thought> selectByAuthorId(@Param("authorId") Long authorId);

    /**
     * 根据状态查询想法列表
     *
     * @param status 状态
     * @return 想法列表
     */
    @Select("SELECT * FROM thought WHERE status = #{status} AND is_delete = 0 ORDER BY create_time DESC")
    List<Thought> selectByStatus(@Param("status") Integer status);

    /**
     * 查询所有公开的想法
     *
     * @return 想法列表
     */
    @Select("SELECT * FROM thought WHERE status = 1 AND is_delete = 0 ORDER BY create_time DESC")
    List<Thought> selectAllPublic();

    /**
     * 根据条件查询想法列表（支持模糊搜索和分页）
     *
     * @param content    想法内容（模糊搜索）
     * @param mood       心情状态（精确匹配）
     * @param location   地理位置（模糊搜索）
     * @param weather    天气情况（精确匹配）
     * @param authorId   作者ID（精确匹配）
     * @param status     状态（精确匹配）
     * @param searchText 搜索关键词（模糊搜索内容）
     * @param sortField  排序字段
     * @param sortOrder  排序顺序
     * @return 想法列表
     */
    List<Thought> selectThoughtsByCondition(@Param("content") String content,
                                           @Param("mood") String mood,
                                           @Param("location") String location,
                                           @Param("weather") String weather,
                                           @Param("authorId") Long authorId,
                                           @Param("status") Integer status,
                                           @Param("searchText") String searchText,
                                           @Param("sortField") String sortField,
                                           @Param("sortOrder") String sortOrder);

    /**
     * 检查想法ID是否存在
     *
     * @param id 想法ID
     * @return 是否存在
     */
    @Select("SELECT COUNT(*) > 0 FROM thought WHERE id = #{id} AND is_delete = 0")
    Boolean existsById(@Param("id") Long id);

    /**
     * 根据作者ID统计想法数量
     *
     * @param authorId 作者ID
     * @return 想法数量
     */
    @Select("SELECT COUNT(*) FROM thought WHERE author_id = #{authorId} AND is_delete = 0")
    Long countByAuthorId(@Param("authorId") Long authorId);

    /**
     * 统计公开想法数量
     *
     * @return 公开想法数量
     */
    @Select("SELECT COUNT(*) FROM thought WHERE status = 1 AND is_delete = 0")
    Long countPublicThoughts();

    /**
     * 统计想法总数
     *
     * @return 总数
     */
    @Select("SELECT COUNT(*) FROM thought WHERE is_delete = 0")
    Long countThoughts();
}