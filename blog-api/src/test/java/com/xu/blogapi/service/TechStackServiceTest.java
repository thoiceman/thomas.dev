package com.xu.blogapi.service;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.xu.blogapi.exception.BusinessException;
import com.xu.blogapi.exception.TechStackException;
import com.xu.blogapi.model.dto.techstack.TechStackAddRequest;
import com.xu.blogapi.model.dto.techstack.TechStackQueryRequest;
import com.xu.blogapi.model.dto.techstack.TechStackUpdateRequest;
import com.xu.blogapi.model.dto.techstack.TechStackResponse;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import javax.annotation.Resource;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

/**
 * 技术栈服务测试
 *
 * @author xu
 */
@SpringBootTest
@ActiveProfiles("test")
@Transactional
public class TechStackServiceTest {

    @Resource
    private TechStackService techStackService;

    /**
     * 测试创建技术栈
     */
    @Test
    public void testAddTechStack() {
        // 准备测试数据
        TechStackAddRequest request = new TechStackAddRequest();
        request.setName("Spring Boot");
        request.setCategory("后端框架");
        request.setDescription("Spring Boot是一个基于Spring的快速开发框架");
        request.setIcon("https://spring.io/images/spring-logo.svg");
        request.setOfficialUrl("https://spring.io/projects/spring-boot");
        request.setSortOrder(1);
        request.setStatus(1);

        // 执行测试
        Long techStackId = techStackService.addTechStack(request);

        // 验证结果
        assertNotNull(techStackId);
        assertTrue(techStackId > 0);

        // 验证技术栈是否创建成功
        TechStackResponse response = techStackService.getTechStackById(techStackId);
        assertNotNull(response);
        assertEquals("Spring Boot", response.getName());
        assertEquals("后端框架", response.getCategory());
        assertEquals("Spring Boot是一个基于Spring的快速开发框架", response.getDescription());
        assertEquals("https://spring.io/images/spring-logo.svg", response.getIcon());
        assertEquals("https://spring.io/projects/spring-boot", response.getOfficialUrl());
        assertEquals(1, response.getSortOrder());
        assertEquals(1, response.getStatus());
    }

    /**
     * 测试创建技术栈 - 参数为空
     */
    @Test
    public void testAddTechStackWithNullRequest() {
        assertThrows(TechStackException.class, () -> {
            techStackService.addTechStack(null);
        });
    }

    /**
     * 测试创建技术栈 - 名称为空
     */
    @Test
    public void testAddTechStackWithEmptyName() {
        TechStackAddRequest request = new TechStackAddRequest();
        request.setName("");
        request.setCategory("后端框架");

        assertThrows(TechStackException.class, () -> {
            techStackService.addTechStack(request);
        });
    }

    /**
     * 测试创建技术栈 - 分类为空
     */
    @Test
    public void testAddTechStackWithEmptyCategory() {
        TechStackAddRequest request = new TechStackAddRequest();
        request.setName("Spring Boot");
        request.setCategory("");

        assertThrows(TechStackException.class, () -> {
            techStackService.addTechStack(request);
        });
    }

    /**
     * 测试更新技术栈
     */
    @Test
    public void testUpdateTechStack() {
        // 先创建一个技术栈
        TechStackAddRequest addRequest = new TechStackAddRequest();
        addRequest.setName("Vue.js");
        addRequest.setCategory("前端框架");
        addRequest.setDescription("Vue.js是一个渐进式JavaScript框架");
        addRequest.setSortOrder(2);
        addRequest.setStatus(1);
        Long techStackId = techStackService.addTechStack(addRequest);

        // 准备更新数据
        TechStackUpdateRequest updateRequest = new TechStackUpdateRequest();
        updateRequest.setId(techStackId);
        updateRequest.setName("Vue.js");
        updateRequest.setCategory("前端框架");
        updateRequest.setDescription("Vue.js是一个用于构建用户界面的渐进式JavaScript框架");
        updateRequest.setIcon("https://vuejs.org/images/logo.png");
        updateRequest.setOfficialUrl("https://vuejs.org/");
        updateRequest.setSortOrder(3);
        updateRequest.setStatus(1);

        // 执行更新
        Boolean result = techStackService.updateTechStack(updateRequest);
        assertTrue(result);

        // 验证更新结果
        TechStackResponse response = techStackService.getTechStackById(techStackId);
        assertEquals("Vue.js是一个用于构建用户界面的渐进式JavaScript框架", response.getDescription());
        assertEquals("https://vuejs.org/images/logo.png", response.getIcon());
        assertEquals("https://vuejs.org/", response.getOfficialUrl());
        assertEquals(3, response.getSortOrder());
    }

