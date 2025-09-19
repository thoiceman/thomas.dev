package com.xu.blogapi.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.xu.blogapi.model.dto.techstack.TechStackAddRequest;
import com.xu.blogapi.model.dto.techstack.TechStackQueryRequest;
import com.xu.blogapi.model.dto.techstack.TechStackUpdateRequest;
import com.xu.blogapi.model.dto.techstack.TechStackResponse;
import com.xu.blogapi.service.TechStackService;
import com.xu.blogapi.validator.TechStackValidator;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.context.WebApplicationContext;

import javax.annotation.Resource;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * 技术栈控制器测试
 *
 * @author xu
 */
@WebMvcTest(TechStackController.class)
public class TechStackControllerTest {

    @Resource
    private MockMvc mockMvc;

    @Resource
    private WebApplicationContext webApplicationContext;

    @MockBean
    private TechStackService techStackService;

    @MockBean
    private TechStackValidator techStackValidator;

    private ObjectMapper objectMapper;

    @BeforeEach
    public void setUp() {
        mockMvc = MockMvcBuilders.webAppContextSetup(webApplicationContext).build();
        objectMapper = new ObjectMapper();
    }

    /**
     * 测试创建技术栈
     */
    @Test
    public void testAddTechStack() throws Exception {
        // 准备测试数据
        TechStackAddRequest request = new TechStackAddRequest();
        request.setName("Spring Boot");
        request.setCategory("后端框架");
        request.setDescription("Spring Boot是一个基于Spring的快速开发框架");
        request.setIcon("https://spring.io/images/spring-logo.svg");
        request.setOfficialUrl("https://spring.io/projects/spring-boot");
        request.setSortOrder(1);
        request.setStatus(1);

        // Mock服务方法
        when(techStackService.addTechStack(any(TechStackAddRequest.class))).thenReturn(1L);

        // 执行测试
        mockMvc.perform(post("/techstack/add")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(0))
                .andExpect(jsonPath("$.data").value(1));

        // 验证方法调用
        verify(techStackValidator).validateTechStackAddRequest(any(TechStackAddRequest.class));
        verify(techStackService).addTechStack(any(TechStackAddRequest.class));
    }

