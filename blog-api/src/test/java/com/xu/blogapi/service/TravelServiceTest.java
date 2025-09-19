package com.xu.blogapi.service;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.xu.blogapi.exception.BusinessException;
import com.xu.blogapi.model.dto.travel.TravelAddRequest;
import com.xu.blogapi.model.dto.travel.TravelQueryRequest;
import com.xu.blogapi.model.dto.travel.TravelUpdateRequest;
import com.xu.blogapi.model.entity.Travel;
import com.xu.blogapi.model.entity.User;
import com.xu.blogapi.model.enums.UserRoleEnum;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import javax.annotation.Resource;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

/**
 * 旅行记录服务测试类
 *
 * @author xu
 */
@SpringBootTest
@ActiveProfiles("test")
@Transactional
class TravelServiceTest {

    @Resource
    private TravelService travelService;

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
        testUser.setRole(0); // 0表示普通用户

        // 创建管理员用户
        adminUser = new User();
        adminUser.setId(2L);
        adminUser.setUsername("admin");
        adminUser.setNickname("管理员");
        adminUser.setRole(1); // 1表示管理员
    }

    @Test
    void testAddTravel() {
        // 准备测试数据
        TravelAddRequest request = new TravelAddRequest();
        request.setTitle("日本东京之旅");
        request.setDestination("东京");
        request.setCountry("日本");
        request.setCity("东京");
        request.setDescription("一次美妙的东京之旅，体验了日本的文化和美食");
        request.setStartDate(LocalDate.of(2024, 3, 1));
        request.setEndDate(LocalDate.of(2024, 3, 7));
        request.setBudget(new BigDecimal("8000.00"));
        request.setTransportation("飞机");
        request.setWeather("晴朗");
        request.setRating(5);
        request.setStatus(1);
        request.setCoverImage("https://example.com/tokyo.jpg");
        request.setLatitude(new BigDecimal("35.6762"));
        request.setLongitude(new BigDecimal("139.6503"));

        // 执行测试
        Long travelId = travelService.addTravel(request, testUser);

        // 验证结果
        assertNotNull(travelId);
        assertTrue(travelId > 0);

        // 验证保存的数据
        Travel savedTravel = travelService.getTravelById(travelId, testUser);
        assertNotNull(savedTravel);
        assertEquals("日本东京之旅", savedTravel.getTitle());
        assertEquals("东京", savedTravel.getDestination());
        assertEquals(testUser.getId(), savedTravel.getAuthorId());
        assertEquals(7, savedTravel.getDuration()); // 自动计算的天数
    }

    @Test
    void testAddTravelWithInvalidParams() {
        // 测试空请求
        assertThrows(BusinessException.class, () -> {
            travelService.addTravel(null, testUser);
        });

        // 测试缺少必填字段
        TravelAddRequest request = new TravelAddRequest();
        assertThrows(BusinessException.class, () -> {
            travelService.addTravel(request, testUser);
        });

        // 测试日期逻辑错误
        request.setTitle("测试旅行");
        request.setDestination("测试目的地");
        request.setStartDate(LocalDate.of(2024, 3, 10));
        request.setEndDate(LocalDate.of(2024, 3, 5)); // 结束日期早于开始日期
        assertThrows(BusinessException.class, () -> {
            travelService.addTravel(request, testUser);
        });
    }

    @Test
    void testUpdateTravel() {
        // 先创建一个旅行记录
        TravelAddRequest addRequest = new TravelAddRequest();
        addRequest.setTitle("原始标题");
        addRequest.setDestination("原始目的地");
        addRequest.setStartDate(LocalDate.of(2024, 3, 1));
        addRequest.setEndDate(LocalDate.of(2024, 3, 7));
        Long travelId = travelService.addTravel(addRequest, testUser);

        // 准备更新数据
        TravelUpdateRequest updateRequest = new TravelUpdateRequest();
        updateRequest.setId(travelId);
        updateRequest.setTitle("更新后的标题");
        updateRequest.setDestination("更新后的目的地");
        updateRequest.setDescription("更新后的描述");
        updateRequest.setRating(4);

        // 执行更新
        Boolean result = travelService.updateTravel(updateRequest, testUser);

        // 验证结果
        assertTrue(result);

        // 验证更新后的数据
        Travel updatedTravel = travelService.getTravelById(travelId, testUser);
        assertEquals("更新后的标题", updatedTravel.getTitle());
        assertEquals("更新后的目的地", updatedTravel.getDestination());
        assertEquals("更新后的描述", updatedTravel.getDescription());
        assertEquals(4, updatedTravel.getRating());
    }

    @Test
    void testDeleteTravel() {
        // 先创建一个旅行记录
        TravelAddRequest addRequest = new TravelAddRequest();
        addRequest.setTitle("待删除的旅行");
        addRequest.setDestination("测试目的地");
        addRequest.setStartDate(LocalDate.of(2024, 3, 1));
        addRequest.setEndDate(LocalDate.of(2024, 3, 7));
        Long travelId = travelService.addTravel(addRequest, testUser);

        // 执行删除
        Boolean result = travelService.deleteTravel(travelId, testUser);

        // 验证结果
        assertTrue(result);

        // 验证记录已被删除（逻辑删除）
        assertThrows(BusinessException.class, () -> {
            travelService.getTravelById(travelId, testUser);
        });
    }

    @Test
    void testGetTravelById() {
        // 先创建一个旅行记录
        TravelAddRequest addRequest = new TravelAddRequest();
        addRequest.setTitle("测试旅行");
        addRequest.setDestination("测试目的地");
        addRequest.setStartDate(LocalDate.of(2024, 3, 1));
        addRequest.setEndDate(LocalDate.of(2024, 3, 7));
        addRequest.setStatus(1); // 公开
        Long travelId = travelService.addTravel(addRequest, testUser);

        // 执行查询
        Travel travel = travelService.getTravelById(travelId, testUser);

        // 验证结果
        assertNotNull(travel);
        assertEquals("测试旅行", travel.getTitle());
        assertEquals("测试目的地", travel.getDestination());
        assertEquals(testUser.getId(), travel.getAuthorId());
    }

    @Test
    void testListTravelsByPage() {
        // 先创建几个旅行记录
        for (int i = 1; i <= 3; i++) {
            TravelAddRequest addRequest = new TravelAddRequest();
            addRequest.setTitle("旅行记录 " + i);
            addRequest.setDestination("目的地 " + i);
            addRequest.setStartDate(LocalDate.of(2024, 3, i));
            addRequest.setEndDate(LocalDate.of(2024, 3, i + 5));
            addRequest.setStatus(1); // 公开
            travelService.addTravel(addRequest, testUser);
        }

        // 准备查询条件
        TravelQueryRequest queryRequest = new TravelQueryRequest();
        queryRequest.setCurrent(1); // 修复：使用int类型而不是Long类型
        queryRequest.setPageSize(10); // 修复：使用int类型而不是Long类型

        // 执行查询
        Page<Travel> page = travelService.listTravelsByPage(queryRequest, testUser);

        // 验证结果
        assertNotNull(page);
        assertTrue(page.getTotal() >= 3);
        assertFalse(page.getRecords().isEmpty());
    }

    @Test
    void testListTravelsByAuthor() {
        // 先创建几个旅行记录
        for (int i = 1; i <= 2; i++) {
            TravelAddRequest addRequest = new TravelAddRequest();
            addRequest.setTitle("作者旅行记录 " + i);
            addRequest.setDestination("目的地 " + i);
            addRequest.setStartDate(LocalDate.of(2024, 3, i));
            addRequest.setEndDate(LocalDate.of(2024, 3, i + 3));
            addRequest.setStatus(1); // 公开
            travelService.addTravel(addRequest, testUser);
        }

        // 执行查询
        List<Travel> travels = travelService.listTravelsByAuthor(testUser.getId(), testUser);

        // 验证结果
        assertNotNull(travels);
        assertTrue(travels.size() >= 2);
        travels.forEach(travel -> assertEquals(testUser.getId(), travel.getAuthorId()));
    }

    @Test
    void testListTravelsByDestination() {
        // 先创建旅行记录
        TravelAddRequest addRequest = new TravelAddRequest();
        addRequest.setTitle("巴黎之旅");
        addRequest.setDestination("巴黎");
        addRequest.setStartDate(LocalDate.of(2024, 3, 1));
        addRequest.setEndDate(LocalDate.of(2024, 3, 7));
        addRequest.setStatus(1); // 公开
        travelService.addTravel(addRequest, testUser);

        // 执行查询
        List<Travel> travels = travelService.listTravelsByDestination("巴黎", testUser);

        // 验证结果
        assertNotNull(travels);
        assertFalse(travels.isEmpty());
        travels.forEach(travel -> assertTrue(travel.getDestination().contains("巴黎")));
    }

    @Test
    void testListPublicTravels() {
        // 先创建公开和私密的旅行记录
        TravelAddRequest publicRequest = new TravelAddRequest();
        publicRequest.setTitle("公开旅行");
        publicRequest.setDestination("公开目的地");
        publicRequest.setStartDate(LocalDate.of(2024, 3, 1));
        publicRequest.setEndDate(LocalDate.of(2024, 3, 7));
        publicRequest.setStatus(1); // 公开
        travelService.addTravel(publicRequest, testUser);

        TravelAddRequest privateRequest = new TravelAddRequest();
        privateRequest.setTitle("私密旅行");
        privateRequest.setDestination("私密目的地");
        privateRequest.setStartDate(LocalDate.of(2024, 3, 10));
        privateRequest.setEndDate(LocalDate.of(2024, 3, 15));
        privateRequest.setStatus(0); // 私密
        travelService.addTravel(privateRequest, testUser);

        // 执行查询
        List<Travel> publicTravels = travelService.listPublicTravels(testUser);

        // 验证结果
        assertNotNull(publicTravels);
        publicTravels.forEach(travel -> assertEquals(1, travel.getStatus()));
    }

    @Test
    void testListHighRatedTravels() {
        // 先创建高评分和低评分的旅行记录
        TravelAddRequest highRatedRequest = new TravelAddRequest();
        highRatedRequest.setTitle("高评分旅行");
        highRatedRequest.setDestination("高评分目的地");
        highRatedRequest.setStartDate(LocalDate.of(2024, 3, 1));
        highRatedRequest.setEndDate(LocalDate.of(2024, 3, 7));
        highRatedRequest.setRating(5);
        highRatedRequest.setStatus(1); // 公开
        travelService.addTravel(highRatedRequest, testUser);

        TravelAddRequest lowRatedRequest = new TravelAddRequest();
        lowRatedRequest.setTitle("低评分旅行");
        lowRatedRequest.setDestination("低评分目的地");
        lowRatedRequest.setStartDate(LocalDate.of(2024, 3, 10));
        lowRatedRequest.setEndDate(LocalDate.of(2024, 3, 15));
        lowRatedRequest.setRating(2);
        lowRatedRequest.setStatus(1); // 公开
        travelService.addTravel(lowRatedRequest, testUser);

        // 执行查询
        List<Travel> highRatedTravels = travelService.listHighRatedTravels(testUser);

        // 验证结果
        assertNotNull(highRatedTravels);
        highRatedTravels.forEach(travel -> assertTrue(travel.getRating() >= 4));
    }

    @Test
    void testCountUserTravels() {
        // 先创建几个旅行记录
        for (int i = 1; i <= 3; i++) {
            TravelAddRequest addRequest = new TravelAddRequest();
            addRequest.setTitle("计数测试旅行 " + i);
            addRequest.setDestination("目的地 " + i);
            addRequest.setStartDate(LocalDate.of(2024, 3, i));
            addRequest.setEndDate(LocalDate.of(2024, 3, i + 3));
            travelService.addTravel(addRequest, testUser);
        }

        // 执行统计
        Long count = travelService.countUserTravels(testUser.getId());

        // 验证结果
        assertNotNull(count);
        assertTrue(count >= 3);
    }

    @Test
    void testValidTravel() {
        // 测试有效的旅行记录
        Travel validTravel = new Travel();
        validTravel.setTitle("有效旅行");
        validTravel.setDestination("有效目的地");
        validTravel.setStartDate(LocalDate.of(2024, 3, 1));
        validTravel.setEndDate(LocalDate.of(2024, 3, 7));
        validTravel.setAuthorId(1L);
        validTravel.setRating(4);
        validTravel.setStatus(1);
        validTravel.setBudget(new BigDecimal("5000.00"));
        validTravel.setLatitude(new BigDecimal("35.6762"));
        validTravel.setLongitude(new BigDecimal("139.6503"));

        // 应该不抛出异常
        assertDoesNotThrow(() -> {
            travelService.validTravel(validTravel);
        });

        // 测试无效的旅行记录
        Travel invalidTravel = new Travel();
        assertThrows(BusinessException.class, () -> {
            travelService.validTravel(invalidTravel);
        });

        // 测试日期逻辑错误
        invalidTravel.setTitle("无效旅行");
        invalidTravel.setDestination("无效目的地");
        invalidTravel.setStartDate(LocalDate.of(2024, 3, 10));
        invalidTravel.setEndDate(LocalDate.of(2024, 3, 5)); // 结束日期早于开始日期
        invalidTravel.setAuthorId(1L);
        assertThrows(BusinessException.class, () -> {
            travelService.validTravel(invalidTravel);
        });

        // 测试评分超出范围
        invalidTravel.setStartDate(LocalDate.of(2024, 3, 1));
        invalidTravel.setEndDate(LocalDate.of(2024, 3, 7));
        invalidTravel.setRating(6); // 评分超出范围
        assertThrows(BusinessException.class, () -> {
            travelService.validTravel(invalidTravel);
        });
    }

    @Test
    void testExistsById() {
        // 先创建一个旅行记录
        TravelAddRequest addRequest = new TravelAddRequest();
        addRequest.setTitle("存在性测试旅行");
        addRequest.setDestination("测试目的地");
        addRequest.setStartDate(LocalDate.of(2024, 3, 1));
        addRequest.setEndDate(LocalDate.of(2024, 3, 7));
        Long travelId = travelService.addTravel(addRequest, testUser);

        // 测试存在的记录
        assertTrue(travelService.existsById(travelId));

        // 测试不存在的记录
        assertFalse(travelService.existsById(99999L));

        // 测试无效ID
        assertFalse(travelService.existsById(null));
        assertFalse(travelService.existsById(-1L));
    }
}