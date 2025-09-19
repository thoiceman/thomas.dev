package com.xu.blogapi.service;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.xu.blogapi.exception.BusinessException;
import com.xu.blogapi.model.dto.project.ProjectAddRequest;
import com.xu.blogapi.model.dto.project.ProjectQueryRequest;
import com.xu.blogapi.model.dto.project.ProjectUpdateRequest;
import com.xu.blogapi.model.entity.Project;
import com.xu.blogapi.model.entity.User;
import com.xu.blogapi.model.enums.UserRoleEnum;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import javax.annotation.Resource;
import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

/**
 * 项目服务测试类
 *
 * @author xu
 */
@SpringBootTest
@ActiveProfiles("test")
@Transactional
class ProjectServiceTest {

    @Resource
    private ProjectService projectService;

    @Resource
    private UserService userService;

    private User testUser;
    private User adminUser;

    @BeforeEach
    void setUp() {
        // 创建测试用户
        testUser = new User();
        testUser.setId(1L);
        testUser.setUsername("testuser");
        testUser.setNickname("测试用户");
        testUser.setRole(UserRoleEnum.USER.getValue().equals("user") ? 0 : 1);

        // 创建管理员用户
        adminUser = new User();
        adminUser.setId(2L);
        adminUser.setUsername("admin");
        adminUser.setNickname("管理员");
        adminUser.setRole(UserRoleEnum.ADMIN.getValue().equals("admin") ? 1 : 0);
    }

    @Test
    void testAddProject() {
        // 准备测试数据
        ProjectAddRequest request = new ProjectAddRequest();
        request.setName("测试项目");
        request.setSlug("test-project");
        request.setDescription("这是一个测试项目");
        request.setProjectType("web");
        request.setTechStack(Arrays.asList("Java", "Spring Boot", "MySQL"));
        request.setGithubUrl("https://github.com/test/test-project");
        request.setDemoUrl("https://demo.test.com");
        request.setCoverImage("https://test.com/image.jpg");
        request.setStatus(1);
        request.setIsFeatured(0);
        request.setIsOpenSource(1);

        // 执行测试
        Long projectId = projectService.addProject(request, testUser);

        // 验证结果
        assertNotNull(projectId);
        assertTrue(projectId > 0);

        // 验证项目是否正确保存
        Project savedProject = projectService.getById(projectId);
        assertNotNull(savedProject);
        assertEquals(request.getName(), savedProject.getName());
        assertEquals(request.getSlug(), savedProject.getSlug());
        assertEquals(request.getDescription(), savedProject.getDescription());
        assertEquals(testUser.getId(), savedProject.getAuthorId());
    }

    @Test
    void testAddProjectWithInvalidParams() {
        // 测试空请求
        assertThrows(BusinessException.class, () -> {
            projectService.addProject(null, testUser);
        });

        // 测试空用户
        ProjectAddRequest request = new ProjectAddRequest();
        request.setName("测试项目");
        assertThrows(BusinessException.class, () -> {
            projectService.addProject(request, null);
        });

        // 测试项目名称为空
        ProjectAddRequest emptyNameRequest = new ProjectAddRequest();
        emptyNameRequest.setName("");
        emptyNameRequest.setSlug("test-project");
        assertThrows(BusinessException.class, () -> {
            projectService.addProject(emptyNameRequest, testUser);
        });

        // 测试别名为空
        ProjectAddRequest emptySlugRequest = new ProjectAddRequest();
        emptySlugRequest.setName("测试项目");
        emptySlugRequest.setSlug("");
        assertThrows(BusinessException.class, () -> {
            projectService.addProject(emptySlugRequest, testUser);
        });
    }

    @Test
    void testUpdateProject() {
        // 先创建一个项目
        ProjectAddRequest addRequest = new ProjectAddRequest();
        addRequest.setName("原始项目");
        addRequest.setSlug("original-project");
        addRequest.setDescription("原始描述");
        addRequest.setProjectType("web");
        addRequest.setStatus(1);
        Long projectId = projectService.addProject(addRequest, testUser);

        // 准备更新数据
        ProjectUpdateRequest updateRequest = new ProjectUpdateRequest();
        updateRequest.setId(projectId);
        updateRequest.setName("更新后的项目");
        updateRequest.setDescription("更新后的描述");
        updateRequest.setProjectType("mobile");
        updateRequest.setTechStack(Arrays.asList("React Native", "TypeScript"));

        // 执行更新
        Boolean result = projectService.updateProject(updateRequest, testUser);

        // 验证结果
        assertTrue(result);

        // 验证更新是否生效
        Project updatedProject = projectService.getById(projectId);
        assertEquals(updateRequest.getName(), updatedProject.getName());
        assertEquals(updateRequest.getDescription(), updatedProject.getDescription());
        assertEquals(updateRequest.getProjectType(), updatedProject.getProjectType());
    }

