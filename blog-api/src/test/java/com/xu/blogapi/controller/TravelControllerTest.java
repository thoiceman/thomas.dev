package com.xu.blogapi.controller;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.xu.blogapi.common.DeleteRequest;
import com.xu.blogapi.model.dto.travel.TravelAddRequest;
import com.xu.blogapi.model.dto.travel.TravelQueryRequest;
import com.xu.blogapi.model.dto.travel.TravelUpdateRequest;
import com.xu.blogapi.model.entity.Travel;
import com.xu.blogapi.model.entity.User;
import com.xu.blogapi.model.enums.UserRoleEnum;
import com.xu.blogapi.service.TravelService;
import com.xu.blogapi.service.UserService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import javax.annotation.Resource;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.anyInt;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * 旅行记录控制器测试类
 *
 * @author xu
 */
@WebMvcTest(TravelController.class)
class TravelControllerTest {

    @Resource
    private MockMvc mockMvc;

    @MockBean
    private TravelService travelService;

    @MockBean
    private UserService userService;

    private ObjectMapper objectMapper;
    private User testUser;

    @BeforeEach
    void setUp() {
        objectMapper = new ObjectMapper();
        objectMapper.registerModule(new JavaTimeModule());
        
        // 创建测试用户
        testUser = new User();
        testUser.setId(1L);
        testUser.setUsername("testuser");
        testUser.setNickname("测试用户");
        testUser.setRole(0); // 0表示普通用户，1表示管理员
        
        // Mock用户服务
        when(userService.getLoginUser()).thenReturn(testUser);
        when(userService.getLoginUserPermitNull()).thenReturn(testUser);
    }

    @Test
    void testAddTravel() throws Exception {
        // 准备测试数据
        TravelAddRequest request = new TravelAddRequest();
        request.setTitle("日本东京之旅");
        request.setDestination("东京");
        request.setCountry("日本");
        request.setCity("东京");
        request.setDescription("一次美妙的东京之旅");
        request.setStartDate(LocalDate.of(2024, 3, 1));
        request.setEndDate(LocalDate.of(2024, 3, 7));
        request.setBudget(new BigDecimal("8000.00"));
        request.setTransportation("飞机");
        request.setWeather("晴朗");
        request.setRating(5);
        request.setStatus(1);

        // Mock服务方法
        when(travelService.addTravel(any(TravelAddRequest.class), any(User.class))).thenReturn(1L);

        // 执行测试
        mockMvc.perform(post("/travel/add")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(0))
                .andExpect(jsonPath("$.data").value(1));
    }

    @Test
    void testAddTravelWithInvalidRequest() throws Exception {
        // 测试空请求体
        mockMvc.perform(post("/travel/add")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(40000));
    }

