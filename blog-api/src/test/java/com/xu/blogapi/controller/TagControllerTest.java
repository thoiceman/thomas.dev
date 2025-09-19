package com.xu.blogapi.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.xu.blogapi.model.dto.tag.TagAddRequest;
import com.xu.blogapi.model.dto.tag.TagQueryRequest;
import com.xu.blogapi.model.dto.tag.TagUpdateRequest;
import com.xu.blogapi.service.TagService;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import javax.annotation.Resource;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * 标签控制器测试
 *
 * @author xu
 */
@WebMvcTest(TagController.class)
@ActiveProfiles("test")
public class TagControllerTest {

    @Resource
    private MockMvc mockMvc;

    @MockBean
    private TagService tagService;

    @Resource
    private ObjectMapper objectMapper;

    /**
     * 测试添加标签接口
     */
    @Test
    public void testAddTag() throws Exception {
        // 准备测试数据
        TagAddRequest request = new TagAddRequest();
        request.setName("Java");
        request.setSlug("java");
        request.setColor("#FF5722");

        // Mock服务层返回
        when(tagService.addTag(any(TagAddRequest.class))).thenReturn(1L);

        // 执行请求并验证结果
        mockMvc.perform(post("/api/tags")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(0))
                .andExpect(jsonPath("$.message").value("ok"))
                .andExpect(jsonPath("$.data").value(1));
    }

    /**
     * 测试添加标签接口 - 参数验证失败
     */
    @Test
    public void testAddTagWithInvalidParams() throws Exception {
        // 准备无效的测试数据（名称为空）
        TagAddRequest request = new TagAddRequest();
        request.setSlug("java");
        request.setColor("#FF5722");

        // 执行请求并验证结果
        mockMvc.perform(post("/api/tags")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest());
    }

    /**
     * 测试删除标签接口
     */
    @Test
    public void testDeleteTag() throws Exception {
        // Mock服务层返回
        when(tagService.deleteTag(anyLong())).thenReturn(true);

        // 执行请求并验证结果
        mockMvc.perform(delete("/api/tags")
                        .param("id", "1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(0))
                .andExpect(jsonPath("$.message").value("ok"))
                .andExpect(jsonPath("$.data").value(true));
    }

    /**
     * 测试删除标签接口 - 参数验证失败
     */
    @Test
    public void testDeleteTagWithInvalidId() throws Exception {
        // 执行请求并验证结果（ID为0）
        mockMvc.perform(delete("/api/tags")
                        .param("id", "0"))
                .andExpect(status().isBadRequest());
    }

    /**
     * 测试更新标签接口
     */
    @Test
    public void testUpdateTag() throws Exception {
        // 准备测试数据
        TagUpdateRequest request = new TagUpdateRequest();
        request.setId(1L);
        request.setName("Java SE");
        request.setColor("#FF6722");

        // Mock服务层返回
        when(tagService.updateTag(any(TagUpdateRequest.class))).thenReturn(true);

        // 执行请求并验证结果
        mockMvc.perform(put("/api/tags")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(0))
                .andExpect(jsonPath("$.message").value("ok"))
                .andExpect(jsonPath("$.data").value(true));
    }

    /**
     * 测试更新标签接口 - 参数验证失败
     */
    @Test
    public void testUpdateTagWithInvalidParams() throws Exception {
        // 准备无效的测试数据（ID为空）
        TagUpdateRequest request = new TagUpdateRequest();
        request.setName("Java SE");
        request.setColor("#FF6722");

        // 执行请求并验证结果
        mockMvc.perform(put("/api/tags")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest());
    }

    /**
     * 测试根据ID获取标签接口
     */
    @Test
    public void testGetTagById() throws Exception {
        // 执行请求并验证结果
        mockMvc.perform(get("/api/tags/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(0))
                .andExpect(jsonPath("$.message").value("ok"));
    }

    /**
     * 测试根据ID获取标签接口 - 参数验证失败
     */
    @Test
    public void testGetTagByIdWithInvalidId() throws Exception {
        // 执行请求并验证结果（ID为0）
        mockMvc.perform(get("/api/tags/0"))
                .andExpect(status().isBadRequest());
    }

    /**
     * 测试根据别名获取标签接口
     */
    @Test
    public void testGetTagBySlug() throws Exception {
        // 执行请求并验证结果
        mockMvc.perform(get("/api/tags/slug/java"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(0))
                .andExpect(jsonPath("$.message").value("ok"));
    }

    /**
     * 测试分页查询标签接口
     */
    @Test
    public void testListTagsByPage() throws Exception {
        // 准备查询参数
        TagQueryRequest queryRequest = new TagQueryRequest();
        queryRequest.setCurrent(1);
        queryRequest.setPageSize(10);

        // 执行请求并验证结果
        mockMvc.perform(post("/api/tags/list/page")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(queryRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(0))
                .andExpect(jsonPath("$.message").value("ok"));
    }

    /**
     * 测试获取所有标签接口
     */
    @Test
    public void testListAllTags() throws Exception {
        // 执行请求并验证结果
        mockMvc.perform(get("/api/tags/all"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(0))
                .andExpect(jsonPath("$.message").value("ok"));
    }

    /**
     * 测试获取热门标签接口
     */
    @Test
    public void testListPopularTags() throws Exception {
        // 执行请求并验证结果
        mockMvc.perform(get("/api/tags/popular")
                        .param("limit", "5"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(0))
                .andExpect(jsonPath("$.message").value("ok"));
    }

    /**
     * 测试根据文章ID获取标签列表接口
     */
    @Test
    public void testListTagsByArticleId() throws Exception {
        // 执行请求并验证结果
        mockMvc.perform(get("/api/tags/article/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(0))
                .andExpect(jsonPath("$.message").value("ok"));
    }

    /**
     * 测试根据文章ID获取标签列表接口 - 参数验证失败
     */
    @Test
    public void testListTagsByArticleIdWithInvalidId() throws Exception {
        // 执行请求并验证结果（文章ID为0）
        mockMvc.perform(get("/api/tags/article/0"))
                .andExpect(status().isBadRequest());
    }
}