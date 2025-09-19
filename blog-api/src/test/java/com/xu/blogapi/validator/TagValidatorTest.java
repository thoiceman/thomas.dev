package com.xu.blogapi.validator;

import com.xu.blogapi.exception.TagException;
import com.xu.blogapi.model.dto.tag.TagAddRequest;
import com.xu.blogapi.model.dto.tag.TagUpdateRequest;
import com.xu.blogapi.service.TagService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.when;

/**
 * 标签验证器测试
 *
 * @author xu
 */
@ExtendWith(MockitoExtension.class)
public class TagValidatorTest {

    @Mock
    private TagService tagService;

    @InjectMocks
    private TagValidator tagValidator;

    /**
     * 测试验证标签添加请求 - 正常情况
     */
    @Test
    public void testValidateTagAddRequest_Success() {
        // 准备测试数据
        TagAddRequest request = new TagAddRequest();
        request.setName("Java");
        request.setSlug("java");
        request.setColor("#FF5722");

        // Mock服务层返回
        when(tagService.existsByName(anyString())).thenReturn(false);
        when(tagService.existsBySlug(anyString())).thenReturn(false);

        // 执行验证，不应抛出异常
        assertDoesNotThrow(() -> tagValidator.validateTagAddRequest(request));
    }

    /**
     * 测试验证标签添加请求 - 请求为空
     */
    @Test
    public void testValidateTagAddRequest_NullRequest() {
        // 执行验证并验证异常
        TagException exception = assertThrows(TagException.class, () -> {
            tagValidator.validateTagAddRequest(null);
        });
        assertEquals("标签添加请求不能为空", exception.getMessage());
    }

    /**
     * 测试验证标签添加请求 - 名称为空
     */
    @Test
    public void testValidateTagAddRequest_EmptyName() {
        // 准备测试数据
        TagAddRequest request = new TagAddRequest();
        request.setSlug("java");
        request.setColor("#FF5722");

        // 执行验证并验证异常
        TagException exception = assertThrows(TagException.class, () -> {
            tagValidator.validateTagAddRequest(request);
        });
        assertEquals("标签名称不能为空", exception.getMessage());
    }

    /**
     * 测试验证标签添加请求 - 名称已存在
     */
    @Test
    public void testValidateTagAddRequest_NameExists() {
        // 准备测试数据
        TagAddRequest request = new TagAddRequest();
        request.setName("Java");
        request.setSlug("java");
        request.setColor("#FF5722");

        // Mock服务层返回
        when(tagService.existsByName("Java")).thenReturn(true);

        // 执行验证并验证异常
        TagException exception = assertThrows(TagException.class, () -> {
            tagValidator.validateTagAddRequest(request);
        });
        assertEquals("标签名称已存在", exception.getMessage());
    }

    /**
     * 测试验证标签添加请求 - 别名已存在
     */
    @Test
    public void testValidateTagAddRequest_SlugExists() {
        // 准备测试数据
        TagAddRequest request = new TagAddRequest();
        request.setName("Java");
        request.setSlug("java");
        request.setColor("#FF5722");

        // Mock服务层返回
        when(tagService.existsByName("Java")).thenReturn(false);
        when(tagService.existsBySlug("java")).thenReturn(true);

        // 执行验证并验证异常
        TagException exception = assertThrows(TagException.class, () -> {
            tagValidator.validateTagAddRequest(request);
        });
        assertEquals("标签别名已存在", exception.getMessage());
    }

    /**
     * 测试验证标签更新请求 - 正常情况
     */
    @Test
    public void testValidateTagUpdateRequest_Success() {
        // 准备测试数据
        TagUpdateRequest request = new TagUpdateRequest();
        request.setId(1L);
        request.setName("Java SE");
        request.setColor("#FF6722");

        // Mock服务层返回
        when(tagService.existsById(1L)).thenReturn(true);
        when(tagService.existsByNameAndNotId("Java SE", 1L)).thenReturn(false);

        // 执行验证，不应抛出异常
        assertDoesNotThrow(() -> tagValidator.validateTagUpdateRequest(request));
    }

    /**
     * 测试验证标签更新请求 - 请求为空
     */
    @Test
    public void testValidateTagUpdateRequest_NullRequest() {
        // 执行验证并验证异常
        TagException exception = assertThrows(TagException.class, () -> {
            tagValidator.validateTagUpdateRequest(null);
        });
        assertEquals("标签更新请求不能为空", exception.getMessage());
    }

