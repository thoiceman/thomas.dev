package com.xu.blogapi.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.xu.blogapi.model.entity.Project;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

import java.util.List;

/**
 * 项目数据访问层
 *
 * @author xu
 */
public interface ProjectMapper extends BaseMapper<Project> {

    /**
     * 根据作者ID查询项目列表
     *
     * @param authorId 作者ID
     * @return 项目列表
     */
    @Select("SELECT * FROM project WHERE author_id = #{authorId} AND is_delete = 0 ORDER BY sort_order DESC, create_time DESC")
    List<Project> selectByAuthorId(@Param("authorId") Long authorId);

    /**
     * 根据项目状态查询项目列表
     *
     * @param status 项目状态
     * @return 项目列表
     */
    @Select("SELECT * FROM project WHERE status = #{status} AND is_delete = 0 ORDER BY sort_order DESC, create_time DESC")
    List<Project> selectByStatus(@Param("status") Integer status);

    /**
     * 根据项目类型查询项目列表
     *
     * @param projectType 项目类型
     * @return 项目列表
     */
    @Select("SELECT * FROM project WHERE project_type = #{projectType} AND is_delete = 0 ORDER BY sort_order DESC, create_time DESC")
    List<Project> selectByProjectType(@Param("projectType") String projectType);

    /**
     * 查询精选项目列表
     *
     * @return 精选项目列表
     */
    @Select("SELECT * FROM project WHERE is_featured = 1 AND is_delete = 0 ORDER BY sort_order DESC, create_time DESC")
    List<Project> selectFeaturedProjects();

    /**
     * 查询开源项目列表
     *
     * @return 开源项目列表
     */
    @Select("SELECT * FROM project WHERE is_open_source = 1 AND is_delete = 0 ORDER BY sort_order DESC, create_time DESC")
    List<Project> selectOpenSourceProjects();

    /**
     * 根据项目别名查询项目
     *
     * @param slug 项目别名
     * @return 项目信息
     */
    @Select("SELECT * FROM project WHERE slug = #{slug} AND is_delete = 0")
    Project selectBySlug(@Param("slug") String slug);

    /**
     * 检查项目别名是否存在
     *
     * @param slug 项目别名
     * @return 是否存在
     */
    @Select("SELECT COUNT(*) > 0 FROM project WHERE slug = #{slug} AND is_delete = 0")
    Boolean existsBySlug(@Param("slug") String slug);

    /**
     * 检查项目别名是否存在（排除指定ID）
     *
     * @param slug 项目别名
     * @param id   排除的项目ID
     * @return 是否存在
     */
    @Select("SELECT COUNT(*) > 0 FROM project WHERE slug = #{slug} AND id != #{id} AND is_delete = 0")
    Boolean existsBySlugExcludeId(@Param("slug") String slug, @Param("id") Long id);

    /**
     * 根据作者ID统计项目数量
     *
     * @param authorId 作者ID
     * @return 项目数量
     */
    @Select("SELECT COUNT(*) FROM project WHERE author_id = #{authorId} AND is_delete = 0")
    Long countByAuthorId(@Param("authorId") Long authorId);

    /**
     * 统计精选项目数量
     *
     * @return 精选项目数量
     */
    @Select("SELECT COUNT(*) FROM project WHERE is_featured = 1 AND is_delete = 0")
    Long countFeaturedProjects();

    /**
     * 统计开源项目数量
     *
     * @return 开源项目数量
     */
    @Select("SELECT COUNT(*) FROM project WHERE is_open_source = 1 AND is_delete = 0")
    Long countOpenSourceProjects();

    /**
     * 统计项目总数
     *
     * @return 总数
     */
    @Select("SELECT COUNT(*) FROM project WHERE is_delete = 0")
    Long countProjects();
}