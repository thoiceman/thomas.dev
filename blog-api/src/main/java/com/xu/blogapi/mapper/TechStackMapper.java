package com.xu.blogapi.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.xu.blogapi.model.entity.TechStack;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

import java.util.List;

/**
 * 技术栈数据访问层
 *
 * @author xu
 */
public interface TechStackMapper extends BaseMapper<TechStack> {

    /**
     * 根据技术名称查询技术栈
     *
     * @param name 技术名称
     * @return 技术栈信息
     */
    @Select("SELECT * FROM tech_stack WHERE name = #{name} AND is_delete = 0")
    TechStack selectByName(@Param("name") String name);

    /**
     * 根据分类查询技术栈列表
     *
     * @param category 技术分类
     * @return 技术栈列表
     */
    @Select("SELECT * FROM tech_stack WHERE category = #{category} AND is_delete = 0 AND status = 1 ORDER BY sort_order ASC, create_time DESC")
    List<TechStack> selectByCategory(@Param("category") String category);

    /**
     * 查询所有展示状态的技术栈（按分类和排序权重排序）
     *
     * @return 技术栈列表
     */
    @Select("SELECT * FROM tech_stack WHERE is_delete = 0 AND status = 1 ORDER BY category ASC, sort_order ASC, create_time DESC")
    List<TechStack> selectAllDisplayed();

    /**
     * 根据条件查询技术栈列表（支持模糊搜索和分页）
     *
     * @param name       技术名称（模糊搜索）
     * @param category   技术分类（精确匹配）
     * @param status     状态（精确匹配）
     * @param searchText 搜索关键词（模糊搜索名称和描述）
     * @param sortField  排序字段
     * @param sortOrder  排序顺序
     * @return 技术栈列表
     */
    List<TechStack> selectTechStacksByCondition(@Param("name") String name,
                                               @Param("category") String category,
                                               @Param("status") Integer status,
                                               @Param("searchText") String searchText,
                                               @Param("sortField") String sortField,
                                               @Param("sortOrder") String sortOrder);

    /**
     * 检查技术栈ID是否存在
     *
     * @param id 技术栈ID
     * @return 是否存在
     */
    @Select("SELECT COUNT(*) > 0 FROM tech_stack WHERE id = #{id} AND is_delete = 0")
    Boolean existsById(@Param("id") Long id);

    /**
     * 检查技术名称是否已存在
     *
     * @param name 技术名称
     * @return 是否存在
     */
    @Select("SELECT COUNT(*) > 0 FROM tech_stack WHERE name = #{name} AND is_delete = 0")
    Boolean existsByName(@Param("name") String name);

    /**
     * 检查技术名称是否已存在（排除指定ID）
     *
     * @param name      技术名称
     * @param excludeId 排除的ID（用于更新时检查）
     * @return 是否存在
     */
    @Select("SELECT COUNT(*) > 0 FROM tech_stack WHERE name = #{name} AND id != #{excludeId} AND is_delete = 0")
    Boolean existsByNameAndNotId(@Param("name") String name, @Param("excludeId") Long excludeId);

    /**
     * 获取所有技术分类
     *
     * @return 分类列表
     */
    @Select("SELECT DISTINCT category FROM tech_stack WHERE is_delete = 0 ORDER BY category ASC")
    List<String> selectAllCategories();

    /**
     * 统计技术栈总数
     *
     * @return 总数
     */
    @Select("SELECT COUNT(*) FROM tech_stack WHERE is_delete = 0")
    Long countTechStacks();

    /**
     * 统计展示状态的技术栈数量
     *
     * @return 展示状态的数量
     */
    @Select("SELECT COUNT(*) FROM tech_stack WHERE is_delete = 0 AND status = 1")
    Long countDisplayedTechStacks();

    /**
     * 根据分类统计技术栈数量
     *
     * @param category 技术分类
     * @return 该分类下的技术栈数量
     */
    @Select("SELECT COUNT(*) FROM tech_stack WHERE category = #{category} AND is_delete = 0")
    Long countByCategory(@Param("category") String category);
}