    /**
     * 测试删除技术栈
     */
    @Test
    public void testDeleteTechStack() {
        // 先创建一个技术栈
        TechStackAddRequest addRequest = new TechStackAddRequest();
        addRequest.setName("React");
        addRequest.setCategory("前端框架");
        Long techStackId = techStackService.addTechStack(addRequest);

        // 执行删除
        Boolean result = techStackService.deleteTechStack(techStackId);
        assertTrue(result);

        // 验证删除结果
        assertThrows(BusinessException.class, () -> {
            techStackService.getTechStackById(techStackId);
        });
    }

    /**
     * 测试根据ID获取技术栈
     */
    @Test
    public void testGetTechStackById() {
        // 先创建一个技术栈
        TechStackAddRequest addRequest = new TechStackAddRequest();
        addRequest.setName("MySQL");
        addRequest.setCategory("数据库");
        addRequest.setDescription("MySQL是一个关系型数据库管理系统");
        Long techStackId = techStackService.addTechStack(addRequest);

        // 执行查询
        TechStackResponse response = techStackService.getTechStackById(techStackId);

        // 验证结果
        assertNotNull(response);
        assertEquals("MySQL", response.getName());
        assertEquals("数据库", response.getCategory());
        assertEquals("MySQL是一个关系型数据库管理系统", response.getDescription());
    }

    /**
     * 测试根据名称获取技术栈
     */
    @Test
    public void testGetTechStackByName() {
        // 先创建一个技术栈
        TechStackAddRequest addRequest = new TechStackAddRequest();
        addRequest.setName("Redis");
        addRequest.setCategory("缓存");
        addRequest.setDescription("Redis是一个内存数据结构存储");
        techStackService.addTechStack(addRequest);

        // 执行查询
        TechStackResponse response = techStackService.getTechStackByName("Redis");

        // 验证结果
        assertNotNull(response);
        assertEquals("Redis", response.getName());
        assertEquals("缓存", response.getCategory());
        assertEquals("Redis是一个内存数据结构存储", response.getDescription());
    }

    /**
     * 测试分页查询技术栈列表
     */
    @Test
    public void testListTechStacksByPage() {
        // 创建测试数据
        createTestTechStacks();

        // 准备查询请求
        TechStackQueryRequest queryRequest = new TechStackQueryRequest();
        queryRequest.setCurrent(1);
        queryRequest.setPageSize(10);

        // 执行查询
        IPage<TechStackResponse> page = techStackService.listTechStacksByPage(queryRequest);

        // 验证结果
        assertNotNull(page);
        assertTrue(page.getTotal() >= 3);
        assertTrue(page.getRecords().size() >= 3);
    }

    /**
     * 测试获取所有技术栈
     */
    @Test
    public void testListAllTechStacks() {
        // 创建测试数据
        createTestTechStacks();

        // 执行查询
        List<TechStackResponse> techStackList = techStackService.listAllTechStacks();

        // 验证结果
        assertNotNull(techStackList);
        assertTrue(techStackList.size() >= 3);
    }