    @Test
    void testDeleteTravel() throws Exception {
        // 准备测试数据
        DeleteRequest deleteRequest = new DeleteRequest();
        deleteRequest.setId(1L);

        // Mock服务方法
        when(travelService.deleteTravel(anyLong(), any(User.class))).thenReturn(true);

        // 执行测试
        mockMvc.perform(post("/travel/delete")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(deleteRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(0))
                .andExpect(jsonPath("$.data").value(true));
    }

    @Test
    void testUpdateTravel() throws Exception {
        // 准备测试数据
        TravelUpdateRequest request = new TravelUpdateRequest();
        request.setId(1L);
        request.setTitle("更新后的旅行标题");
        request.setDestination("更新后的目的地");
        request.setDescription("更新后的描述");
        request.setRating(4);

        // Mock服务方法
        when(travelService.updateTravel(any(TravelUpdateRequest.class), any(User.class))).thenReturn(true);

        // 执行测试
        mockMvc.perform(post("/travel/update")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(0))
                .andExpect(jsonPath("$.data").value(true));
    }

    @Test
    void testGetTravelById() throws Exception {
        // Mock服务方法
        Travel mockTravel = createMockTravel();
        when(travelService.getTravelById(anyLong(), any(User.class))).thenReturn(mockTravel);

        // 执行测试
        mockMvc.perform(get("/travel/get")
                .param("id", "1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(0))
                .andExpect(jsonPath("$.data.title").value("测试旅行"));
    }

    @Test
    void testGetTravelByIdWithInvalidId() throws Exception {
        // 测试无效ID
        mockMvc.perform(get("/travel/get")
                .param("id", "0"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(40000));
    }

    @Test
    void testListTravelsByPage() throws Exception {
        // 准备测试数据
        TravelQueryRequest queryRequest = new TravelQueryRequest();
        queryRequest.setCurrent(1); // 修复：使用int类型而不是Long类型
        queryRequest.setPageSize(10); // 修复：使用int类型而不是Long类型
        queryRequest.setTitle("测试");

        // Mock服务方法
        Page<Travel> mockPage = createMockPage();
        when(travelService.listTravelsByPage(any(TravelQueryRequest.class), any(User.class))).thenReturn(mockPage);

        // 执行测试
        mockMvc.perform(post("/travel/list/page")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(queryRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(0))
                .andExpect(jsonPath("$.data.total").value(1))
                .andExpect(jsonPath("$.data.records[0].title").value("测试旅行"));
    }

    @Test
    void testListPublicTravels() throws Exception {
        // Mock服务方法
        List<Travel> mockTravels = Arrays.asList(createMockTravel());
        when(travelService.listPublicTravels(any(User.class))).thenReturn(mockTravels);

        // 执行测试
        mockMvc.perform(get("/travel/list/public"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(0))
                .andExpect(jsonPath("$.data[0].title").value("测试旅行"));
    }

    @Test
    void testListHighRatedTravels() throws Exception {
        // Mock服务方法
        List<Travel> mockTravels = Arrays.asList(createMockTravel());
        when(travelService.listHighRatedTravels(any(User.class))).thenReturn(mockTravels);

        // 执行测试
        mockMvc.perform(get("/travel/list/high-rated"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(0))
                .andExpect(jsonPath("$.data[0].title").value("测试旅行"));
    }

    @Test
    void testListTravelsByAuthor() throws Exception {
        // Mock服务方法
        List<Travel> mockTravels = Arrays.asList(createMockTravel());
        when(travelService.listTravelsByAuthor(anyLong(), any(User.class))).thenReturn(mockTravels);

        // 执行测试
        mockMvc.perform(get("/travel/list/author")
                .param("authorId", "1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(0))
                .andExpect(jsonPath("$.data[0].title").value("测试旅行"));
    }

    @Test
    void testListTravelsByDestination() throws Exception {
        // Mock服务方法
        List<Travel> mockTravels = Arrays.asList(createMockTravel());
        when(travelService.listTravelsByDestination(anyString(), any(User.class))).thenReturn(mockTravels);

        // 执行测试
        mockMvc.perform(get("/travel/list/destination")
                .param("destination", "东京"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(0))
                .andExpect(jsonPath("$.data[0].title").value("测试旅行"));
    }

    @Test
    void testListTravelsByCountry() throws Exception {
        // Mock服务方法
        List<Travel> mockTravels = Arrays.asList(createMockTravel());
        when(travelService.listTravelsByCountry(anyString(), any(User.class))).thenReturn(mockTravels);

        // 执行测试
        mockMvc.perform(get("/travel/list/country")
                .param("country", "日本"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(0))
                .andExpect(jsonPath("$.data[0].title").value("测试旅行"));
    }

    @Test
    void testListTravelsByCity() throws Exception {
        // Mock服务方法
        List<Travel> mockTravels = Arrays.asList(createMockTravel());
        when(travelService.listTravelsByCity(anyString(), any(User.class))).thenReturn(mockTravels);

        // 执行测试
        mockMvc.perform(get("/travel/list/city")
                .param("city", "东京"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(0))
                .andExpect(jsonPath("$.data[0].title").value("测试旅行"));
    }

    @Test
    void testListTravelsByRating() throws Exception {
        // Mock服务方法
        List<Travel> mockTravels = Arrays.asList(createMockTravel());
        when(travelService.listTravelsByRating(anyInt(), any(User.class))).thenReturn(mockTravels);

        // 执行测试
        mockMvc.perform(get("/travel/list/rating")
                .param("rating", "5"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(0))
                .andExpect(jsonPath("$.data[0].title").value("测试旅行"));
    }

    @Test
    void testListTravelsByRatingWithInvalidRating() throws Exception {
        // 测试无效评分
        mockMvc.perform(get("/travel/list/rating")
                .param("rating", "6"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(40000));
    }

    @Test
    void testCountUserTravels() throws Exception {
        // Mock服务方法
        when(travelService.countUserTravels(anyLong())).thenReturn(5L);

        // 执行测试
        mockMvc.perform(get("/travel/count/author")
                .param("authorId", "1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(0))
                .andExpect(jsonPath("$.data").value(5));
    }

    @Test
    void testCountPublicTravels() throws Exception {
        // Mock服务方法
        when(travelService.countPublicTravels()).thenReturn(10L);

        // 执行测试
        mockMvc.perform(get("/travel/count/public"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(0))
                .andExpect(jsonPath("$.data").value(10));
    }

    @Test
    void testCountHighRatedTravels() throws Exception {
        // Mock服务方法
        when(travelService.countHighRatedTravels()).thenReturn(8L);

        // 执行测试
        mockMvc.perform(get("/travel/count/high-rated"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(0))
                .andExpect(jsonPath("$.data").value(8));
    }

    @Test
    void testCountTravelsByRating() throws Exception {
        // Mock服务方法
        when(travelService.countTravelsByRating(anyInt())).thenReturn(3L);

        // 执行测试
        mockMvc.perform(get("/travel/count/rating")
                .param("rating", "5"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(0))
                .andExpect(jsonPath("$.data").value(3));
    }

    /**
     * 创建模拟旅行记录对象
     */
    private Travel createMockTravel() {
        Travel travel = new Travel();
        travel.setId(1L);
        travel.setTitle("测试旅行");
        travel.setDestination("东京");
        travel.setCountry("日本");
        travel.setCity("东京");
        travel.setDescription("测试描述");
        travel.setStartDate(LocalDate.of(2024, 3, 1));
        travel.setEndDate(LocalDate.of(2024, 3, 7));
        travel.setDuration(7);
        travel.setBudget(new BigDecimal("8000.00"));
        travel.setTransportation("飞机");
        travel.setWeather("晴朗");
        travel.setRating(5);
        travel.setStatus(1);
        travel.setAuthorId(1L);
        travel.setCoverImage("https://example.com/image.jpg");
        travel.setLatitude(new BigDecimal("35.6762"));
        travel.setLongitude(new BigDecimal("139.6503"));
        travel.setCreateTime(LocalDateTime.now());
        travel.setUpdateTime(LocalDateTime.now());
        travel.setIsDelete(0);
        return travel;
    }

    /**
     * 创建模拟分页对象
     */
    private Page<Travel> createMockPage() {
        Page<Travel> page = new Page<>(1, 10);
        page.setTotal(1);
        page.setRecords(Arrays.asList(createMockTravel()));
        return page;
    }
}