    /**
     * 测试验证标签更新请求 - ID不存在
     */
    @Test
    public void testValidateTagUpdateRequest_IdNotExists() {
        // 准备测试数据
        TagUpdateRequest request = new TagUpdateRequest();
        request.setId(999L);
        request.setName("Java SE");

        // Mock服务层返回
        when(tagService.existsById(999L)).thenReturn(false);

        // 执行验证并验证异常
        TagException exception = assertThrows(TagException.class, () -> {
            tagValidator.validateTagUpdateRequest(request);
        });
        assertEquals("标签不存在", exception.getMessage());
    }

    /**
     * 测试验证标签ID - 正常情况
     */
    @Test
    public void testValidateTagId_Success() {
        // Mock服务层返回
        when(tagService.existsById(1L)).thenReturn(true);

        // 执行验证，不应抛出异常
        assertDoesNotThrow(() -> tagValidator.validateTagId(1L));
    }

    /**
     * 测试验证标签ID - ID为空
     */
    @Test
    public void testValidateTagId_NullId() {
        // 执行验证并验证异常
        TagException exception = assertThrows(TagException.class, () -> {
            tagValidator.validateTagId(null);
        });
        assertEquals("标签ID不能为空", exception.getMessage());
    }

    /**
     * 测试验证标签ID - ID无效
     */
    @Test
    public void testValidateTagId_InvalidId() {
        // 执行验证并验证异常
        TagException exception = assertThrows(TagException.class, () -> {
            tagValidator.validateTagId(0L);
        });
        assertEquals("标签ID必须大于0", exception.getMessage());
    }

    /**
     * 测试验证标签ID - ID不存在
     */
    @Test
    public void testValidateTagId_IdNotExists() {
        // Mock服务层返回
        when(tagService.existsById(999L)).thenReturn(false);

        // 执行验证并验证异常
        TagException exception = assertThrows(TagException.class, () -> {
            tagValidator.validateTagId(999L);
        });
        assertEquals("标签不存在", exception.getMessage());
    }

    /**
     * 测试验证标签名称 - 正常情况
     */
    @Test
    public void testValidateTagName_Success() {
        // 执行验证，不应抛出异常
        assertDoesNotThrow(() -> tagValidator.validateTagName("Java"));
    }

    /**
     * 测试验证标签名称 - 名称为空
     */
    @Test
    public void testValidateTagName_EmptyName() {
        // 执行验证并验证异常
        TagException exception = assertThrows(TagException.class, () -> {
            tagValidator.validateTagName("");
        });
        assertEquals("标签名称不能为空", exception.getMessage());
    }

    /**
     * 测试验证标签名称 - 名称过长
     */
    @Test
    public void testValidateTagName_TooLong() {
        // 准备超长名称（超过20个字符）
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < 21; i++) {
            sb.append("a");
        }
        String longName = sb.toString();