    /**
     * 测试根据分类获取技术栈列表
     */
    @Test
    public void testListTechStacksByCategory() {
        // 创建测试数据
        createTestTechStacks();

        // 执行查询
        List<TechStackResponse> techStackList = techStackService.listTechStacksByCategory("后端框架");

        // 验证结果
        assertNotNull(techStackList);
        assertTrue(techStackList.size() >= 1);
        techStackList.forEach(techStack -> assertEquals("后端框架", techStack.getCategory()));
    }

    /**
     * 测试获取所有技术分类
     */
    @Test
    public void testListAllCategories() {
        // 创建测试数据
        createTestTechStacks();

        // 执行查询
        List<String> categories = techStackService.listAllCategories();

        // 验证结果
        assertNotNull(categories);
        assertTrue(categories.size() >= 2);
        assertTrue(categories.contains("后端框架"));
        assertTrue(categories.contains("前端框架"));
    }

    /**
     * 测试检查技术栈是否存在
     */
    @Test
    public void testExistsById() {
        // 先创建一个技术栈
        TechStackAddRequest addRequest = new TechStackAddRequest();
        addRequest.setName("Docker");
        addRequest.setCategory("容器化");
        Long techStackId = techStackService.addTechStack(addRequest);

        // 测试存在的情况
        Boolean exists = techStackService.existsById(techStackId);
        assertTrue(exists);

        // 测试不存在的情况
        Boolean notExists = techStackService.existsById(999999L);
        assertFalse(notExists);
    }

    /**
     * 测试根据名称检查技术栈是否存在
     */
    @Test
    public void testExistsByName() {
        // 先创建一个技术栈
        TechStackAddRequest addRequest = new TechStackAddRequest();
        addRequest.setName("Kubernetes");
        addRequest.setCategory("容器编排");
        techStackService.addTechStack(addRequest);

        // 测试存在的情况
        Boolean exists = techStackService.existsByName("Kubernetes");
        assertTrue(exists);

        // 测试不存在的情况
        Boolean notExists = techStackService.existsByName("不存在的技术");
        assertFalse(notExists);
    }

    /**
     * 测试检查技术栈名称是否存在（排除指定ID）
     */
    @Test
    public void testExistsByNameAndNotId() {
        // 先创建两个技术栈
        TechStackAddRequest addRequest1 = new TechStackAddRequest();
        addRequest1.setName("Nginx");
        addRequest1.setCategory("Web服务器");
        Long techStackId1 = techStackService.addTechStack(addRequest1);

        TechStackAddRequest addRequest2 = new TechStackAddRequest();
        addRequest2.setName("Apache");
        addRequest2.setCategory("Web服务器");
        Long techStackId2 = techStackService.addTechStack(addRequest2);

        // 测试排除自己的情况
        Boolean notExists = techStackService.existsByNameAndNotId("Nginx", techStackId1);
        assertFalse(notExists);

        // 测试与其他记录重复的情况
        Boolean exists = techStackService.existsByNameAndNotId("Nginx", techStackId2);
        assertTrue(exists);
    }

    /**
     * 创建测试数据
     */
    private void createTestTechStacks() {
        // 创建后端框架技术栈
        TechStackAddRequest request1 = new TechStackAddRequest();
        request1.setName("Spring Framework");
        request1.setCategory("后端框架");
        request1.setDescription("Spring是一个开源的Java应用框架");
        request1.setSortOrder(1);
        request1.setStatus(1);
        techStackService.addTechStack(request1);

        // 创建前端框架技术栈
        TechStackAddRequest request2 = new TechStackAddRequest();
        request2.setName("Angular");
        request2.setCategory("前端框架");
        request2.setDescription("Angular是一个TypeScript应用框架");
        request2.setSortOrder(2);
        request2.setStatus(1);
        techStackService.addTechStack(request2);

        // 创建数据库技术栈
        TechStackAddRequest request3 = new TechStackAddRequest();
        request3.setName("PostgreSQL");
        request3.setCategory("数据库");
        request3.setDescription("PostgreSQL是一个开源的对象关系数据库系统");
        request3.setSortOrder(3);
        request3.setStatus(1);
        techStackService.addTechStack(request3);
    }
}