    @Test
    void testDeleteProject() {
        // 先创建一个项目
        ProjectAddRequest addRequest = new ProjectAddRequest();
        addRequest.setName("待删除项目");
        addRequest.setSlug("to-delete-project");
        addRequest.setDescription("这个项目将被删除");
        addRequest.setStatus(1);
        Long projectId = projectService.addProject(addRequest, testUser);

        // 执行删除
        Boolean result = projectService.deleteProject(projectId, testUser);

        // 验证结果
        assertTrue(result);

        // 验证项目是否被逻辑删除
        Project deletedProject = projectService.getById(projectId);
        assertNull(deletedProject); // 逻辑删除后查询不到
    }

    @Test
    void testGetProjectById() {
        // 先创建一个项目
        ProjectAddRequest addRequest = new ProjectAddRequest();
        addRequest.setName("查询测试项目");
        addRequest.setSlug("query-test-project");
        addRequest.setDescription("用于查询测试的项目");
        addRequest.setStatus(1);
        Long projectId = projectService.addProject(addRequest, testUser);

        // 执行查询
        Project project = projectService.getProjectById(projectId, testUser);

        // 验证结果
        assertNotNull(project);
        assertEquals(projectId, project.getId());
        assertEquals(addRequest.getName(), project.getName());
        assertEquals(addRequest.getSlug(), project.getSlug());
    }

    @Test
    void testGetProjectBySlug() {
        // 先创建一个项目
        ProjectAddRequest addRequest = new ProjectAddRequest();
        addRequest.setName("别名查询测试项目");
        addRequest.setSlug("slug-query-test-project");
        addRequest.setDescription("用于别名查询测试的项目");
        addRequest.setStatus(1);
        Long projectId = projectService.addProject(addRequest, testUser);

        // 执行查询
        Project project = projectService.getProjectBySlug(addRequest.getSlug(), testUser);

        // 验证结果
        assertNotNull(project);
        assertEquals(projectId, project.getId());
        assertEquals(addRequest.getName(), project.getName());
        assertEquals(addRequest.getSlug(), project.getSlug());
    }

    @Test
    void testListProjectsByPage() {
        // 创建多个项目进行分页测试
        for (int i = 1; i <= 5; i++) {
            ProjectAddRequest addRequest = new ProjectAddRequest();
            addRequest.setName("分页测试项目" + i);
            addRequest.setSlug("page-test-project-" + i);
            addRequest.setDescription("分页测试项目" + i);
            addRequest.setStatus(1);
            addRequest.setSortOrder(i);
            projectService.addProject(addRequest, testUser);
        }

        // 准备查询请求
        ProjectQueryRequest queryRequest = new ProjectQueryRequest();
        queryRequest.setCurrent(1);
        queryRequest.setPageSize(2);
        queryRequest.setName("分页测试");

        // 执行查询
        Page<Project> projectPage = projectService.listProjectsByPage(queryRequest, testUser);

        // 验证结果
        assertNotNull(projectPage);
        assertTrue(projectPage.getTotal() >= 3);
        assertEquals(2, projectPage.getSize());
        assertFalse(projectPage.getRecords().isEmpty());
    }

    @Test
    void testListFeaturedProjects() {
        // 先创建一个精选项目
        ProjectAddRequest addRequest = new ProjectAddRequest();
        addRequest.setName("精选项目");
        addRequest.setSlug("featured-project");
        addRequest.setDescription("这是一个精选项目");
        addRequest.setStatus(1);
        addRequest.setIsFeatured(1); // 设置为精选
        projectService.addProject(addRequest, testUser);

        // 执行查询
        List<Project> featuredProjects = projectService.listFeaturedProjects(testUser);

        // 验证结果
        assertNotNull(featuredProjects);
        assertTrue(featuredProjects.size() >= 1);
        assertTrue(featuredProjects.stream().anyMatch(p -> p.getName().equals("精选项目")));
    }

    @Test
    void testListOpenSourceProjects() {
        // 先创建一个开源项目
        ProjectAddRequest addRequest = new ProjectAddRequest();
        addRequest.setName("开源项目");
        addRequest.setSlug("opensource-project");
        addRequest.setDescription("这是一个开源项目");
        addRequest.setStatus(1);
        addRequest.setIsOpenSource(1); // 设置为开源
        projectService.addProject(addRequest, testUser);

        // 执行查询
        List<Project> openSourceProjects = projectService.listOpenSourceProjects(testUser);

        // 验证结果
        assertNotNull(openSourceProjects);
        assertTrue(openSourceProjects.size() >= 1);
        assertTrue(openSourceProjects.stream().anyMatch(p -> p.getName().equals("开源项目")));
    }

    @Test
    void testListProjectsByAuthor() {
        // 先创建一个项目
        ProjectAddRequest addRequest = new ProjectAddRequest();
        addRequest.setName("作者项目");
        addRequest.setSlug("author-project");
        addRequest.setDescription("作者的项目");
        addRequest.setStatus(1);
        projectService.addProject(addRequest, testUser);

        // 执行查询
        List<Project> authorProjects = projectService.listProjectsByAuthor(testUser.getId(), testUser);

        // 验证结果
        assertNotNull(authorProjects);
        assertTrue(authorProjects.size() >= 1);
        assertTrue(authorProjects.stream().anyMatch(p -> p.getName().equals("作者项目")));
    }

