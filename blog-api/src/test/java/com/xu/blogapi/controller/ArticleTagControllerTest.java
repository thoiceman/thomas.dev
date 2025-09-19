package com.xu.blogapi.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.xu.blogapi.service.ArticleTagService;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import javax.annotation.Resource;
import java.util.Arrays;
import java.util.List;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * 文章标签关联控制器测试
 *
 * @author xu
 */
@WebMvcTest(ArticleTagController.class)
@ActiveProfiles("test")
public class ArticleTagControllerTest {

    @Resource
    private MockMvc mockMvc;

    @MockBean
    private ArticleTagService articleTagService;

    @Resource
    private ObjectMapper objectMapper;

    /**
     * 测试为文章添加标签接口
     */
    @Test
    public void testAddTagsToArticle() throws Exception {
        // 准备测试数据
        List<Long> tagIds = Arrays.asList(1L, 2L, 3L);

        // Mock服务层返回
        when(articleTagService.addTagsToArticle(anyLong(), anyList())).thenReturn(true);

        // 执行请求并验证结果
        mockMvc.perform(post("/api/article-tags/1/tags")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(tagIds)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(0))
                .andExpect(jsonPath("$.message").value("ok"))
                .andExpect(jsonPath("$.data").value(true));
    }

    /**
     * 测试为文章添加标签接口 - 参数验证失败
     */
    @Test
    public void testAddTagsToArticleWithInvalidArticleId() throws Exception {
        // 准备测试数据
        List<Long> tagIds = Arrays.asList(1L, 2L, 3L);

        // 执行请求并验证结果（文章ID为0）
        mockMvc.perform(post("/api/article-tags/0/tags")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(tagIds)))
                .andExpect(status().isBadRequest());
    }

    /**
     * 测试为文章添加标签接口 - 标签ID列表为空
     */
    @Test
    public void testAddTagsToArticleWithEmptyTagIds() throws Exception {
        // 准备测试数据（空列表）
        List<Long> tagIds = Arrays.asList();

        // 执行请求并验证结果
        mockMvc.perform(post("/api/article-tags/1/tags")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(tagIds)))
                .andExpect(status().isBadRequest());
    }

    /**
     * 测试从文章移除标签接口
     */
    @Test
    public void testRemoveTagsFromArticle() throws Exception {
        // 准备测试数据
        List<Long> tagIds = Arrays.asList(1L, 2L);

        // Mock服务层返回
        when(articleTagService.removeTagsFromArticle(anyLong(), anyList())).thenReturn(true);

        // 执行请求并验证结果
        mockMvc.perform(delete("/api/article-tags/1/tags")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(tagIds)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(0))
                .andExpect(jsonPath("$.message").value("ok"))
                .andExpect(jsonPath("$.data").value(true));
    }

    /**
     * 测试从文章移除标签接口 - 参数验证失败
     */
    @Test
    public void testRemoveTagsFromArticleWithInvalidArticleId() throws Exception {
        // 准备测试数据
        List<Long> tagIds = Arrays.asList(1L, 2L);

        // 执行请求并验证结果（文章ID为负数）
        mockMvc.perform(delete("/api/article-tags/-1/tags")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(tagIds)))
                .andExpect(status().isBadRequest());
    }

    /**
     * 测试更新文章标签接口
     */
    @Test
    public void testUpdateArticleTags() throws Exception {
        // 准备测试数据
        List<Long> tagIds = Arrays.asList(1L, 3L, 5L);

        // Mock服务层返回
        when(articleTagService.updateArticleTags(anyLong(), anyList())).thenReturn(true);

        // 执行请求并验证结果
        mockMvc.perform(put("/api/article-tags/1/tags")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(tagIds)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(0))
                .andExpect(jsonPath("$.message").value("ok"))
                .andExpect(jsonPath("$.data").value(true));
    }

    /**
     * 测试删除文章所有标签关联接口
     */
    @Test
    public void testRemoveAllTagsFromArticle() throws Exception {
        // Mock服务层返回
        when(articleTagService.removeAllTagsFromArticle(anyLong())).thenReturn(true);

        // 执行请求并验证结果
        mockMvc.perform(delete("/api/article-tags/1/all-tags"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(0))
                .andExpect(jsonPath("$.message").value("ok"))
                .andExpect(jsonPath("$.data").value(true));
    }

    /**
     * 测试删除文章所有标签关联接口 - 参数验证失败
     */
    @Test
    public void testRemoveAllTagsFromArticleWithInvalidId() throws Exception {
        // 执行请求并验证结果（文章ID为0）
        mockMvc.perform(delete("/api/article-tags/0/all-tags"))
                .andExpect(status().isBadRequest());
    }

    /**
     * 测试根据文章ID获取标签ID列表接口
     */
    @Test
    public void testGetTagIdsByArticleId() throws Exception {
        // Mock服务层返回
        List<Long> tagIds = Arrays.asList(1L, 2L, 3L);
        when(articleTagService.getTagIdsByArticleId(anyLong())).thenReturn(tagIds);

        // 执行请求并验证结果
        mockMvc.perform(get("/api/article-tags/1/tag-ids"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(0))
                .andExpect(jsonPath("$.message").value("ok"))
                .andExpect(jsonPath("$.data").isArray())
                .andExpect(jsonPath("$.data.length()").value(3));
    }

    /**
     * 测试根据标签ID获取文章ID列表接口
     */
    @Test
    public void testGetArticleIdsByTagId() throws Exception {
        // Mock服务层返回
        List<Long> articleIds = Arrays.asList(1L, 2L, 3L, 4L);
        when(articleTagService.getArticleIdsByTagId(anyLong())).thenReturn(articleIds);

        // 执行请求并验证结果
        mockMvc.perform(get("/api/article-tags/tag/1/article-ids"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(0))
                .andExpect(jsonPath("$.message").value("ok"))
                .andExpect(jsonPath("$.data").isArray())
                .andExpect(jsonPath("$.data.length()").value(4));
    }

    /**
     * 测试根据标签ID获取文章ID列表接口 - 参数验证失败
     */
    @Test
    public void testGetArticleIdsByTagIdWithInvalidId() throws Exception {
        // 执行请求并验证结果（标签ID为负数）
        mockMvc.perform(get("/api/article-tags/tag/-1/article-ids"))
                .andExpect(status().isBadRequest());
    }

    /**
     * 测试检查文章标签关联是否存在接口
     */
    @Test
    public void testExistsArticleTag() throws Exception {
        // Mock服务层返回
        when(articleTagService.existsRelation(anyLong(), anyLong())).thenReturn(true);

        // 执行请求并验证结果
        mockMvc.perform(get("/api/article-tags/exists")
                        .param("articleId", "1")
                        .param("tagId", "2"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(0))
                .andExpect(jsonPath("$.message").value("ok"))
                .andExpect(jsonPath("$.data").value(true));
    }

    /**
     * 测试检查文章标签关联是否存在接口 - 参数验证失败
     */
    @Test
    public void testExistsArticleTagWithInvalidParams() throws Exception {
        // 执行请求并验证结果（文章ID为0）
        mockMvc.perform(get("/api/article-tags/exists")
                        .param("articleId", "0")
                        .param("tagId", "2"))
                .andExpect(status().isBadRequest());
    }

    /**
     * 测试统计文章标签数量接口
     */
    @Test
    public void testCountTagsByArticleId() throws Exception {
        // Mock服务层返回
        when(articleTagService.countTagsByArticleId(anyLong())).thenReturn(5L);

        // 执行请求并验证结果
        mockMvc.perform(get("/api/article-tags/1/tag-count"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(0))
                .andExpect(jsonPath("$.message").value("ok"))
                .andExpect(jsonPath("$.data").value(5));
    }

    /**
     * 测试统计标签文章数量接口
     */
    @Test
    public void testCountArticlesByTagId() throws Exception {
        // Mock服务层返回
        when(articleTagService.countArticlesByTagId(anyLong())).thenReturn(10L);

        // 执行请求并验证结果
        mockMvc.perform(get("/api/article-tags/tag/1/article-count"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(0))
                .andExpect(jsonPath("$.message").value("ok"))
                .andExpect(jsonPath("$.data").value(10));
    }

    /**
     * 测试统计标签文章数量接口 - 参数验证失败
     */
    @Test
    public void testCountArticlesByTagIdWithInvalidId() throws Exception {
        // 执行请求并验证结果（标签ID为0）
        mockMvc.perform(get("/api/article-tags/tag/0/article-count"))
                .andExpect(status().isBadRequest());
    }
}