        // 执行验证并验证异常
        TagException exception = assertThrows(TagException.class, () -> {
            tagValidator.validateTagName(longName);
        });
        assertEquals("标签名称长度必须在1-20个字符之间", exception.getMessage());
    }

    /**
     * 测试验证标签别名 - 正常情况
     */
    @Test
    public void testValidateTagSlug_Success() {
        // 执行验证，不应抛出异常
        assertDoesNotThrow(() -> tagValidator.validateTagSlug("java-spring"));
    }

    /**
     * 测试验证标签别名 - 别名为空
     */
    @Test
    public void testValidateTagSlug_EmptySlug() {
        // 执行验证并验证异常
        TagException exception = assertThrows(TagException.class, () -> {
            tagValidator.validateTagSlug("");
        });
        assertEquals("标签别名不能为空", exception.getMessage());
    }

    /**
     * 测试验证标签别名 - 格式错误
     */
    @Test
    public void testValidateTagSlug_InvalidFormat() {
        // 执行验证并验证异常
        TagException exception = assertThrows(TagException.class, () -> {
            tagValidator.validateTagSlug("Java Spring!");
        });
        assertEquals("标签别名格式错误，只能包含小写字母、数字和连字符", exception.getMessage());
    }

    /**
     * 测试验证颜色代码 - 正常情况
     */
    @Test
    public void testValidateColorCode_Success() {
        // 执行验证，不应抛出异常
        assertDoesNotThrow(() -> tagValidator.validateColorCode("#FF5722"));
        assertDoesNotThrow(() -> tagValidator.validateColorCode("#fff"));
        assertDoesNotThrow(() -> tagValidator.validateColorCode("#123ABC"));
    }

    /**
     * 测试验证颜色代码 - 格式错误
     */
    @Test
    public void testValidateColorCode_InvalidFormat() {
        // 执行验证并验证异常
        TagException exception = assertThrows(TagException.class, () -> {
            tagValidator.validateColorCode("FF5722");
        });
        assertEquals("颜色代码格式错误", exception.getMessage());

        // 测试其他无效格式
        assertThrows(TagException.class, () -> tagValidator.validateColorCode("#GG5722"));
        assertThrows(TagException.class, () -> tagValidator.validateColorCode("#FF57"));
        assertThrows(TagException.class, () -> tagValidator.validateColorCode("#FF57222"));
    }

    /**
     * 测试验证文章ID - 正常情况
     */
    @Test
    public void testValidateArticleId_Success() {
        // 执行验证，不应抛出异常
        assertDoesNotThrow(() -> tagValidator.validateArticleId(1L));
    }

    /**
     * 测试验证文章ID - ID为空
     */
    @Test
    public void testValidateArticleId_NullId() {
        // 执行验证并验证异常
        TagException exception = assertThrows(TagException.class, () -> {
            tagValidator.validateArticleId(null);
        });
        assertEquals("文章ID不能为空", exception.getMessage());
    }

    /**
     * 测试验证文章ID - ID无效
     */
    @Test
    public void testValidateArticleId_InvalidId() {
        // 执行验证并验证异常
        TagException exception = assertThrows(TagException.class, () -> {
            tagValidator.validateArticleId(-1L);
        });
        assertEquals("文章ID必须大于0", exception.getMessage());
    }

    /**
     * 测试验证分页参数 - 正常情况
     */
    @Test
    public void testValidatePageParams_Success() {
        // 执行验证，不应抛出异常
        assertDoesNotThrow(() -> tagValidator.validatePageParams(1, 10));
        assertDoesNotThrow(() -> tagValidator.validatePageParams(5, 20));
    }

    /**
     * 测试验证分页参数 - 页码无效
     */
    @Test
    public void testValidatePageParams_InvalidCurrent() {
        // 执行验证并验证异常
        TagException exception = assertThrows(TagException.class, () -> {
            tagValidator.validatePageParams(0, 10);
        });
        assertEquals("页码必须大于0", exception.getMessage());
    }

    /**
     * 测试验证分页参数 - 页面大小无效
     */
    @Test
    public void testValidatePageParams_InvalidPageSize() {
        // 执行验证并验证异常
        TagException exception = assertThrows(TagException.class, () -> {
            tagValidator.validatePageParams(1, 0);
        });
        assertEquals("每页大小必须在1-100之间", exception.getMessage());

        // 测试页面大小过大
        assertThrows(TagException.class, () -> tagValidator.validatePageParams(1, 101));
    }

    /**
     * 测试验证排序字段 - 正常情况
     */
    @Test
    public void testValidateSortField_Success() {
        // 执行验证，不应抛出异常
        assertDoesNotThrow(() -> tagValidator.validateSortField("createTime"));
        assertDoesNotThrow(() -> tagValidator.validateSortField("updateTime"));
        assertDoesNotThrow(() -> tagValidator.validateSortField("useCount"));
        assertDoesNotThrow(() -> tagValidator.validateSortField("name"));
    }

    /**
     * 测试验证排序字段 - 字段无效
     */
    @Test
    public void testValidateSortField_InvalidField() {
        // 执行验证并验证异常
        TagException exception = assertThrows(TagException.class, () -> {
            tagValidator.validateSortField("invalidField");
        });
        assertEquals("排序字段无效", exception.getMessage());
    }

    /**
     * 测试验证排序方向 - 正常情况
     */
    @Test
    public void testValidateSortOrder_Success() {
        // 执行验证，不应抛出异常
        assertDoesNotThrow(() -> tagValidator.validateSortOrder("asc"));
        assertDoesNotThrow(() -> tagValidator.validateSortOrder("desc"));
        assertDoesNotThrow(() -> tagValidator.validateSortOrder("ASC"));
        assertDoesNotThrow(() -> tagValidator.validateSortOrder("DESC"));
    }

    /**
     * 测试验证排序方向 - 方向无效
     */
    @Test
    public void testValidateSortOrder_InvalidOrder() {
        // 执行验证并验证异常
        TagException exception = assertThrows(TagException.class, () -> {
            tagValidator.validateSortOrder("invalid");
        });
        assertEquals("排序方向无效，只能是asc或desc", exception.getMessage());
    }
}