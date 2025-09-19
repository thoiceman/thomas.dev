package com.xu.blogapi.service;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.IService;
import com.xu.blogapi.model.dto.thought.ThoughtAddRequest;
import com.xu.blogapi.model.dto.thought.ThoughtQueryRequest;
import com.xu.blogapi.model.dto.thought.ThoughtUpdateRequest;
import com.xu.blogapi.model.entity.Thought;
import com.xu.blogapi.model.entity.User;

import java.util.List;

/**
 * 想法服务接口
 *
 * @author xu
 */
public interface ThoughtService extends IService<Thought> {

    /**
     * 创建想法
     *
     * @param thoughtAddRequest 想法创建请求
     * @param loginUser         当前登录用户
     * @return 想法ID
     */
    Long addThought(ThoughtAddRequest thoughtAddRequest, User loginUser);

    /**
     * 更新想法
     *
     * @param thoughtUpdateRequest 想法更新请求
     * @param loginUser            当前登录用户
     * @return 是否成功
     */
    Boolean updateThought(ThoughtUpdateRequest thoughtUpdateRequest, User loginUser);

    /**
     * 删除想法（逻辑删除）
     *
     * @param id        想法ID
     * @param loginUser 当前登录用户
     * @return 是否成功
     */
    Boolean deleteThought(Long id, User loginUser);

    /**
     * 根据ID获取想法
     *
     * @param id        想法ID
     * @param loginUser 当前登录用户
     * @return 想法信息
     */
    Thought getThoughtById(Long id, User loginUser);

    /**
     * 分页查询想法列表
     *
     * @param thoughtQueryRequest 查询请求
     * @param loginUser           当前登录用户
     * @return 分页结果
     */
    Page<Thought> listThoughtsByPage(ThoughtQueryRequest thoughtQueryRequest, User loginUser);



    /**
     * 校验想法参数
     *
     * @param thought 想法对象
     */
    void validThought(Thought thought);

    /**
     * 检查想法是否存在
     *
     * @param id 想法ID
     * @return 是否存在
     */
    Boolean existsById(Long id);

    /**
     * 统计用户想法数量
     *
     * @param authorId 作者ID
     * @return 想法数量
     */
    Long countUserThoughts(Long authorId);
}