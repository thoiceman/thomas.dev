package com.xu.blogapi.service;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.xu.blogapi.exception.BusinessException;
import com.xu.blogapi.model.dto.thought.ThoughtAddRequest;
import com.xu.blogapi.model.dto.thought.ThoughtQueryRequest;
import com.xu.blogapi.model.dto.thought.ThoughtUpdateRequest;
import com.xu.blogapi.model.entity.Thought;
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
 * 想法服务测试类
 *
 * @author xu
 */
@SpringBootTest
@ActiveProfiles("test")
@Transactional
class ThoughtServiceTest {

    @Resource
    private ThoughtService thoughtService;

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
    void testAddThought() {
        // 准备测试数据
        ThoughtAddRequest request = new ThoughtAddRequest();
        request.setContent("这是一个测试想法");
        request.setMood("开心");
        request.setLocation("北京");
        request.setWeather("晴天");
        request.setStatus(1);
        request.setImages(Arrays.asList("https://example.com/image1.jpg"));

        // 执行测试
        Long thoughtId = thoughtService.addThought(request, testUser);

        // 验证结果
        assertNotNull(thoughtId);
        assertTrue(thoughtId > 0);

        // 验证想法是否正确保存
        Thought savedThought = thoughtService.getById(thoughtId);
        assertNotNull(savedThought);
        assertEquals(request.getContent(), savedThought.getContent());
        assertEquals(request.getMood(), savedThought.getMood());
        assertEquals(request.getLocation(), savedThought.getLocation());
        assertEquals(request.getWeather(), savedThought.getWeather());
        assertEquals(request.getStatus(), savedThought.getStatus());
        assertEquals(testUser.getId(), savedThought.getAuthorId());
    }

    @Test
    void testAddThoughtWithInvalidParams() {
        // 测试空请求
        assertThrows(BusinessException.class, () -> {
            thoughtService.addThought(null, testUser);
        });

        // 测试空用户
        ThoughtAddRequest request = new ThoughtAddRequest();
        request.setContent("测试内容");
        assertThrows(BusinessException.class, () -> {
            thoughtService.addThought(request, null);
        });

        // 测试空内容
        request.setContent("");
        assertThrows(BusinessException.class, () -> {
            thoughtService.addThought(request, testUser);
        });

        // 测试内容过长
        request.setContent("a".repeat(5001));
        assertThrows(BusinessException.class, () -> {
            thoughtService.addThought(request, testUser);
        });
    }

    @Test
    void testUpdateThought() {
        // 先创建一个想法
        ThoughtAddRequest addRequest = new ThoughtAddRequest();
        addRequest.setContent("原始内容");
        addRequest.setMood("平静");
        addRequest.setStatus(1);
        Long thoughtId = thoughtService.addThought(addRequest, testUser);

        // 准备更新数据
        ThoughtUpdateRequest updateRequest = new ThoughtUpdateRequest();
        updateRequest.setId(thoughtId);
        updateRequest.setContent("更新后的内容");
        updateRequest.setMood("开心");
        updateRequest.setLocation("上海");

        // 执行更新
        Boolean result = thoughtService.updateThought(updateRequest, testUser);

        // 验证结果
        assertTrue(result);

        // 验证想法是否正确更新
        Thought updatedThought = thoughtService.getById(thoughtId);
        assertNotNull(updatedThought);
        assertEquals(updateRequest.getContent(), updatedThought.getContent());
        assertEquals(updateRequest.getMood(), updatedThought.getMood());
        assertEquals(updateRequest.getLocation(), updatedThought.getLocation());
    }

    @Test
    void testDeleteThought() {
        // 先创建一个想法
        ThoughtAddRequest addRequest = new ThoughtAddRequest();
        addRequest.setContent("待删除的内容");
        addRequest.setStatus(1);
        Long thoughtId = thoughtService.addThought(addRequest, testUser);

        // 执行删除
        Boolean result = thoughtService.deleteThought(thoughtId, testUser);

        // 验证结果
        assertTrue(result);

        // 验证想法是否被逻辑删除
        Thought deletedThought = thoughtService.getById(thoughtId);
        assertNotNull(deletedThought);
        assertEquals(1, deletedThought.getIsDelete());
    }

