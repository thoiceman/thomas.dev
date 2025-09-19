package com.xu.blogapi.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.QueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.xu.blogapi.common.ErrorCode;
import com.xu.blogapi.exception.BusinessException;
import com.xu.blogapi.mapper.TravelMapper;
import com.xu.blogapi.model.dto.travel.TravelAddRequest;
import com.xu.blogapi.model.dto.travel.TravelQueryRequest;
import com.xu.blogapi.model.dto.travel.TravelUpdateRequest;
import com.xu.blogapi.model.entity.Travel;
import com.xu.blogapi.model.entity.User;
import com.xu.blogapi.model.enums.UserRoleEnum;
import com.xu.blogapi.service.TravelService;
import com.xu.blogapi.service.UserService;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.annotation.Resource;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;

/**
 * 旅行记录服务实现类
 *
 * @author xu
 */
@Service
public class TravelServiceImpl extends ServiceImpl<TravelMapper, Travel> implements TravelService {

    @Resource
    private TravelMapper travelMapper;

    @Resource
    private UserService userService;

    @Override
    @Transactional(rollbackFor = Exception.class)
    public Long addTravel(TravelAddRequest travelAddRequest, User loginUser) {
        // 参数校验
        if (travelAddRequest == null) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR, "请求参数为空");
        }
        if (loginUser == null) {
            throw new BusinessException(ErrorCode.NOT_LOGIN_ERROR);
        }

        // 创建旅行记录对象
        Travel travel = new Travel();
        BeanUtils.copyProperties(travelAddRequest, travel);
        travel.setAuthorId(loginUser.getId());

        // 自动计算旅行天数
        if (travel.getStartDate() != null && travel.getEndDate() != null) {
            long days = ChronoUnit.DAYS.between(travel.getStartDate(), travel.getEndDate()) + 1;
            travel.setDuration((int) days);
        }

        // 校验旅行记录参数
        validTravel(travel);

        // 保存到数据库
        boolean result = this.save(travel);
        if (!result) {
            throw new BusinessException(ErrorCode.OPERATION_ERROR, "创建旅行记录失败");
        }

        return travel.getId();
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public Boolean updateTravel(TravelUpdateRequest travelUpdateRequest, User loginUser) {
        // 参数校验
        if (travelUpdateRequest == null || travelUpdateRequest.getId() == null) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR, "请求参数为空");
        }
        if (loginUser == null) {
            throw new BusinessException(ErrorCode.NOT_LOGIN_ERROR);
        }

        // 检查旅行记录是否存在
        Travel oldTravel = this.getById(travelUpdateRequest.getId());
        if (oldTravel == null) {
            throw new BusinessException(ErrorCode.NOT_FOUND_ERROR, "旅行记录不存在");
        }

        // 权限检查：只有管理员可以修改任何记录，普通用户只能修改自己的记录
        if (!oldTravel.getAuthorId().equals(loginUser.getId()) && 
            !Integer.valueOf(1).equals(loginUser.getRole())) { // 1表示管理员
            throw new BusinessException(ErrorCode.NO_AUTH_ERROR, "无权限修改此旅行记录");
        }

        // 更新旅行记录对象
        Travel travel = new Travel();
        BeanUtils.copyProperties(travelUpdateRequest, travel);
        
        // 设置作者ID（更新时保持原作者ID不变）
        travel.setAuthorId(oldTravel.getAuthorId());

        // 自动计算旅行天数
        if (travel.getStartDate() != null && travel.getEndDate() != null) {
            long days = ChronoUnit.DAYS.between(travel.getStartDate(), travel.getEndDate()) + 1;
            travel.setDuration((int) days);
        }

        // 校验旅行记录参数
        validTravel(travel);

        // 更新数据库
        boolean result = this.updateById(travel);
        if (!result) {
            throw new BusinessException(ErrorCode.OPERATION_ERROR, "更新旅行记录失败");
        }

        return true;
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public Boolean deleteTravel(Long id, User loginUser) {
        // 参数校验
        if (id == null || id <= 0) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR, "旅行记录ID无效");
        }
        if (loginUser == null) {
            throw new BusinessException(ErrorCode.NOT_LOGIN_ERROR);
        }

        // 检查旅行记录是否存在
        Travel travel = this.getById(id);
        if (travel == null) {
            throw new BusinessException(ErrorCode.NOT_FOUND_ERROR, "旅行记录不存在");
        }

        // 权限检查：只有管理员可以更新任何记录，普通用户只能更新自己的记录
        if (!travel.getAuthorId().equals(loginUser.getId()) && 
            !Integer.valueOf(1).equals(loginUser.getRole())) { // 1表示管理员
            throw new BusinessException(ErrorCode.NO_AUTH_ERROR, "无权限删除此旅行记录");
        }

        // 逻辑删除
        boolean result = this.removeById(id);
        if (!result) {
            throw new BusinessException(ErrorCode.OPERATION_ERROR, "删除旅行记录失败");
        }

        return true;
    }

    @Override
    public Travel getTravelById(Long id, User loginUser) {
        // 参数校验
        if (id == null || id <= 0) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR, "旅行记录ID无效");
        }

        // 查询旅行记录
        Travel travel = this.getById(id);
        if (travel == null) {
            throw new BusinessException(ErrorCode.NOT_FOUND_ERROR, "旅行记录不存在");
        }

        // 权限检查：私密记录只有作者和管理员可以查看
        if (travel.getStatus() == 0 && loginUser != null && 
            !travel.getAuthorId().equals(loginUser.getId()) && 
            !Integer.valueOf(1).equals(loginUser.getRole())) { // 1表示管理员
            throw new BusinessException(ErrorCode.NO_AUTH_ERROR, "无权限查看此旅行记录");
        }

        return travel;
    }

    @Override
    public Page<Travel> listTravelsByPage(TravelQueryRequest travelQueryRequest, User loginUser) {
        // 参数校验
        if (travelQueryRequest == null) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR, "查询参数为空");
        }

        // 构建查询条件
        QueryWrapper<Travel> queryWrapper = new QueryWrapper<>();
        
        // 基础条件
        queryWrapper.eq("is_delete", 0);
        
        // 标题模糊查询
        if (StringUtils.isNotBlank(travelQueryRequest.getTitle())) {
            queryWrapper.like("title", travelQueryRequest.getTitle());
        }
        
        // 目的地模糊查询
        if (StringUtils.isNotBlank(travelQueryRequest.getDestination())) {
            queryWrapper.like("destination", travelQueryRequest.getDestination());
        }
        
        // 国家查询
        if (StringUtils.isNotBlank(travelQueryRequest.getCountry())) {
            queryWrapper.eq("country", travelQueryRequest.getCountry());
        }
        
        // 城市查询
        if (StringUtils.isNotBlank(travelQueryRequest.getCity())) {
            queryWrapper.eq("city", travelQueryRequest.getCity());
        }
        
        // 描述模糊查询
        if (StringUtils.isNotBlank(travelQueryRequest.getDescription())) {
            queryWrapper.like("description", travelQueryRequest.getDescription());
        }
        
        // 日期范围查询
        if (travelQueryRequest.getStartDateFrom() != null) {
            queryWrapper.ge("start_date", travelQueryRequest.getStartDateFrom());
        }
        if (travelQueryRequest.getStartDateTo() != null) {
            queryWrapper.le("start_date", travelQueryRequest.getStartDateTo());
        }
        if (travelQueryRequest.getEndDateFrom() != null) {
            queryWrapper.ge("end_date", travelQueryRequest.getEndDateFrom());
        }
        if (travelQueryRequest.getEndDateTo() != null) {
            queryWrapper.le("end_date", travelQueryRequest.getEndDateTo());
        }
        
        // 旅行天数范围查询
        if (travelQueryRequest.getMinDuration() != null) {
            queryWrapper.ge("duration", travelQueryRequest.getMinDuration());
        }
        if (travelQueryRequest.getMaxDuration() != null) {
            queryWrapper.le("duration", travelQueryRequest.getMaxDuration());
        }
        
        // 预算范围查询
        if (travelQueryRequest.getMinBudget() != null) {
            queryWrapper.ge("budget", travelQueryRequest.getMinBudget());
        }
        if (travelQueryRequest.getMaxBudget() != null) {
            queryWrapper.le("budget", travelQueryRequest.getMaxBudget());
        }
        
        // 交通方式查询
        if (StringUtils.isNotBlank(travelQueryRequest.getTransportation())) {
            queryWrapper.like("transportation", travelQueryRequest.getTransportation());
        }
        
        // 天气情况查询
        if (StringUtils.isNotBlank(travelQueryRequest.getWeather())) {
            queryWrapper.eq("weather", travelQueryRequest.getWeather());
        }
        
        // 评分查询
        if (travelQueryRequest.getRating() != null) {
            queryWrapper.eq("rating", travelQueryRequest.getRating());
        }
        
        // 状态查询
        if (travelQueryRequest.getStatus() != null) {
            queryWrapper.eq("status", travelQueryRequest.getStatus());
        } else {
            // 如果没有指定状态，默认只查询公开记录（除非是管理员或查询自己的记录）
            if (loginUser == null || 
                (!Integer.valueOf(1).equals(loginUser.getRole()) && // 1表示管理员
                 (travelQueryRequest.getAuthorId() == null || !travelQueryRequest.getAuthorId().equals(loginUser.getId())))) {
                queryWrapper.eq("status", 1);
            }
        }
        
        // 作者查询
        if (travelQueryRequest.getAuthorId() != null) {
            queryWrapper.eq("author_id", travelQueryRequest.getAuthorId());
        }
        
        // 排序
        String sortField = travelQueryRequest.getSortField();
        String sortOrder = travelQueryRequest.getSortOrder();
        
        if (StringUtils.isNotBlank(sortField)) {
            boolean isAsc = "asc".equals(sortOrder);
            switch (sortField) {
                case "createTime":
                    queryWrapper.orderBy(true, isAsc, "create_time");
                    break;
                case "updateTime":
                    queryWrapper.orderBy(true, isAsc, "update_time");
                    break;
                case "startDate":
                    queryWrapper.orderBy(true, isAsc, "start_date");
                    break;
                case "endDate":
                    queryWrapper.orderBy(true, isAsc, "end_date");
                    break;
                case "rating":
                    queryWrapper.orderBy(true, isAsc, "rating");
                    break;
                default:
                    queryWrapper.orderByDesc("start_date").orderByDesc("create_time");
                    break;
            }
        } else {
            // 默认排序：按开始日期降序，创建时间降序
            queryWrapper.orderByDesc("start_date").orderByDesc("create_time");
        }
        
        // 分页查询
        Page<Travel> page = new Page<>(travelQueryRequest.getCurrent(), travelQueryRequest.getPageSize());
        return this.page(page, queryWrapper);
    }

    @Override
    public List<Travel> listTravelsByAuthor(Long authorId, User loginUser) {
        if (authorId == null || authorId <= 0) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR, "作者ID无效");
        }
        
        // 权限检查：查看他人的记录时只能看公开的，查看自己的记录可以看全部
        List<Travel> travels;
        if (loginUser != null && authorId.equals(loginUser.getId())) {
            travels = travelMapper.selectByAuthorId(authorId);
        } else {
            QueryWrapper<Travel> queryWrapper = new QueryWrapper<>();
            queryWrapper.eq("author_id", authorId)
                       .eq("status", 1)
                       .eq("is_delete", 0)
                       .orderByDesc("start_date")
                       .orderByDesc("create_time");
            travels = this.list(queryWrapper);
        }
        
        return travels;
    }

    @Override
    public List<Travel> listTravelsByDestination(String destination, User loginUser) {
        if (StringUtils.isBlank(destination)) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR, "目的地不能为空");
        }
        return travelMapper.selectByDestination(destination);
    }

    @Override
    public List<Travel> listTravelsByCountry(String country, User loginUser) {
        if (StringUtils.isBlank(country)) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR, "国家不能为空");
        }
        return travelMapper.selectByCountry(country);
    }

    @Override
    public List<Travel> listTravelsByCity(String city, User loginUser) {
        if (StringUtils.isBlank(city)) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR, "城市不能为空");
        }
        return travelMapper.selectByCity(city);
    }

    @Override
    public List<Travel> listPublicTravels(User loginUser) {
        return travelMapper.selectPublicTravels();
    }

    @Override
    public List<Travel> listHighRatedTravels(User loginUser) {
        return travelMapper.selectHighRatedTravels();
    }

    @Override
    public List<Travel> listTravelsByRating(Integer rating, User loginUser) {
        if (rating == null || rating < 1 || rating > 5) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR, "评分必须在1-5之间");
        }
        return travelMapper.selectByRating(rating);
    }

    @Override
    public void validTravel(Travel travel) {
        if (travel == null) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR, "旅行记录为空");
        }

        // 校验必填字段
        if (StringUtils.isBlank(travel.getTitle())) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR, "旅行标题不能为空");
        }
        if (StringUtils.isBlank(travel.getDestination())) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR, "目的地不能为空");
        }
        if (travel.getStartDate() == null) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR, "开始日期不能为空");
        }
        if (travel.getEndDate() == null) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR, "结束日期不能为空");
        }
        if (travel.getAuthorId() == null) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR, "作者ID不能为空");
        }

        // 校验字段长度
        if (travel.getTitle().length() > 200) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR, "旅行标题长度不能超过200个字符");
        }
        if (travel.getDestination().length() > 100) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR, "目的地长度不能超过100个字符");
        }
        if (StringUtils.isNotBlank(travel.getCountry()) && travel.getCountry().length() > 50) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR, "国家名称长度不能超过50个字符");
        }
        if (StringUtils.isNotBlank(travel.getCity()) && travel.getCity().length() > 50) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR, "城市名称长度不能超过50个字符");
        }

        // 校验日期逻辑
        if (travel.getStartDate().isAfter(travel.getEndDate())) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR, "开始日期不能晚于结束日期");
        }

        // 校验评分
        if (travel.getRating() != null && (travel.getRating() < 1 || travel.getRating() > 5)) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR, "评分必须在1-5之间");
        }

        // 校验状态
        if (travel.getStatus() != null && travel.getStatus() != 0 && travel.getStatus() != 1) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR, "状态值无效");
        }

        // 校验预算
        if (travel.getBudget() != null && travel.getBudget().compareTo(BigDecimal.ZERO) < 0) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR, "预算不能为负数");
        }

        // 校验经纬度
        if (travel.getLatitude() != null && 
            (travel.getLatitude().compareTo(new BigDecimal("-90")) < 0 || 
             travel.getLatitude().compareTo(new BigDecimal("90")) > 0)) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR, "纬度范围为-90到90");
        }
        if (travel.getLongitude() != null && 
            (travel.getLongitude().compareTo(new BigDecimal("-180")) < 0 || 
             travel.getLongitude().compareTo(new BigDecimal("180")) > 0)) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR, "经度范围为-180到180");
        }

        // 校验旅行天数
        if (travel.getDuration() != null && travel.getDuration() < 1) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR, "旅行天数不能小于1天");
        }

        // 校验URL格式
        if (StringUtils.isNotBlank(travel.getCoverImage()) && !isValidUrl(travel.getCoverImage())) {
            throw new BusinessException(ErrorCode.PARAMS_ERROR, "封面图片URL格式无效");
        }
    }

    @Override
    public Boolean existsById(Long id) {
        if (id == null || id <= 0) {
            return false;
        }
        return this.getById(id) != null;
    }

    @Override
    public Long countUserTravels(Long authorId) {
        if (authorId == null || authorId <= 0) {
            return 0L;
        }
        return travelMapper.countByAuthorId(authorId);
    }

    @Override
    public Long countPublicTravels() {
        return travelMapper.countPublicTravels();
    }

    @Override
    public Long countHighRatedTravels() {
        QueryWrapper<Travel> queryWrapper = new QueryWrapper<>();
        queryWrapper.ge("rating", 4)
                   .eq("is_delete", 0);
        return this.count(queryWrapper);
    }

    @Override
    public Long countTravelsByRating(Integer rating) {
        if (rating == null || rating < 1 || rating > 5) {
            return 0L;
        }
        return travelMapper.countByRating(rating);
    }

    /**
     * 校验URL格式
     *
     * @param url URL字符串
     * @return 是否有效
     */
    private boolean isValidUrl(String url) {
        if (StringUtils.isBlank(url)) {
            return true;
        }
        return url.startsWith("http://") || url.startsWith("https://");
    }
}