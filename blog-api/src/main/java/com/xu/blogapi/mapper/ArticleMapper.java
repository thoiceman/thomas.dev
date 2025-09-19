package com.xu.blogapi.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.xu.blogapi.model.entity.Article;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

/**
 * 文章数据访问层
 * 继承MyBatis-Plus的BaseMapper，提供基础的CRUD操作
 *
 * @author xu
 */
@Mapper
public interface ArticleMapper extends BaseMapper<Article> {

    /**
     * 分页查询文章列表（不包含content字段，提高查询性能）
     *
     * @param page 分页参数
     * @param status 文章状态（可选）
     * @param categoryId 分类ID（可选）
     * @param authorId 作者ID（可选）
     * @return 分页结果
     */
    IPage<Article> selectArticleListPage(Page<Article> page, 
                                       @Param("status") Integer status,
                                       @Param("categoryId") Long categoryId,
                                       @Param("authorId") Long authorId);

    /**
     * 根据slug查询文章
     *
     * @param slug 文章别名
     * @return 文章信息
     */
    Article selectBySlug(@Param("slug") String slug);

    /**
     * 查询置顶文章列表
     *
     * @param limit 限制数量
     * @return 置顶文章列表
     */
    java.util.List<Article> selectTopArticles(@Param("limit") Integer limit);

    /**
     * 查询精选文章列表
     *
     * @param limit 限制数量
     * @return 精选文章列表
     */
    java.util.List<Article> selectFeaturedArticles(@Param("limit") Integer limit);

    /**
     * 更新文章字数和阅读时间
     *
     * @param id 文章ID
     * @param wordCount 字数
     * @param readingTime 阅读时间
     * @return 更新行数
     */
    int updateWordCountAndReadingTime(@Param("id") Long id, 
                                    @Param("wordCount") Integer wordCount,
                                    @Param("readingTime") Integer readingTime);
}