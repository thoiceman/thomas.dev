import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Card,
  Table,
  Button,
  Space,
  Tag,
  Dropdown,
  Modal,
  message,
  Form,
  Input,
  Select,
  DatePicker,
  Row,
  Col,
  Statistic,
  Badge,
  Tooltip,
  Typography,
  Divider,
  Popconfirm
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  MoreOutlined,
  SearchOutlined,
  ReloadOutlined,
  FileTextOutlined,
  UserOutlined,
  CalendarOutlined,
  TagsOutlined,
  EyeInvisibleOutlined,
  FilterOutlined,
  ExportOutlined
} from '@ant-design/icons';
import type { ColumnsType, TablePaginationConfig } from 'antd/es/table';
import type { MenuProps } from 'antd';
import dayjs from 'dayjs';
import { useNavigate } from 'react-router-dom';
import { RootState, AppDispatch } from '../../../store';
import {
  fetchArticles,
  deleteArticle,
  setQueryParams,
  batchUpdateArticleStatus,
  publishArticle,
  offlineArticle
} from '../../../store/slices/articleSlice';
import type { Article, ArticleQueryParams, ArticleStatusType } from '../../../types/article';
import { ArticleStatus } from '../../../types/article';
import './index.css';

const { RangePicker } = DatePicker;
const { Option } = Select;

/**
 * 文章状态配置
 */
const ARTICLE_STATUS_CONFIG = {
  [ArticleStatus.DRAFT]: { color: 'default', text: '草稿' },
  [ArticleStatus.PUBLISHED]: { color: 'success', text: '已发布' },
  [ArticleStatus.OFFLINE]: { color: 'warning', text: '已下线' }
};

/**
 * 文章列表页面组件
 */
