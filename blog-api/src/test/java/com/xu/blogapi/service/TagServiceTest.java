package com.xu.blogapi.service;

import com.baomidou.mybatisplus.core.metadata.IPage;
import com.xu.blogapi.exception.BusinessException;
import com.xu.blogapi.model.dto.tag.TagAddRequest;
import com.xu.blogapi.model.dto.tag.TagQueryRequest;
import com.xu.blogapi.model.dto.tag.TagUpdateRequest;
import com.xu.blogapi.model.vo.TagVO;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import javax.annotation.Resource;
import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

/**
 * 标签服务测试
 *
 * @author xu
 */
@SpringBootTest
@ActiveProfiles("test")
@Transactional
public class TagServiceTest {

    @Resource
    private TagService tagService;

    /**
     * 测试创建标签
     */
    @Test
    public void testAddTag() {
        // 准备测试数据
        TagAddRequest request = new TagAddRequest();
        request.setName("Java");
        request.setSlug("java");
        request.setColor("#FF5722");

        // 执行测试
        Long tagId = tagService.addTag(request);

        // 验证结果
        assertNotNull(tagId);
        assertTrue(tagId > 0);

        // 验证标签是否创建成功
        TagVO tagVO = tagService.getTagById(tagId);
        assertNotNull(tagVO);
        assertEquals("Java", tagVO.getName());
        assertEquals("java", tagVO.getSlug());
        assertEquals("#FF5722", tagVO.getColor());
        assertEquals(0, tagVO.getUseCount());
    }

    /**
     * 测试创建标签 - 参数为空
     */
    @Test
    public void testAddTagWithNullRequest() {
        assertThrows(BusinessException.class, () -> {
            tagService.addTag(null);
        });
    }

    /**
     * 测试更新标签
     */
    @Test
    public void testUpdateTag() {
        // 先创建一个标签
        TagAddRequest addRequest = new TagAddRequest();
        addRequest.setName("Python");
        addRequest.setSlug("python");
        addRequest.setColor("#3776AB");
        Long tagId = tagService.addTag(addRequest);

        // 准备更新数据
        TagUpdateRequest updateRequest = new TagUpdateRequest();
        updateRequest.setId(tagId);
        updateRequest.setName("Python3");
        updateRequest.setColor("#306998");

        // 执行更新
        Boolean result = tagService.updateTag(updateRequest);

        // 验证结果
        assertTrue(result);

        // 验证更新是否成功
        TagVO tagVO = tagService.getTagById(tagId);
        assertEquals("Python3", tagVO.getName());
        assertEquals("python", tagVO.getSlug()); // slug未更新
        assertEquals("#306998", tagVO.getColor());
    }

    /**
     * 测试删除标签
     */
    @Test
    public void testDeleteTag() {
        // 先创建一个标签
        TagAddRequest addRequest = new TagAddRequest();
        addRequest.setName("JavaScript");
        addRequest.setSlug("javascript");
        Long tagId = tagService.addTag(addRequest);

        // 执行删除
        Boolean result = tagService.deleteTag(tagId);

        // 验证结果
        assertTrue(result);

        // 验证标签是否被删除（逻辑删除）
        assertThrows(BusinessException.class, () -> {
            tagService.getTagById(tagId);
        });
    }

    /**
     * 测试根据ID获取标签
     */
    @Test
    public void testGetTagById() {
        // 先创建一个标签
        TagAddRequest addRequest = new TagAddRequest();
        addRequest.setName("Spring");
        addRequest.setSlug("spring");
        addRequest.setColor("#6DB33F");
        Long tagId = tagService.addTag(addRequest);

        // 执行查询
        TagVO tagVO = tagService.getTagById(tagId);

        // 验证结果
        assertNotNull(tagVO);
        assertEquals(tagId, tagVO.getId());
        assertEquals("Spring", tagVO.getName());
        assertEquals("spring", tagVO.getSlug());
        assertEquals("#6DB33F", tagVO.getColor());
    }

    /**
     * 测试根据别名获取标签
     */
    @Test
    public void testGetTagBySlug() {
        // 先创建一个标签
        TagAddRequest addRequest = new TagAddRequest();
        addRequest.setName("Vue.js");
        addRequest.setSlug("vuejs");
        addRequest.setColor("#4FC08D");
        Long tagId = tagService.addTag(addRequest);

        // 执行查询
        TagVO tagVO = tagService.getTagBySlug("vuejs");

        // 验证结果
        assertNotNull(tagVO);
        assertEquals(tagId, tagVO.getId());
        assertEquals("Vue.js", tagVO.getName());
        assertEquals("vuejs", tagVO.getSlug());
        assertEquals("#4FC08D", tagVO.getColor());
    }