    @Test
    void testGetThoughtById() {
        // 先创建一个公开想法
        ThoughtAddRequest addRequest = new ThoughtAddRequest();
        addRequest.setContent("公开想法内容");
        addRequest.setStatus(1);
        Long thoughtId = thoughtService.addThought(addRequest, testUser);

        // 测试获取想法
        Thought thought = thoughtService.getThoughtById(thoughtId, testUser);
        assertNotNull(thought);
        assertEquals(addRequest.getContent(), thought.getContent());

        // 测试获取不存在的想法
        assertThrows(BusinessException.class, () -> {
            thoughtService.getThoughtById(999L, testUser);
        });
    }

    @Test
    void testListThoughtsByPage() {
        // 先创建几个想法
        for (int i = 1; i <= 5; i++) {
            ThoughtAddRequest addRequest = new ThoughtAddRequest();
            addRequest.setContent("想法内容 " + i);
            addRequest.setStatus(1);
            thoughtService.addThought(addRequest, testUser);
        }

        // 准备查询请求
        ThoughtQueryRequest queryRequest = new ThoughtQueryRequest();
        queryRequest.setCurrent(1);
        queryRequest.setPageSize(3);

        // 执行查询
        Page<Thought> page = thoughtService.listThoughtsByPage(queryRequest, testUser);

        // 验证结果
        assertNotNull(page);
        assertTrue(page.getTotal() >= 5);
        assertEquals(3, page.getSize());
        assertEquals(1, page.getCurrent());
        assertFalse(page.getRecords().isEmpty());
    }



    @Test
    void testValidThought() {
        // 测试有效想法
        Thought validThought = new Thought();
        validThought.setContent("有效的想法内容");
        validThought.setMood("开心");
        validThought.setLocation("北京");
        validThought.setWeather("晴天");
        validThought.setStatus(1);

        // 应该不抛出异常
        assertDoesNotThrow(() -> {
            thoughtService.validThought(validThought);
        });

        // 测试无效想法 - 空内容
        Thought invalidThought = new Thought();
        invalidThought.setContent("");
        assertThrows(BusinessException.class, () -> {
            thoughtService.validThought(invalidThought);
        });

        // 测试无效想法 - 内容过长
        invalidThought.setContent("a".repeat(5001));
        assertThrows(BusinessException.class, () -> {
            thoughtService.validThought(invalidThought);
        });
    }

    @Test
    void testExistsById() {
        // 先创建一个想法
        ThoughtAddRequest addRequest = new ThoughtAddRequest();
        addRequest.setContent("存在性测试");
        addRequest.setStatus(1);
        Long thoughtId = thoughtService.addThought(addRequest, testUser);

        // 测试存在的想法
        assertTrue(thoughtService.existsById(thoughtId));

        // 测试不存在的想法
        assertFalse(thoughtService.existsById(999L));

        // 测试无效ID
        assertFalse(thoughtService.existsById(null));
        assertFalse(thoughtService.existsById(0L));
        assertFalse(thoughtService.existsById(-1L));
    }

    @Test
    void testCountUserThoughts() {
        // 获取初始数量
        Long initialCount = thoughtService.countUserThoughts(testUser.getId());

        // 创建几个想法
        for (int i = 1; i <= 3; i++) {
            ThoughtAddRequest addRequest = new ThoughtAddRequest();
            addRequest.setContent("计数测试想法 " + i);
            addRequest.setStatus(1);
            thoughtService.addThought(addRequest, testUser);
        }

        // 验证数量增加
        Long newCount = thoughtService.countUserThoughts(testUser.getId());
        assertEquals(initialCount + 3, newCount);

        // 测试无效用户ID
        assertEquals(0L, thoughtService.countUserThoughts(null));
        assertEquals(0L, thoughtService.countUserThoughts(0L));
    }


}