    /**
     * 测试删除技术栈
     */
    @Test
    public void testDeleteTechStack() throws Exception {
        // Mock服务方法
        when(techStackService.deleteTechStack(anyLong())).thenReturn(true);

        // 执行测试
        mockMvc.perform(post("/techstack/delete")
                        .param("id", "1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(0))
                .andExpect(jsonPath("$.data").value(true));

        // 验证方法调用
        verify(techStackValidator).validateTechStackId(1L);
        verify(techStackService).deleteTechStack(1L);
    }

    /**
     * 测试更新技术栈
     */
    @Test
    public void testUpdateTechStack() throws Exception {
        // 准备测试数据
        TechStackUpdateRequest request = new TechStackUpdateRequest();
        request.setId(1L);
        request.setName("Spring Boot");
        request.setCategory("后端框架");
        request.setDescription("Spring Boot是一个用于简化Spring应用开发的框架");
        request.setIcon("https://spring.io/images/spring-logo.svg");
        request.setOfficialUrl("https://spring.io/projects/spring-boot");
        request.setSortOrder(1);
        request.setStatus(1);

        // Mock服务方法
        when(techStackService.updateTechStack(any(TechStackUpdateRequest.class))).thenReturn(true);

        // 执行测试
        mockMvc.perform(post("/techstack/update")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(0))
                .andExpect(jsonPath("$.data").value(true));

        // 验证方法调用
        verify(techStackValidator).validateTechStackUpdateRequest(any(TechStackUpdateRequest.class));
        verify(techStackService).updateTechStack(any(TechStackUpdateRequest.class));
    }

    /**
     * 测试根据ID获取技术栈
     */
    @Test
    public void testGetTechStackById() throws Exception {
        // 准备测试数据
        TechStackResponse response = new TechStackResponse();
        response.setId(1L);
        response.setName("Spring Boot");
        response.setCategory("后端框架");
        response.setDescription("Spring Boot是一个基于Spring的快速开发框架");
        response.setIcon("https://spring.io/images/spring-logo.svg");
        response.setOfficialUrl("https://spring.io/projects/spring-boot");
        response.setSortOrder(1);
        response.setStatus(1);
        response.setCreateTime(LocalDateTime.now());
        response.setUpdateTime(LocalDateTime.now());

        // Mock服务方法
        when(techStackService.getTechStackById(anyLong())).thenReturn(response);

        // 执行测试
        mockMvc.perform(get("/techstack/get")
                        .param("id", "1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(0))
                .andExpect(jsonPath("$.data.id").value(1))
                .andExpect(jsonPath("$.data.name").value("Spring Boot"))
                .andExpect(jsonPath("$.data.category").value("后端框架"));

        // 验证方法调用
        verify(techStackValidator).validateTechStackId(1L);
        verify(techStackService).getTechStackById(1L);
    }

    /**
     * 测试根据名称获取技术栈
     */
    @Test
    public void testGetTechStackByName() throws Exception {
        // 准备测试数据
        TechStackResponse response = new TechStackResponse();
        response.setId(1L);
        response.setName("Vue.js");
        response.setCategory("前端框架");
        response.setDescription("Vue.js是一个渐进式JavaScript框架");

        // Mock服务方法
        when(techStackService.getTechStackByName(anyString())).thenReturn(response);

        // 执行测试
        mockMvc.perform(get("/techstack/get/name")
                        .param("name", "Vue.js"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(0))
                .andExpect(jsonPath("$.data.name").value("Vue.js"))
                .andExpect(jsonPath("$.data.category").value("前端框架"));

        // 验证方法调用
        verify(techStackValidator).validateTechStackName("Vue.js");
        verify(techStackService).getTechStackByName("Vue.js");
    }

    /**
     * 测试获取所有技术栈
     */
    @Test
    public void testListAllTechStacks() throws Exception {
        // 准备测试数据
        TechStackResponse response1 = new TechStackResponse();
        response1.setId(1L);
        response1.setName("Spring Boot");
        response1.setCategory("后端框架");

        TechStackResponse response2 = new TechStackResponse();
        response2.setId(2L);
        response2.setName("Vue.js");
        response2.setCategory("前端框架");

        List<TechStackResponse> responseList = Arrays.asList(response1, response2);

        // Mock服务方法
        when(techStackService.listAllTechStacks()).thenReturn(responseList);

        // 执行测试
        mockMvc.perform(get("/techstack/list/all"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(0))
                .andExpect(jsonPath("$.data").isArray())
                .andExpect(jsonPath("$.data.length()").value(2))
                .andExpect(jsonPath("$.data[0].name").value("Spring Boot"))
                .andExpect(jsonPath("$.data[1].name").value("Vue.js"));

        // 验证方法调用
        verify(techStackService).listAllTechStacks();
    }

    /**
     * 测试根据分类获取技术栈列表
     */
    @Test
    public void testListTechStacksByCategory() throws Exception {
        // 准备测试数据
        TechStackResponse response = new TechStackResponse();
        response.setId(1L);
        response.setName("Spring Boot");
        response.setCategory("后端框架");

        List<TechStackResponse> responseList = Arrays.asList(response);

        // Mock服务方法
        when(techStackService.listTechStacksByCategory(anyString())).thenReturn(responseList);

        // 执行测试
        mockMvc.perform(get("/techstack/list/category")
                        .param("category", "后端框架"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(0))
                .andExpect(jsonPath("$.data").isArray())
                .andExpect(jsonPath("$.data.length()").value(1))
                .andExpect(jsonPath("$.data[0].category").value("后端框架"));

        // 验证方法调用
        verify(techStackValidator).validateTechStackCategory("后端框架");
        verify(techStackService).listTechStacksByCategory("后端框架");
    }

    /**
     * 测试获取所有技术分类
     */
    @Test
    public void testListAllCategories() throws Exception {
        // 准备测试数据
        List<String> categories = Arrays.asList("后端框架", "前端框架", "数据库");

        // Mock服务方法
        when(techStackService.listAllCategories()).thenReturn(categories);

        // 执行测试
        mockMvc.perform(get("/techstack/list/categories"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(0))
                .andExpect(jsonPath("$.data").isArray())
                .andExpect(jsonPath("$.data.length()").value(3))
                .andExpect(jsonPath("$.data[0]").value("后端框架"))
                .andExpect(jsonPath("$.data[1]").value("前端框架"))
                .andExpect(jsonPath("$.data[2]").value("数据库"));

        // 验证方法调用
        verify(techStackService).listAllCategories();
    }

    /**
     * 测试检查技术栈名称是否存在
     */
    @Test
    public void testExistsByName() throws Exception {
        // Mock服务方法
        when(techStackService.existsByName(anyString())).thenReturn(true);

        // 执行测试
        mockMvc.perform(get("/techstack/exists/name")
                        .param("name", "Spring Boot"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(0))
                .andExpect(jsonPath("$.data").value(true));

        // 验证方法调用
        verify(techStackValidator).validateTechStackName("Spring Boot");
        verify(techStackService).existsByName("Spring Boot");
    }

    /**
     * 测试检查技术栈名称是否存在（排除指定ID）
     */
    @Test
    public void testExistsByNameAndNotId() throws Exception {
        // Mock服务方法
        when(techStackService.existsByNameAndNotId(anyString(), anyLong())).thenReturn(false);

        // 执行测试
        mockMvc.perform(get("/techstack/exists/name/exclude")
                        .param("name", "Spring Boot")
                        .param("excludeId", "1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(0))
                .andExpect(jsonPath("$.data").value(false));

        // 验证方法调用
        verify(techStackValidator).validateTechStackName("Spring Boot");
        verify(techStackValidator).validateTechStackId(1L);
        verify(techStackService).existsByNameAndNotId("Spring Boot", 1L);
    }
}