    @Test
    void testListProjectsByType() {
        // 先创建一个特定类型的项目
        ProjectAddRequest addRequest = new ProjectAddRequest();
        addRequest.setName("移动应用项目");
        addRequest.setSlug("mobile-app-project");
        addRequest.setDescription("移动应用项目");
        addRequest.setProjectType("mobile");
        addRequest.setStatus(1);
        projectService.addProject(addRequest, testUser);

        // 执行查询
        List<Project> mobileProjects = projectService.listProjectsByType("mobile", testUser);

        // 验证结果
        assertNotNull(mobileProjects);
        assertTrue(mobileProjects.size() >= 1);
        assertTrue(mobileProjects.stream().anyMatch(p -> p.getProjectType().equals("mobile")));
    }

    @Test
    void testCountUserProjects() {
        // 先创建几个项目
        for (int i = 1; i <= 2; i++) {
            ProjectAddRequest addRequest = new ProjectAddRequest();
            addRequest.setName("统计测试项目" + i);
            addRequest.setSlug("count-test-project-" + i);
            addRequest.setDescription("统计测试项目" + i);
            addRequest.setStatus(1);
            projectService.addProject(addRequest, testUser);
        }

        // 执行统计
        Long count = projectService.countUserProjects(testUser.getId());

        // 验证结果
        assertNotNull(count);
        assertTrue(count >= 2);
    }

    @Test
    void testCountFeaturedProjects() {
        // 先创建一个精选项目
        ProjectAddRequest addRequest = new ProjectAddRequest();
        addRequest.setName("精选统计项目");
        addRequest.setSlug("featured-count-project");
        addRequest.setDescription("精选统计项目");
        addRequest.setStatus(1);
        addRequest.setIsFeatured(1);
        projectService.addProject(addRequest, testUser);

        // 执行统计
        Long count = projectService.countFeaturedProjects();

        // 验证结果
        assertNotNull(count);
        assertTrue(count >= 1);
    }

    @Test
    void testCountOpenSourceProjects() {
        // 先创建一个开源项目
        ProjectAddRequest addRequest = new ProjectAddRequest();
        addRequest.setName("开源统计项目");
        addRequest.setSlug("opensource-count-project");
        addRequest.setDescription("开源统计项目");
        addRequest.setStatus(1);
        addRequest.setIsOpenSource(1);
        projectService.addProject(addRequest, testUser);

        // 执行统计
        Long count = projectService.countOpenSourceProjects();

        // 验证结果
        assertNotNull(count);
        assertTrue(count >= 1);
    }

    @Test
    void testValidProject() {
        // 测试有效项目
        Project validProject = new Project();
        validProject.setName("有效项目");
        validProject.setSlug("valid-project");
        validProject.setDescription("有效的项目描述");
        validProject.setAuthorId(testUser.getId());
        validProject.setStatus(1);

        assertDoesNotThrow(() -> {
            projectService.validProject(validProject);
        });

        // 测试无效项目 - 名称为空
        Project invalidProject = new Project();
        invalidProject.setName("");
        invalidProject.setSlug("invalid-project");
        invalidProject.setAuthorId(testUser.getId());

        assertThrows(BusinessException.class, () -> {
            projectService.validProject(invalidProject);
        });

        // 测试无效项目 - 别名为空
        Project invalidSlugProject = new Project();
        invalidSlugProject.setName("无效项目");
        invalidSlugProject.setSlug("");
        invalidSlugProject.setAuthorId(testUser.getId());

        assertThrows(BusinessException.class, () -> {
            projectService.validProject(invalidSlugProject);
        });
    }

    @Test
    void testExistsById() {
        // 先创建一个项目
        ProjectAddRequest addRequest = new ProjectAddRequest();
        addRequest.setName("存在性测试项目");
        addRequest.setSlug("exists-test-project");
        addRequest.setDescription("存在性测试项目");
        addRequest.setCoverImage("https://example.com/cover.jpg");
        addRequest.setStatus(1);
        Long projectId = projectService.addProject(addRequest, testUser);

        // 测试存在的项目
        assertTrue(projectService.existsById(projectId));

        // 测试不存在的项目
        assertFalse(projectService.existsById(99999L));
    }

    @Test
    void testExistsBySlug() {
        // 先创建一个项目
        ProjectAddRequest addRequest = new ProjectAddRequest();
        addRequest.setName("别名存在性测试项目");
        addRequest.setSlug("slug-exists-test-project");
        addRequest.setDescription("别名存在性测试项目");
        addRequest.setStatus(1);
        projectService.addProject(addRequest, testUser);

        // 测试存在的别名
        assertTrue(projectService.existsBySlug("slug-exists-test-project"));

        // 测试不存在的别名
        assertFalse(projectService.existsBySlug("non-exists-slug"));

        // 测试排除自身的别名检查
        assertFalse(projectService.existsBySlugExcludeId("slug-exists-test-project", 
            projectService.getProjectBySlug("slug-exists-test-project", testUser).getId()));
    }
}