const ArticleList: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  
  // Redux状态
  const { articles, pagination, loading } = useSelector((state: RootState) => state.article);
  
  // 本地状态
  const [searchForm, setSearchForm] = useState<ArticleQueryParams>({
    page: 1,
    pageSize: 10,
    keyword: '',
    status: undefined,
    categoryId: undefined,
    authorId: undefined,
    startDate: undefined,
    endDate: undefined
  });
  
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewArticle, setPreviewArticle] = useState<Article | null>(null);

  /**
   * 初始化数据
   */
  useEffect(() => {
    handleSearch();
  }, []);

  /**
   * 搜索文章
   */
  const handleSearch = (params?: Partial<ArticleQueryParams>) => {
    const queryParams = { ...searchForm, ...params };
    setSearchForm(queryParams);
    dispatch(fetchArticles(queryParams));
  };

  /**
   * 重置搜索条件
   */
  const handleReset = () => {
    const resetParams: ArticleQueryParams = {
      page: 1,
      pageSize: 10,
      keyword: '',
      status: undefined,
      categoryId: undefined,
      authorId: undefined,
      startDate: undefined,
      endDate: undefined
    };
    setSearchForm(resetParams);
    dispatch(fetchArticles(resetParams));
  };

  /**
   * 处理分页变化
   */
  const handleTableChange = (paginationConfig: TablePaginationConfig) => {
    handleSearch({
      page: paginationConfig.current || 1,
      pageSize: paginationConfig.pageSize || 10
    });
  };

  /**
   * 删除文章
   */
  const handleDelete = async (id: number) => {
    try {
      await dispatch(deleteArticle(id)).unwrap();
      message.success('删除成功');
      handleSearch();
    } catch (error) {
      message.error('删除失败');
    }
  };

  /**
   * 批量删除
   */
  const handleBatchDelete = async () => {
    if (selectedRowKeys.length === 0) {
      message.warning('请选择要删除的文章');
      return;
    }
    
    try {
      await Promise.all(
        selectedRowKeys.map(id => dispatch(deleteArticle(id as number)).unwrap())
      );
      message.success('批量删除成功');
      setSelectedRowKeys([]);
      handleSearch();
    } catch (error) {
      message.error('批量删除失败');
    }
  };

  /**
   * 更新文章状态
   */
  const handleStatusChange = async (id: number, status: ArticleStatus) => {
    try {
      if (status === ArticleStatus.PUBLISHED) {
        await dispatch(publishArticle(id)).unwrap();
      } else if (status === ArticleStatus.OFFLINE) {
        await dispatch(offlineArticle(id)).unwrap();
      }
      message.success('状态更新成功');
      handleSearch();
    } catch (error) {
      message.error('状态更新失败');
    }
  };

  /**
   * 预览文章
   */
  const handlePreview = (article: Article) => {
    setPreviewArticle(article);
    setPreviewVisible(true);
  };

  /**
   * 导航到编辑页面
   */
  const handleEdit = (id: number) => {
    navigate(`/articles/editor/${id}`);
  };

  /**
   * 导航到新增页面
   */
  const handleAdd = () => {
    navigate('/articles/create');
  };

  /**
   * 导航到详情页面
   */
  const handleDetail = (id: number) => {
    navigate(`/articles/detail/${id}`);
  };

  /**
   * 表格列配置
   */
  const columns: ColumnsType<Article> = [
    {
      title: '标题',
      dataIndex: 'title',
      key: 'title',
      width: 300,
      ellipsis: {
        showTitle: false,
      },
      render: (title: string, record: Article) => (
        <Tooltip title={title}>
          <div className="article-title">
            <FileTextOutlined className="title-icon" />
            <span className="title-text">{title}</span>
          </div>
        </Tooltip>
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: ArticleStatus) => {
        const config = ARTICLE_STATUS_CONFIG[status];
        return (
          <Badge 
            status={config.color as any} 
            text={config.text}
          />
        );
      },
      filters: [
        { text: '草稿', value: ArticleStatus.DRAFT },
        { text: '已发布', value: ArticleStatus.PUBLISHED },
        { text: '已下线', value: ArticleStatus.OFFLINE },
      ],
    },
    {
      title: '分类',
      dataIndex: 'categoryName',
      key: 'categoryName',
      width: 120,
      render: (categoryName: string) => (
        categoryName ? <Tag color="blue">{categoryName}</Tag> : '-'
      ),
    },
    {
      title: '作者',
      dataIndex: 'authorName',
      key: 'authorName',
      width: 120,
      render: (authorName: string) => (
        <div className="author-info">
          <UserOutlined className="author-icon" />
          <span>{authorName}</span>
        </div>
      ),
    },
    {
      title: '标签',
      dataIndex: 'tags',
      key: 'tags',
      width: 200,
      render: (tags: string[]) => (
        <div className="tags-container">
          {tags && tags.length > 0 ? (
            tags.slice(0, 3).map((tag, index) => (
              <Tag key={index} color="geekblue">
                {tag}
              </Tag>
            ))
          ) : (
            <span className="no-tags">无标签</span>
          )}
          {tags && tags.length > 3 && (
            <Tag>+{tags.length - 3}</Tag>
          )}
        </div>
      ),
    },
    {
      title: '阅读量',
      dataIndex: 'viewCount',
      key: 'viewCount',
      width: 100,
      sorter: true,
      render: (viewCount: number) => (
        <span className="view-count">{viewCount || 0}</span>
      ),
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 180,
      sorter: true,
      render: (createdAt: string) => (
        <div className="date-info">
          <CalendarOutlined className="date-icon" />
          <span>{new Date(createdAt).toLocaleString()}</span>
        </div>
      ),
    },
    {
      title: '操作',
      key: 'action',
      width: 200,
      fixed: 'right',
      render: (_, record: Article) => {
        const statusMenuItems = [
          {
            key: 'draft',
            label: '设为草稿',
            disabled: record.status === ArticleStatus.DRAFT,
            onClick: () => handleStatusChange(record.id, ArticleStatus.DRAFT),
          },
          {
            key: 'published',
            label: '发布',
            disabled: record.status === ArticleStatus.PUBLISHED,
            onClick: () => handleStatusChange(record.id, ArticleStatus.PUBLISHED),
          },
          {
            key: 'offline',
            label: '下线',
            disabled: record.status === ArticleStatus.OFFLINE,
            onClick: () => handleStatusChange(record.id, ArticleStatus.OFFLINE),
          },
        ];

        return (
          <Space size="small">
            <Tooltip title="查看详情">
              <Button
                type="text"
                size="small"
                icon={<FileTextOutlined />}
                onClick={() => handleDetail(record.id)}
              />
            </Tooltip>
            <Tooltip title="预览">
              <Button
                type="text"
                size="small"
                icon={<EyeOutlined />}
                onClick={() => handlePreview(record)}
              />
            </Tooltip>
            <Tooltip title="编辑">
              <Button
                type="text"
                size="small"
                icon={<EditOutlined />}
                onClick={() => handleEdit(record.id)}
              />
            </Tooltip>
            <Dropdown
              menu={{ items: statusMenuItems }}
              trigger={['click']}
            >
              <Button
                type="text"
                size="small"
                icon={<MoreOutlined />}
              />
            </Dropdown>
            <Popconfirm
              title="确定要删除这篇文章吗？"
              description="删除后无法恢复，请谨慎操作。"
              onConfirm={() => handleDelete(record.id)}
              okText="确定"
              cancelText="取消"
            >
              <Tooltip title="删除">
                <Button
                  type="text"
                  size="small"
                  danger
                  icon={<DeleteOutlined />}
                />
              </Tooltip>
            </Popconfirm>
          </Space>
        );
      },
    },
  ];

  /**
   * 行选择配置
   */
  const rowSelection = {
    selectedRowKeys,
    onChange: (newSelectedRowKeys: React.Key[]) => {
      setSelectedRowKeys(newSelectedRowKeys);
    },
    getCheckboxProps: (record: Article) => ({
      disabled: record.status === ArticleStatus.PUBLISHED, // 已发布的文章不能批量删除
    }),
  };

  return (
    <div className="article-list">
      {/* 页面头部 */}
      <div className="page-header">
        <div className="header-left">
          <h2 className="page-title">
            <FileTextOutlined />
            文章管理
          </h2>
          <p className="page-description">管理博客文章，支持创建、编辑、删除和状态管理</p>
        </div>
        <div className="header-right">
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleAdd}
            size="large"
          >
            新建文章
          </Button>
        </div>
      </div>

      {/* 统计卡片 */}
      <Row gutter={16} className="stats-cards">
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="总文章数"
              value={pagination.total}
              prefix={<FileTextOutlined />}
              valueStyle={{ color: '#1677ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="已发布"
              value={articles.filter(a => a.status === ArticleStatus.PUBLISHED).length}
              prefix={<EyeOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="已下线"
              value={articles.filter(a => a.status === ArticleStatus.OFFLINE).length}
              prefix={<EditOutlined />}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="总阅读量"
              value={0}
              prefix={<EyeOutlined />}
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
      </Row>

      {/* 搜索筛选 */}
      <Card className="search-card">
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} md={8} lg={6}>
            <Input
              placeholder="搜索标题、内容..."
              prefix={<SearchOutlined />}
              value={searchForm.keyword}
              onChange={(e) => setSearchForm({ ...searchForm, keyword: e.target.value })}
              onPressEnter={() => handleSearch()}
              allowClear
            />
          </Col>
          <Col xs={24} sm={12} md={8} lg={6}>
            <Select
              placeholder="选择状态"
              value={searchForm.status}
              onChange={(status) => setSearchForm({ ...searchForm, status })}
              allowClear
              style={{ width: '100%' }}
            >
              <Option value={ArticleStatus.DRAFT}>草稿</Option>
              <Option value={ArticleStatus.PUBLISHED}>已发布</Option>
              <Option value={ArticleStatus.OFFLINE}>已下线</Option>
            </Select>
          </Col>
          <Col xs={24} sm={12} md={8} lg={6}>
            <RangePicker
              placeholder={['开始日期', '结束日期']}
              onChange={(dates) => {
                setSearchForm({
                  ...searchForm,
                  startDate: dates?.[0]?.format('YYYY-MM-DD'),
                  endDate: dates?.[1]?.format('YYYY-MM-DD')
                });
              }}
              style={{ width: '100%' }}
            />
          </Col>
          <Col xs={24} sm={12} md={8} lg={6}>
            <Space>
              <Button
                type="primary"
                icon={<SearchOutlined />}
                onClick={() => handleSearch()}
              >
                搜索
              </Button>
              <Button
                icon={<ReloadOutlined />}
                onClick={handleReset}
              >
                重置
              </Button>
            </Space>
          </Col>
        </Row>
      </Card>

      {/* 操作栏 */}
      <Card className="action-card">
        <Row justify="space-between" align="middle">
          <Col>
            <Space>
              <Popconfirm
                title="确定要批量删除选中的文章吗？"
                description={`已选择 ${selectedRowKeys.length} 篇文章`}
                onConfirm={handleBatchDelete}
                disabled={selectedRowKeys.length === 0}
                okText="确定"
                cancelText="取消"
              >
                <Button
                  danger
                  icon={<DeleteOutlined />}
                  disabled={selectedRowKeys.length === 0}
                >
                  批量删除 ({selectedRowKeys.length})
                </Button>
              </Popconfirm>
              <Button
                icon={<ExportOutlined />}
                disabled={articles.length === 0}
              >
                导出数据
              </Button>
            </Space>
          </Col>
          <Col>
            <Space>
              <Button
                icon={<ReloadOutlined />}
                onClick={() => handleSearch()}
                loading={loading.list}
              >
                刷新
              </Button>
              <Button icon={<FilterOutlined />}>
                高级筛选
              </Button>
            </Space>
          </Col>
        </Row>
      </Card>

      {/* 文章列表表格 */}
      <Card className="table-card">
        <Table
          columns={columns}
          dataSource={articles}
          rowKey="id"
          loading={loading.list}
          rowSelection={rowSelection}
          pagination={{
            current: pagination.current,
            pageSize: pagination.pageSize,
            total: pagination.total,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `第 ${range[0]}-${range[1]} 条，共 ${total} 条`,
            pageSizeOptions: ['10', '20', '50', '100'],
          }}
          onChange={handleTableChange}
          scroll={{ x: 1200 }}
          size="middle"
        />
      </Card>

      {/* 预览模态框 */}
      <Modal
        title={
          <div className="preview-modal-title">
            <FileTextOutlined />
            <span>文章预览</span>
          </div>
        }
        open={previewVisible}
        onCancel={() => setPreviewVisible(false)}
        footer={[
          <Button key="edit" type="primary" onClick={() => {
            if (previewArticle) {
              handleEdit(previewArticle.id);
              setPreviewVisible(false);
            }
          }}>
            编辑文章
          </Button>,
          <Button key="close" onClick={() => setPreviewVisible(false)}>
            关闭
          </Button>
        ]}
        width={800}
        className="article-preview-modal"
      >
        {previewArticle && (
          <div className="preview-content">
            <div className="preview-header">
              <h3 className="preview-title">{previewArticle.title}</h3>
              <div className="preview-meta">
                <Space split={<span className="meta-divider">|</span>}>
                  <span>
                    <UserOutlined /> {previewArticle.authorName}
                  </span>
                  <span>
                    <CalendarOutlined /> {new Date(previewArticle.createTime).toLocaleDateString()}
                  </span>
                  <span>
                    <EyeOutlined /> {0} 次阅读
                  </span>
                </Space>
              </div>
              {previewArticle.tagNames && previewArticle.tagNames.length > 0 && (
                <div className="preview-tags">
                  <TagsOutlined />
                  {previewArticle.tagNames.map((tag: string, index: number) => (
                    <Tag key={index} color="blue">{tag}</Tag>
                  ))}
                </div>
              )}
            </div>
            <div className="preview-summary">
              <h4>摘要</h4>
              <p>{previewArticle.summary || '暂无摘要'}</p>
            </div>
            <div className="preview-body">
              <h4>内容</h4>
              <div 
                className="content-preview"
                dangerouslySetInnerHTML={{ 
                  __html: previewArticle.content?.substring(0, 500) + '...' || '暂无内容' 
                }}
              />
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default ArticleList;