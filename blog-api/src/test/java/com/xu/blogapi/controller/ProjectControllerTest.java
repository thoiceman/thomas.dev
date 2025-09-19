package com.xu.blogapi.controller;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.xu.blogapi.common.DeleteRequest;
import com.xu.blogapi.model.dto.project.ProjectAddRequest;
import com.xu.blogapi.model.dto.project.ProjectQueryRequest;
import com.xu.blogapi.model.dto.project.ProjectUpdateRequest;
import com.xu.blogapi.model.entity.Project;
import com.xu.blogapi.model.entity.User;
import com.xu.blogapi.model.enums.UserRoleEnum;
import com.xu.blogapi.service.ProjectService;
import com.xu.blogapi.service.UserService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import javax.annotation.Resource;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * 项目控制器测试类
 *
 * @author xu
 */
@WebMvcTest(ProjectController.class)
class ProjectControllerTest {

    @Resource
    private MockMvc mockMvc;

    @MockBean
    private ProjectService projectService;

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
        
        // Mock用户服务
        when(userService.getLoginUser()).thenReturn(testUser);
    }

    @Test
    void testAddProject() throws Exception {
        // 准备测试数据
        ProjectAddRequest request = new ProjectAddRequest();
        request.setName("测试项目");
        request.setSlug("test-project");
        request.setDescription("这是一个测试项目");
        request.setProjectType("web");
        request.setTechStack(Arrays.asList("Java", "Spring Boot"));
        request.setStatus(1);

        // Mock服务方法
        when(projectService.addProject(any(ProjectAddRequest.class), any(User.class))).thenReturn(1L);

        // 执行测试
        mockMvc.perform(post("/project/add")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(0))
                .andExpect(jsonPath("$.data").value(1));
    }

    @Test
    void testAddProjectWithInvalidRequest() throws Exception {
        // 测试空请求体
        mockMvc.perform(post("/project/add")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(40000));
    }

    @Test
    void testDeleteProject() throws Exception {
        // 准备测试数据
        DeleteRequest deleteRequest = new DeleteRequest();
        deleteRequest.setId(1L);

        // Mock服务方法
        when(projectService.deleteProject(anyLong(), any(User.class))).thenReturn(true);

        // 执行测试
        mockMvc.perform(post("/project/delete")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(deleteRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(0))
                .andExpect(jsonPath("$.data").value(true));
    }

    @Test
    void testUpdateProject() throws Exception {
        // 准备测试数据
        ProjectUpdateRequest request = new ProjectUpdateRequest();
        request.setId(1L);
        request.setName("更新后的项目");
        request.setDescription("更新后的描述");
        request.setProjectType("mobile");

        // Mock服务方法
        when(projectService.updateProject(any(ProjectUpdateRequest.class), any(User.class))).thenReturn(true);

        // 执行测试
        mockMvc.perform(post("/project/update")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(0))
                .andExpect(jsonPath("$.data").value(true));
    }

    @Test
    void testGetProjectById() throws Exception {
        // 准备测试数据
        Project mockProject = createMockProject();

        // Mock服务方法
        when(projectService.getProjectById(anyLong(), any(User.class))).thenReturn(mockProject);

        // 执行测试
        mockMvc.perform(get("/project/get")
                .param("id", "1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(0))
                .andExpect(jsonPath("$.data.id").value(1))
                .andExpect(jsonPath("$.data.name").value("测试项目"));
    }

    @Test
    void testGetProjectByIdWithInvalidId() throws Exception {
        // 测试无效ID
        mockMvc.perform(get("/project/get")
                .param("id", "0"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(40000));
    }

    @Test
    void testGetProjectBySlug() throws Exception {
        // 准备测试数据
        Project mockProject = createMockProject();

        // Mock服务方法
        when(projectService.getProjectBySlug(anyString(), any(User.class))).thenReturn(mockProject);

        // 执行测试
        mockMvc.perform(get("/project/get/slug")
                .param("slug", "test-project"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(0))
                .andExpect(jsonPath("$.data.id").value(1))
                .andExpect(jsonPath("$.data.slug").value("test-project"));
    }

    @Test
    void testListProjectsByPage() throws Exception {
        // 准备测试数据
        ProjectQueryRequest queryRequest = new ProjectQueryRequest();
        queryRequest.setCurrent(1);
        queryRequest.setPageSize(10);
        queryRequest.setName("测试");

        Page<Project> mockPage = createMockPage();

        // Mock服务方法
        when(projectService.listProjectsByPage(any(ProjectQueryRequest.class), any(User.class))).thenReturn(mockPage);

        // 执行测试
        mockMvc.perform(post("/project/list/page")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(queryRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(0))
                .andExpect(jsonPath("$.data.total").value(1))
                .andExpect(jsonPath("$.data.records[0].name").value("测试项目"));
    }

    @Test
    void testListFeaturedProjects() throws Exception {
        // 准备测试数据
        List<Project> mockProjects = Arrays.asList(createMockProject());

        // Mock服务方法
        when(projectService.listFeaturedProjects(any(User.class))).thenReturn(mockProjects);

        // 执行测试
        mockMvc.perform(get("/project/list/featured"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(0))
                .andExpect(jsonPath("$.data[0].name").value("测试项目"));
    }

    @Test
    void testListOpenSourceProjects() throws Exception {
        // 准备测试数据
        List<Project> mockProjects = Arrays.asList(createMockProject());

        // Mock服务方法
        when(projectService.listOpenSourceProjects(any(User.class))).thenReturn(mockProjects);

        // 执行测试
        mockMvc.perform(get("/project/list/opensource"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(0))
                .andExpect(jsonPath("$.data[0].name").value("测试项目"));
    }

    @Test
    void testListProjectsByAuthor() throws Exception {
        // 准备测试数据
        List<Project> mockProjects = Arrays.asList(createMockProject());

        // Mock服务方法
        when(projectService.listProjectsByAuthor(anyLong(), any(User.class))).thenReturn(mockProjects);

        // 执行测试
        mockMvc.perform(get("/project/list/author")
                .param("authorId", "1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(0))
                .andExpect(jsonPath("$.data[0].name").value("测试项目"));
    }

    @Test
    void testListProjectsByType() throws Exception {
        // 准备测试数据
        List<Project> mockProjects = Arrays.asList(createMockProject());

        // Mock服务方法
        when(projectService.listProjectsByType(anyString(), any(User.class))).thenReturn(mockProjects);

        // 执行测试
        mockMvc.perform(get("/project/list/type")
                .param("projectType", "web"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(0))
                .andExpect(jsonPath("$.data[0].projectType").value("web"));
    }

    @Test
    void testCountUserProjects() throws Exception {
        // Mock服务方法
        when(projectService.countUserProjects(anyLong())).thenReturn(5L);

        // 执行测试
        mockMvc.perform(get("/project/count/author")
                .param("authorId", "1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(0))
                .andExpect(jsonPath("$.data").value(5));
    }

    @Test
    void testCountFeaturedProjects() throws Exception {
        // Mock服务方法
        when(projectService.countFeaturedProjects()).thenReturn(3L);

        // 执行测试
        mockMvc.perform(get("/project/count/featured"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(0))
                .andExpect(jsonPath("$.data").value(3));
    }

    @Test
    void testCountOpenSourceProjects() throws Exception {
        // Mock服务方法
        when(projectService.countOpenSourceProjects()).thenReturn(8L);

        // 执行测试
        mockMvc.perform(get("/project/count/opensource"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(0))
                .andExpect(jsonPath("$.data").value(8));
    }

    /**
     * 创建模拟项目对象
     */
    private Project createMockProject() {
        Project project = new Project();
        project.setId(1L);
        project.setName("测试项目");
        project.setSlug("test-project");
        project.setDescription("测试项目描述");
        project.setProjectType("web");
        project.setTechStack(Arrays.asList("Java", "Spring Boot"));
        project.setGithubUrl("https://github.com/test/test-project");
        project.setDemoUrl("https://demo.test.com");
        project.setCoverImage("https://example.com/cover.jpg");
        project.setImages(Arrays.asList("https://example.com/image1.jpg", "https://example.com/image2.jpg"));
        project.setAuthorId(1L);
        project.setStatus(1);
        project.setIsFeatured(0);
        project.setIsOpenSource(1);
        project.setCreateTime(LocalDateTime.now());
        project.setUpdateTime(LocalDateTime.now());
        return project;
    }

    /**
     * 创建模拟分页对象
     */
    private Page<Project> createMockPage() {
        Page<Project> page = new Page<>(1, 10);
        page.setTotal(1);
        page.setRecords(Arrays.asList(createMockProject()));
        return page;
    }
}