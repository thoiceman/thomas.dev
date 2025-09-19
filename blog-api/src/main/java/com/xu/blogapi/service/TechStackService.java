package com.xu.blogapi.service;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.service.IService;
import com.xu.blogapi.model.dto.techstack.TechStackAddRequest;
import com.xu.blogapi.model.dto.techstack.TechStackQueryRequest;
import com.xu.blogapi.model.dto.techstack.TechStackUpdateRequest;
import com.xu.blogapi.model.dto.techstack.TechStackResponse;
import com.xu.blogapi.model.entity.TechStack;

import java.util.List;

/**
 * 技术栈服务接口
 *
 * @author xu
 */
public interface TechStackService extends IService<TechStack> {

    /**
     * 创建技术栈
     *
     * @param techStackAddRequest 技术栈添加请求
     * @return 技术栈ID
     */
    Long addTechStack(TechStackAddRequest techStackAddRequest);

    /**
     * 删除技术栈
     *
     * @param id 技术栈ID
     * @return 是否删除成功
     */
    Boolean deleteTechStack(Long id);

    /**
     * 更新技术栈
     *
     * @param techStackUpdateRequest 技术栈更新请求
     * @return 是否更新成功
     */
    Boolean updateTechStack(TechStackUpdateRequest techStackUpdateRequest);

    /**
     * 根据ID获取技术栈
     *
     * @param id 技术栈ID
     * @return 技术栈响应对象
     */
    TechStackResponse getTechStackById(Long id);

    /**
     * 根据名称获取技术栈
     *
     * @param name 技术栈名称
     * @return 技术栈响应对象
     */
    TechStackResponse getTechStackByName(String name);

    /**
     * 分页查询技术栈列表
     *
     * @param techStackQueryRequest 技术栈查询请求
     * @return 分页结果
     */
    IPage<TechStackResponse> listTechStacksByPage(TechStackQueryRequest techStackQueryRequest);

    /**
     * 获取所有技术栈列表
     *
     * @return 技术栈列表
     */
    List<TechStackResponse> listAllTechStacks();

    /**
     * 根据分类获取技术栈列表
     *
     * @param category 技术分类
     * @return 技术栈列表
     */
    List<TechStackResponse> listTechStacksByCategory(String category);

    /**
     * 获取所有技术分类
     *
     * @return 分类列表
     */
    List<String> listAllCategories();

    /**
     * 验证技术栈
     *
     * @param techStack 技术栈实体
     * @param add       是否为添加操作
     */
    void validTechStack(TechStack techStack, boolean add);

    /**
     * 将技术栈实体转换为响应对象
     *
     * @param techStack 技术栈实体
     * @return 技术栈响应对象
     */
    TechStackResponse getTechStackResponse(TechStack techStack);

    /**
     * 根据ID检查技术栈是否存在
     *
     * @param id 技术栈ID
     * @return 是否存在
     */
    Boolean existsById(Long id);

    /**
     * 根据名称检查技术栈是否存在
     *
     * @param name 技术栈名称
     * @return 是否存在
     */
    Boolean existsByName(String name);

    /**
     * 检查技术栈名称是否存在（排除指定ID）
     *
     * @param name      技术栈名称
     * @param excludeId 排除的ID
     * @return 是否存在
     */
    Boolean existsByNameAndNotId(String name, Long excludeId);
}