    /**
     * 测试分页查询标签
     */
    @Test
    public void testListTagsByPage() {
        // 先创建几个标签
        createTestTags();

        // 准备查询条件
        TagQueryRequest queryRequest = new TagQueryRequest();
        queryRequest.setCurrent(1);
        queryRequest.setPageSize(10);
        queryRequest.setSortField("createTime");
        queryRequest.setSortOrder("desc");

        // 执行查询
        IPage<TagVO> result = tagService.listTagsByPage(queryRequest);

        // 验证结果
        assertNotNull(result);
        assertTrue(result.getTotal() >= 3);
        assertTrue(result.getRecords().size() >= 3);
    }

    /**
     * 测试获取所有标签
     */
    @Test
    public void testListAllTags() {
        // 先创建几个标签
        createTestTags();

        // 执行查询
        List<TagVO> tags = tagService.listAllTags();

        // 验证结果
        assertNotNull(tags);
        assertTrue(tags.size() >= 3);
    }

    /**
     * 测试获取热门标签
     */
    @Test
    public void testListPopularTags() {
        // 先创建几个标签
        createTestTags();

        // 执行查询
        List<TagVO> popularTags = tagService.listPopularTags(5);

        // 验证结果
        assertNotNull(popularTags);
        assertTrue(popularTags.size() <= 5);
    }

    /**
     * 测试增加标签使用次数
     */
    @Test
    public void testIncrementUseCount() {
        // 先创建一个标签
        TagAddRequest addRequest = new TagAddRequest();
        addRequest.setName("React");
        addRequest.setSlug("react");
        Long tagId = tagService.addTag(addRequest);

        // 获取初始使用次数
        TagVO tagVO = tagService.getTagById(tagId);
        int initialUseCount = tagVO.getUseCount();

        // 增加使用次数
        tagService.incrementUseCount(Arrays.asList(tagId));

        // 验证使用次数是否增加
        TagVO updatedTagVO = tagService.getTagById(tagId);
        assertEquals(initialUseCount + 1, updatedTagVO.getUseCount());
    }

    /**
     * 测试减少标签使用次数
     */
    @Test
    public void testDecrementUseCount() {
        // 先创建一个标签并增加使用次数
        TagAddRequest addRequest = new TagAddRequest();
        addRequest.setName("Angular");
        addRequest.setSlug("angular");
        Long tagId = tagService.addTag(addRequest);

        // 先增加使用次数
        tagService.incrementUseCount(Arrays.asList(tagId));
        tagService.incrementUseCount(Arrays.asList(tagId));

        // 获取当前使用次数
        TagVO tagVO = tagService.getTagById(tagId);
        int currentUseCount = tagVO.getUseCount();

        // 减少使用次数
        tagService.decrementUseCount(Arrays.asList(tagId));

        // 验证使用次数是否减少
        TagVO updatedTagVO = tagService.getTagById(tagId);
        assertEquals(currentUseCount - 1, updatedTagVO.getUseCount());
    }

    /**
     * 测试检查标签是否存在
     */
    @Test
    public void testExistsById() {
        // 先创建一个标签
        TagAddRequest addRequest = new TagAddRequest();
        addRequest.setName("Node.js");
        addRequest.setSlug("nodejs");
        Long tagId = tagService.addTag(addRequest);

        // 测试存在的标签
        assertTrue(tagService.existsById(tagId));

        // 测试不存在的标签
        assertFalse(tagService.existsById(99999L));
    }

    /**
     * 测试检查标签名称是否存在
     */
    @Test
    public void testExistsByName() {
        // 先创建一个标签
        TagAddRequest addRequest = new TagAddRequest();
        addRequest.setName("Docker");
        addRequest.setSlug("docker");
        tagService.addTag(addRequest);

        // 测试存在的标签名称
        assertTrue(tagService.existsByName("Docker"));

        // 测试不存在的标签名称
        assertFalse(tagService.existsByName("Kubernetes"));
    }

    /**
     * 测试检查标签别名是否存在
     */
    @Test
    public void testExistsBySlug() {
        // 先创建一个标签
        TagAddRequest addRequest = new TagAddRequest();
        addRequest.setName("MySQL");
        addRequest.setSlug("mysql");
        tagService.addTag(addRequest);

        // 测试存在的标签别名
        assertTrue(tagService.existsBySlug("mysql"));

        // 测试不存在的标签别名
        assertFalse(tagService.existsBySlug("postgresql"));
    }

    /**
     * 创建测试标签
     */
    private void createTestTags() {
        // 创建标签1
        TagAddRequest request1 = new TagAddRequest();
        request1.setName("Java");
        request1.setSlug("java");
        request1.setColor("#FF5722");
        tagService.addTag(request1);

        // 创建标签2
        TagAddRequest request2 = new TagAddRequest();
        request2.setName("Python");
        request2.setSlug("python");
        request2.setColor("#3776AB");
        tagService.addTag(request2);

        // 创建标签3
        TagAddRequest request3 = new TagAddRequest();
        request3.setName("JavaScript");
        request3.setSlug("javascript");
        request3.setColor("#F7DF1E");
        tagService.addTag(request3);
    }
}