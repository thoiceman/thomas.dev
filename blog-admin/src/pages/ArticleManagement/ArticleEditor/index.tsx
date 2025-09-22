/**
 * 文章编辑器页面
 * 支持新增和编辑文章，集成Markdown编辑器
 */

import React, { useState, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Card,
  Form,
  Input,
  Select,
  Switch,
  Button,
  Space,
  message,
  Row,
  Col,
  Divider,
  Tag,
  Typography,
  Breadcrumb
} from 'antd';
import {
  SaveOutlined,
  EyeOutlined,
  ArrowLeftOutlined,
  FileTextOutlined,
  TagsOutlined,
  GlobalOutlined
} from '@ant-design/icons';
import MarkdownEditor from '../../../components/MarkdownEditor';
import './index.css';

const { Title, Text } = Typography;
const { Option } = Select;
const { TextArea } = Input;

interface ArticleEditorProps {}

const ArticleEditor: React.FC<ArticleEditorProps> = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [form] = Form.useForm();

  // 本地状态
  const [isEditing] = useState(!!id);
  const [saving, setSaving] = useState(false);
  const [content, setContent] = useState('');
  const [wordCount, setWordCount] = useState(0);
  const [readingTime, setReadingTime] = useState(0);
  const [customTags, setCustomTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');

  // 页面标题
  const pageTitle = isEditing ? '编辑文章' : '新增文章';

  // 处理内容变化
  const handleContentChange = useCallback((value: string) => {
    setContent(value);
  }, []);

  // 处理字数统计
  const handleWordCountChange = useCallback((words: number, time: number) => {
    setWordCount(words);
    setReadingTime(time);
  }, []);

  // 添加自定义标签
  const handleAddTag = () => {
    if (newTag && !customTags.includes(newTag)) {
      const updatedTags = [...customTags, newTag];
      setCustomTags(updatedTags);
      form.setFieldValue('tags', updatedTags);
      setNewTag('');
    }
  };

  // 删除标签
  const handleRemoveTag = (tagToRemove: string) => {
    const updatedTags = customTags.filter(tag => tag !== tagToRemove);
    setCustomTags(updatedTags);
    form.setFieldValue('tags', updatedTags);
  };

  // 保存文章
  const handleSave = async (status: string = 'draft') => {
    try {
      setSaving(true);
      const values = await form.validateFields();
      
      console.log('保存文章数据:', {
        ...values,
        content,
        tags: customTags,
        status,
        word_count: wordCount,
        reading_time: readingTime
      });

      // TODO: 实际的API调用
      message.success(isEditing ? '文章更新成功' : '文章创建成功');
    } catch (error: any) {
      message.error(error.message || '保存失败');
    } finally {
      setSaving(false);
    }
  };

  // 发布文章
  const handlePublish = () => {
    handleSave('published');
  };

  // 保存草稿
  const handleSaveDraft = () => {
    handleSave('draft');
  };

  // 预览文章
  const handlePreview = () => {
    if (id) {
      window.open(`/articles/detail/${id}`, '_blank');
    } else {
      message.info('请先保存文章后再预览');
    }
  };

  // 返回列表
  const handleBack = () => {
    navigate('/articles/list');
  };

  // 表单验证规则
  const formRules = {
    title: [
      { required: true, message: '请输入文章标题' },
      { max: 200, message: '标题长度不能超过200个字符' }
    ],
    summary: [
      { max: 500, message: '摘要长度不能超过500个字符' }
    ],
    category_id: [
      { required: true, message: '请选择文章分类' }
    ]
  };

  return (
    <div className="article-editor">
      {/* 面包屑导航 */}
      <Breadcrumb className="article-editor-breadcrumb">
        <Breadcrumb.Item>
          <FileTextOutlined />
          <span>文章管理</span>
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          <a onClick={handleBack}>文章列表</a>
        </Breadcrumb.Item>
        <Breadcrumb.Item>{pageTitle}</Breadcrumb.Item>
      </Breadcrumb>

      {/* 页面标题和操作按钮 */}
      <div className="article-editor-header">
        <div className="header-left">
          <Button
            type="text"
            icon={<ArrowLeftOutlined />}
            onClick={handleBack}
            className="back-button"
          >
            返回
          </Button>
          <Title level={2} className="page-title">
            {pageTitle}
          </Title>
          {isEditing && (
            <Tag color="blue">ID: {id}</Tag>
          )}
        </div>
        
        <div className="header-right">
          <Space>
            <Text type="secondary">
              字数: {wordCount} | 预计阅读: {readingTime}分钟
            </Text>
            <Button
              icon={<EyeOutlined />}
              onClick={handlePreview}
              disabled={!isEditing}
            >
              预览
            </Button>
            <Button
              onClick={handleSaveDraft}
              loading={saving}
            >
              保存草稿
            </Button>
            <Button
              type="primary"
              icon={<SaveOutlined />}
              onClick={handlePublish}
              loading={saving}
            >
              发布文章
            </Button>
          </Space>
        </div>
      </div>

      <Form
        form={form}
        layout="vertical"
        className="article-editor-form"
        initialValues={{
          status: 'draft',
          is_featured: false,
          allow_comments: true
        }}
      >
        <Row gutter={24}>
          {/* 左侧主要内容 */}
          <Col xs={24} lg={16}>
            <Card className="content-card">
              {/* 基本信息 */}
              <div className="form-section">
                <Title level={4}>
                  <FileTextOutlined /> 基本信息
                </Title>
                
                <Form.Item
                  name="title"
                  label="文章标题"
                  rules={formRules.title}
                >
                  <Input
                    placeholder="请输入文章标题"
                    size="large"
                    showCount
                    maxLength={200}
                  />
                </Form.Item>

                <Form.Item
                  name="summary"
                  label="文章摘要"
                  rules={formRules.summary}
                >
                  <TextArea
                    placeholder="请输入文章摘要，用于搜索引擎优化和文章预览"
                    rows={3}
                    showCount
                    maxLength={500}
                  />
                </Form.Item>
              </div>

              <Divider />

              {/* 文章内容 */}
              <div className="form-section">
                <Title level={4}>
                  <FileTextOutlined /> 文章内容
                </Title>
                
                <div className="content-editor">
                  <MarkdownEditor
                    value={content}
                    onChange={handleContentChange}
                    onWordCountChange={handleWordCountChange}
                    height={500}
                    placeholder="请输入文章内容，支持Markdown语法..."
                  />
                </div>
              </div>
            </Card>
          </Col>

          {/* 右侧设置面板 */}
          <Col xs={24} lg={8}>
            <Space direction="vertical" size="middle" className="settings-panel">
              {/* 发布设置 */}
              <Card size="small" title={
                <span>
                  <GlobalOutlined /> 发布设置
                </span>
              }>
                <Form.Item
                  name="status"
                  label="文章状态"
                >
                  <Select>
                    <Option value="draft">草稿</Option>
                    <Option value="published">已发布</Option>
                    <Option value="archived">已归档</Option>
                  </Select>
                </Form.Item>

                <Form.Item
                  name="is_featured"
                  label="推荐文章"
                  valuePropName="checked"
                >
                  <Switch />
                </Form.Item>

                <Form.Item
                  name="allow_comments"
                  label="允许评论"
                  valuePropName="checked"
                >
                  <Switch />
                </Form.Item>
              </Card>

              {/* 分类和标签 */}
              <Card size="small" title={
                <span>
                  <TagsOutlined /> 分类标签
                </span>
              }>
                <Form.Item
                  name="category_id"
                  label="文章分类"
                  rules={formRules.category_id}
                >
                  <Select placeholder="选择文章分类">
                    <Option value={1}>技术分享</Option>
                    <Option value={2}>生活随笔</Option>
                    <Option value={3}>项目经验</Option>
                  </Select>
                </Form.Item>

                <Form.Item label="文章标签">
                  <div className="tags-input">
                    <Input
                      placeholder="输入标签后按回车添加"
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      onPressEnter={handleAddTag}
                      suffix={
                        <Button
                          type="text"
                          size="small"
                          onClick={handleAddTag}
                          disabled={!newTag}
                        >
                          添加
                        </Button>
                      }
                    />
                  </div>
                  
                  <div className="tags-list">
                    {customTags.map(tag => (
                      <Tag
                        key={tag}
                        closable
                        onClose={() => handleRemoveTag(tag)}
                        style={{ marginTop: 8 }}
                      >
                        {tag}
                      </Tag>
                    ))}
                  </div>
                </Form.Item>
              </Card>

              {/* SEO设置 */}
              <Card size="small" title="SEO设置">
                <Form.Item
                  name="seo_title"
                  label="SEO标题"
                >
                  <Input
                    placeholder="SEO标题（可选）"
                    showCount
                    maxLength={60}
                  />
                </Form.Item>

                <Form.Item
                  name="seo_description"
                  label="SEO描述"
                >
                  <TextArea
                    placeholder="SEO描述（可选）"
                    rows={3}
                    showCount
                    maxLength={160}
                  />
                </Form.Item>

                <Form.Item
                  name="seo_keywords"
                  label="SEO关键词"
                >
                  <Input
                    placeholder="SEO关键词，用逗号分隔（可选）"
                    showCount
                    maxLength={200}
                  />
                </Form.Item>
              </Card>
            </Space>
          </Col>
        </Row>
      </Form>
    </div>
  );
};

export default ArticleEditor;