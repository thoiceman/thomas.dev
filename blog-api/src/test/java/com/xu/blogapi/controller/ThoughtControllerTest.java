package com.xu.blogapi.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.xu.blogapi.model.dto.thought.ThoughtAddRequest;
import com.xu.blogapi.model.dto.thought.ThoughtQueryRequest;
import com.xu.blogapi.model.dto.thought.ThoughtUpdateRequest;
import com.xu.blogapi.model.entity.User;
import com.xu.blogapi.model.enums.UserRoleEnum;
import com.xu.blogapi.service.ThoughtService;
import com.xu.blogapi.service.UserService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import javax.annotation.Resource;
import java.util.Arrays;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * 想法控制器测试类
 *
 * @author xu
 */
@WebMvcTest(ThoughtController.class)
class ThoughtControllerTest {

    @Resource
    private MockMvc mockMvc;

    @MockBean
    private ThoughtService thoughtService;

    @MockBean
    private UserService userService;

    private ObjectMapper objectMapper;
    private User testUser;

    @BeforeEach
    void setUp() {
        objectMapper = new ObjectMapper();
        
        // 创建测试用户
        testUser = new User();
        testUser.setId(1L);
        testUser.setUsername("testuser");
        testUser.setNickname("测试用户");
        testUser.setRole(UserRoleEnum.USER.getValue().equals("user") ? 0 : 1);
    }

    @Test
    void testAddThought() throws Exception {
        // 准备测试数据
        ThoughtAddRequest request = new ThoughtAddRequest();
        request.setContent("这是一个测试想法");
        request.setMood("开心");
        request.setLocation("北京");
        request.setWeather("晴天");
        request.setStatus(1);
        request.setImages(Arrays.asList("https://example.com/image1.jpg"));

        // Mock服务方法
        when(userService.getLoginUser()).thenReturn(testUser);
        when(thoughtService.addThought(any(), any())).thenReturn(1L);

        // 执行请求
        mockMvc.perform(post("/thought/add")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(0))
                .andExpect(jsonPath("$.data").value(1));
    }

    @Test
    void testAddThoughtWithInvalidRequest() throws Exception {
        // 测试空请求体
        mockMvc.perform(post("/thought/add")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{}"))
                .andExpect(status().isBadRequest());
    }

    @Test
    void testDeleteThought() throws Exception {
        // 准备测试数据
        String deleteRequestJson = "{\"id\": 1}";

        // Mock服务方法
        when(userService.getLoginUser()).thenReturn(testUser);
        when(thoughtService.deleteThought(anyLong(), any())).thenReturn(true);

        // 执行请求
        mockMvc.perform(post("/thought/delete")
                .contentType(MediaType.APPLICATION_JSON)
                .content(deleteRequestJson))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(0))
                .andExpect(jsonPath("$.data").value(true));
    }

    @Test
    void testUpdateThought() throws Exception {
        // 准备测试数据
        ThoughtUpdateRequest request = new ThoughtUpdateRequest();
        request.setId(1L);
        request.setContent("更新后的内容");
        request.setMood("开心");

        // Mock服务方法
        when(userService.getLoginUser()).thenReturn(testUser);
        when(thoughtService.updateThought(any(), any())).thenReturn(true);

        // 执行请求
        mockMvc.perform(post("/thought/update")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(0))
                .andExpect(jsonPath("$.data").value(true));
    }

    @Test
    void testGetThoughtById() throws Exception {
        // Mock服务方法
        when(userService.getLoginUserPermitNull()).thenReturn(testUser);
        when(thoughtService.getThoughtById(anyLong(), any())).thenReturn(createMockThought());

        // 执行请求
        mockMvc.perform(get("/thought/get")
                .param("id", "1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(0))
                .andExpect(jsonPath("$.data.id").value(1))
                .andExpect(jsonPath("$.data.content").value("测试想法内容"));
    }

    @Test
    void testGetThoughtByIdWithInvalidId() throws Exception {
        // 测试无效ID
        mockMvc.perform(get("/thought/get")
                .param("id", "0"))
                .andExpect(status().isBadRequest());

        // 测试缺少ID参数
        mockMvc.perform(get("/thought/get"))
                .andExpect(status().isBadRequest());
    }

    @Test
    void testListThoughtsByPage() throws Exception {
        // 准备测试数据
        ThoughtQueryRequest request = new ThoughtQueryRequest();
        request.setCurrent(1);
        request.setPageSize(10);

        // Mock服务方法
        when(userService.getLoginUserPermitNull()).thenReturn(testUser);
        when(thoughtService.listThoughtsByPage(any(), any())).thenReturn(createMockPage());

        // 执行请求
        mockMvc.perform(post("/thought/list/page")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(0))
                .andExpect(jsonPath("$.data.current").value(1))
                .andExpect(jsonPath("$.data.size").value(10));
    }



    @Test
    void testCountUserThoughts() throws Exception {
        // Mock服务方法
        when(thoughtService.countUserThoughts(anyLong())).thenReturn(5L);

        // 执行请求
        mockMvc.perform(get("/thought/count/user")
                .param("authorId", "1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(0))
                .andExpect(jsonPath("$.data").value(5));
    }



    /**
     * 创建模拟想法对象
     */
    private com.xu.blogapi.model.entity.Thought createMockThought() {
        com.xu.blogapi.model.entity.Thought thought = new com.xu.blogapi.model.entity.Thought();
        thought.setId(1L);
        thought.setContent("测试想法内容");
        thought.setMood("开心");
        thought.setLocation("北京");
        thought.setWeather("晴天");
        thought.setAuthorId(1L);
        thought.setStatus(1);
        return thought;
    }

    /**
     * 创建模拟分页对象
     */
    private com.baomidou.mybatisplus.extension.plugins.pagination.Page<com.xu.blogapi.model.entity.Thought> createMockPage() {
        com.baomidou.mybatisplus.extension.plugins.pagination.Page<com.xu.blogapi.model.entity.Thought> page = 
            new com.baomidou.mybatisplus.extension.plugins.pagination.Page<>(1, 10, 1);
        page.setRecords(Arrays.asList(createMockThought()));
        return page;
    }
}