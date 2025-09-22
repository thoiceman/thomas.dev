import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Card,
  Button,
  Space,
  Tag,
  Descriptions,
  Typography,
  Divider,
  Spin,
  Alert,
  Badge,
  Tooltip,
  Modal,
  message,
  Breadcrumb,
  Row,
  Col,
  Statistic,
  Avatar,
  Timeline,
  Image
} from 'antd';
import {
  ArrowLeftOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  ShareAltOutlined,
  PrinterOutlined,
  DownloadOutlined,
  CalendarOutlined,
  UserOutlined,
  TagsOutlined,
  FileTextOutlined,
  ClockCircleOutlined,
  HeartOutlined,
  MessageOutlined,
  BarChartOutlined,
  GlobalOutlined,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  StopOutlined,
  LikeOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';
import { RootState, AppDispatch } from '../../../store';
import { fetchArticleDetail, deleteArticle, publishArticle, offlineArticle } from '../../../store/slices/articleSlice';
import type { Article, ArticleStatusType } from '../../../types/article';
import { ArticleStatus } from '../../../types/article';
import './index.css';

const { Title, Paragraph, Text } = Typography;
const { confirm } = Modal;

/**
 * 文章详情查看页面组件
 */
const ArticleDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  // Redux 状态
  const { currentArticle, loading } = useSelector((state: RootState) => state.article);

  // 本地状态
  const [previewVisible, setPreviewVisible] = useState(false);

  // 初始化数据
  useEffect(() => {
    if (id) {
      dispatch(fetchArticleDetail(Number(id)));
    }
  }, [dispatch, id]);

  // 状态配置
  const STATUS_CONFIG = {
    [ArticleStatus.DRAFT]: {
      color: 'default',
      text: '草稿',
      icon: <FileTextOutlined />
    },
    [ArticleStatus.PUBLISHED]: {
      color: 'success',
      text: '已发布',
      icon: <CheckCircleOutlined />
    },
    [ArticleStatus.OFFLINE]: {
      color: 'error',
      text: '已下线',
      icon: <StopOutlined />
    }
  };

  // 处理返回
  const handleBack = () => {
    navigate('/articles/list');
  };

  // 处理编辑
  const handleEdit = () => {
    if (currentArticle) {
      navigate(`/articles/editor/${currentArticle.id}`);
    }
  };

  // 处理删除
  const handleDelete = () => {
    if (!currentArticle) return;

    confirm({
      title: '确认删除',
      content: `确定要删除文章"${currentArticle.title}"吗？此操作不可恢复。`,
      okText: '确认删除',
      okType: 'danger',
      cancelText: '取消',
      onOk: async () => {
        try {
          await dispatch(deleteArticle(currentArticle.id)).unwrap();
          message.success('文章删除成功');
          navigate('/articles/list');
        } catch (error) {
          message.error('删除失败，请重试');
        }
      }
    });
  };

  // 处理状态更新
  const handleStatusUpdate = async (status: string) => {
    if (!currentArticle) return;

    try {
      if (status === 'published') {
        await dispatch(publishArticle(currentArticle.id)).unwrap();
      } else if (status === 'offline') {
        await dispatch(offlineArticle(currentArticle.id)).unwrap();
      }
      message.success('状态更新成功');
    } catch (error) {
      message.error('状态更新失败，请重试');
    }
  };

  // 处理分享
  const handleShare = () => {
    if (currentArticle) {
      const url = `${window.location.origin}/articles/${currentArticle.id}`;
      navigator.clipboard.writeText(url).then(() => {
        message.success('文章链接已复制到剪贴板');
      }).catch(() => {
        message.error('复制失败，请手动复制');
      });
    }
  };

  // 处理打印
  const handlePrint = () => {
    window.print();
  };

  // 处理导出
  const handleExport = () => {
    message.info('导出功能开发中...');
  };

  // 渲染加载状态
  if (loading) {
    return (
      <div className="article-detail-loading">
        <Spin size="large" />
        <div style={{ marginTop: 16 }}>加载中...</div>
      </div>
    );
  }

  // 渲染错误状态
  if (!currentArticle) {
    return (
      <div className="article-detail">
        <Alert
          message="文章不存在"
          description="您访问的文章不存在或已被删除"
          type="error"
          showIcon
          action={
            <Button type="primary" onClick={handleBack}>
              返回列表
            </Button>
          }
        />
      </div>
    );
  }

  const statusConfig = STATUS_CONFIG[currentArticle.status as keyof typeof STATUS_CONFIG];

  return (
    <div className="article-detail">
      {/* 面包屑导航 */}
      <Card className="breadcrumb-card">
        <Breadcrumb>
          <Breadcrumb.Item>
            <FileTextOutlined />
            <span>文章管理</span>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <span>文章列表</span>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <span>文章详情</span>
          </Breadcrumb.Item>
        </Breadcrumb>
      </Card>

      {/* 页面头部 */}
      <Card className="header-card">
        <div className="header-content">
          <div className="header-left">
            <Button
              type="text"
              icon={<ArrowLeftOutlined />}
              onClick={handleBack}
              className="back-button"
            >
              返回列表
            </Button>
            <Divider type="vertical" />
            <div className="title-section">
              <Title level={2} className="article-title">
                {currentArticle.title}
              </Title>
              <div className="article-meta">
                <Space size="large">
                  <Badge
                    status={statusConfig?.color as any}
                    text={
                      <span className="status-text">
                        {statusConfig?.icon}
                        {statusConfig?.text}
                      </span>
                    }
                  />
                  <span className="meta-item">
                    <UserOutlined />
                    {currentArticle.author?.username || '未知作者'}
                  </span>
                  <span className="meta-item">
                    <CalendarOutlined />
                    {dayjs(currentArticle.createTime).format('YYYY-MM-DD HH:mm')}
                  </span>
                  <span className="meta-item">
                    <EyeOutlined />
                    {0} 次浏览
                  </span>
                </Space>
              </div>
            </div>
          </div>
          <div className="header-right">
            <Space>
              <Button
                type="primary"
                icon={<EditOutlined />}
                onClick={handleEdit}
              >
                编辑文章
              </Button>
              <Button
                icon={<ShareAltOutlined />}
                onClick={handleShare}
              >
                分享
              </Button>
              <Button
                icon={<PrinterOutlined />}
                onClick={handlePrint}
              >
                打印
              </Button>
              <Button
                icon={<DownloadOutlined />}
                onClick={handleExport}
              >
                导出
              </Button>
              <Button
                danger
                icon={<DeleteOutlined />}
                onClick={handleDelete}
              >
                删除
              </Button>
            </Space>
          </div>
        </div>
      </Card>

      <Row gutter={24}>
        {/* 主要内容 */}
        <Col xs={24} lg={18}>
          {/* 文章信息 */}
          <Card title="文章信息" className="info-card">
            <Descriptions column={2} bordered>
              <Descriptions.Item label="文章ID">
                {currentArticle.id}
              </Descriptions.Item>
              <Descriptions.Item label="文章状态">
                <Badge
                  status={statusConfig?.color as any}
                  text={statusConfig?.text}
                />
              </Descriptions.Item>
              <Descriptions.Item label="作者">
                <Space>
                  <Avatar size="small" icon={<UserOutlined />} />
                  {currentArticle.author?.username || '未知作者'}
                </Space>
              </Descriptions.Item>
              <Descriptions.Item label="分类">
                {currentArticle.category?.name || '未分类'}
              </Descriptions.Item>
              <Descriptions.Item label="创建时间">
                {currentArticle.createTime ? dayjs(currentArticle.createTime).format('YYYY-MM-DD HH:mm:ss') : '-'}
              </Descriptions.Item>
              <Descriptions.Item label="更新时间">
                {currentArticle.updateTime ? dayjs(currentArticle.updateTime).format('YYYY-MM-DD HH:mm:ss') : '-'}
              </Descriptions.Item>
              <Descriptions.Item label="发布时间">
                {currentArticle.publishTime
                  ? dayjs(currentArticle.publishTime).format('YYYY-MM-DD HH:mm:ss')
                  : '未发布'
                }
              </Descriptions.Item>
              <Descriptions.Item label="浏览量">
                <Statistic
                  value={0}
                  suffix="次"
                  valueStyle={{ fontSize: 14 }}
                />
              </Descriptions.Item>
              <Descriptions.Item label="标签" span={2}>
                <div className="tags-container">
                  {currentArticle.tags && currentArticle.tags.length > 0 ? (
                    currentArticle.tags.map(tag => (
                      <Tag key={tag.id} color="blue">
                        <TagsOutlined />
                        {tag.name}
                      </Tag>
                    ))
                  ) : (
                    <Text type="secondary">暂无标签</Text>
                  )}
                </div>
              </Descriptions.Item>
            </Descriptions>
          </Card>

          {/* 统计信息 */}
          <Card title="统计信息" className="article-stats">
            <Row gutter={16}>
              <Col span={6}>
                <Statistic
                  title="浏览量"
                  value={0}
                  prefix={<EyeOutlined />}
                />
              </Col>
              <Col span={6}>
                <Statistic
                  title="点赞数"
                  value={0}
                  prefix={<LikeOutlined />}
                />
              </Col>
              <Col span={6}>
                <Statistic
                  title="评论数"
                  value={0}
                  prefix={<MessageOutlined />}
                />
              </Col>
              <Col span={6}>
                <Statistic
                  title="分享数"
                  value={0}
                  prefix={<ShareAltOutlined />}
                />
              </Col>
            </Row>
          </Card>

          {/* 时间信息 */}
          <Card title="时间信息" className="article-timeline">
            <Timeline>
              <Timeline.Item
                dot={<ClockCircleOutlined />}
                color="blue"
              >
                <div>
                  <strong>创建时间</strong>
                  <br />
                  {currentArticle.createTime ? dayjs(currentArticle.createTime).format('YYYY-MM-DD HH:mm:ss') : '-'}
                </div>
              </Timeline.Item>
              {currentArticle.publishTime && (
                <Timeline.Item
                  dot={<CheckCircleOutlined />}
                  color="green"
                >
                  <div>
                    <strong>发布时间</strong>
                    <br />
                    {dayjs(currentArticle.publishTime).format('YYYY-MM-DD HH:mm:ss')}
                  </div>
                </Timeline.Item>
              )}
              <Timeline.Item
                dot={<EditOutlined />}
                color="orange"
              >
                <div>
                  <strong>最后更新</strong>
                  <br />
                  {currentArticle.updateTime ? dayjs(currentArticle.updateTime).format('YYYY-MM-DD HH:mm:ss') : '-'}
                </div>
              </Timeline.Item>
            </Timeline>
          </Card>

          {/* SEO信息 */}
          <Card title="SEO信息" className="article-seo">
            <Descriptions column={1} bordered size="small">
              <Descriptions.Item label="SEO标题">
                {currentArticle.title || '-'}
              </Descriptions.Item>
              <Descriptions.Item label="SEO描述">
                {currentArticle.summary || '-'}
              </Descriptions.Item>
              <Descriptions.Item label="字数统计">
                {currentArticle.wordCount || 0} 字
              </Descriptions.Item>
              <Descriptions.Item label="预计阅读时间">
                {currentArticle.readingTime || 0} 分钟
              </Descriptions.Item>
              <Descriptions.Item label="创建时间">
                {currentArticle.createTime ? dayjs(currentArticle.createTime).format('YYYY-MM-DD HH:mm:ss') : '-'}
              </Descriptions.Item>
              <Descriptions.Item label="浏览量">
                {0}
              </Descriptions.Item>
            </Descriptions>
          </Card>

          {/* 文章摘要 */}
          {currentArticle.summary && (
            <Card title="文章摘要" className="summary-card">
              <Paragraph className="summary-content">
                {currentArticle.summary}
              </Paragraph>
            </Card>
          )}

          {/* 文章内容 */}
          <Card
            title="文章内容"
            className="content-card"
            extra={
              <Button
                type="link"
                icon={<EyeOutlined />}
                onClick={() => setPreviewVisible(true)}
              >
                预览模式
              </Button>
            }
          >
            <div className="content-preview">
              {currentArticle.content ? (
                <div dangerouslySetInnerHTML={{ __html: currentArticle.content }} />
              ) : (
                <Text type="secondary">暂无内容</Text>
              )}
            </div>
          </Card>
        </Col>

        {/* 侧边栏 */}
        <Col xs={24} lg={6}>
          {/* 统计信息 */}
          <Card title="统计信息" className="stats-card">
            <Row gutter={16}>
              <Col span={12}>
                <Statistic
                  title="浏览量"
                  value={0}
                  prefix={<EyeOutlined />}
                />
              </Col>
              <Col span={12}>
                <Statistic
                  title="点赞数"
                  value={0}
                  prefix={<HeartOutlined />}
                />
              </Col>
              <Col span={12}>
                <Statistic
                  title="评论数"
                  value={0}
                  prefix={<MessageOutlined />}
                />
              </Col>
              <Col span={12}>
                <Statistic
                  title="分享数"
                  value={0}
                  prefix={<ShareAltOutlined />}
                />
              </Col>
            </Row>
          </Card>

          {/* 状态操作 */}
          <Card title="状态操作" className="actions-card">
            <Space direction="vertical" style={{ width: '100%' }}>
              {currentArticle.status !== ArticleStatus.PUBLISHED && (
                <Button
                  type="primary"
                  block
                  icon={<CheckCircleOutlined />}
                  onClick={() => handleStatusUpdate('published')}
                >
                  发布文章
                </Button>
              )}
              {currentArticle.status === ArticleStatus.PUBLISHED && (
                <Button
                  block
                  icon={<StopOutlined />}
                  onClick={() => handleStatusUpdate('offline')}
                >
                  下线文章
                </Button>
              )}
              {currentArticle.status !== ArticleStatus.DRAFT && (
                <Button
                  block
                  icon={<FileTextOutlined />}
                  onClick={() => handleStatusUpdate('draft')}
                >
                  转为草稿
                </Button>
              )}
            </Space>
          </Card>

          {/* 操作历史 */}
          <Card title="操作历史" className="history-card">
            <Timeline
              items={[
                {
                  dot: <CheckCircleOutlined className="timeline-icon" />,
                  children: (
                    <div>
                      <div>文章创建</div>
                      <Text type="secondary" className="timeline-time">
                        {dayjs(currentArticle.createTime).format('MM-DD HH:mm')}
                      </Text>
                    </div>
                  )
                },
                ...(currentArticle.publishTime ? [{
                  dot: <GlobalOutlined className="timeline-icon" />,
                  children: (
                    <div>
                      <div>文章发布</div>
                      <Text type="secondary" className="timeline-time">
                        {dayjs(currentArticle.publishTime).format('MM-DD HH:mm')}
                      </Text>
                    </div>
                  )
                }] : []),
                {
                  dot: <ClockCircleOutlined className="timeline-icon" />,
                  children: (
                    <div>
                      <div>最后更新</div>
                      <Text type="secondary" className="timeline-time">
                        {dayjs(currentArticle.updateTime).format('MM-DD HH:mm')}
                      </Text>
                    </div>
                  )
                }
              ]}
            />
          </Card>
        </Col>
      </Row>

      {/* 预览模态框 */}
      <Modal
        title={
          <div className="preview-modal-title">
            <EyeOutlined />
            文章预览
          </div>
        }
        open={previewVisible}
        onCancel={() => setPreviewVisible(false)}
        footer={null}
        width="80%"
        className="article-preview-modal"
      >
        <div className="preview-content">
          <div className="preview-header">
            <Title level={1} className="preview-title">
              {currentArticle.title}
            </Title>
            <div className="preview-meta">
              <Space split={<Divider type="vertical" />}>
                <span>
                  <UserOutlined />
                  {currentArticle.author?.username || '未知作者'}
                </span>
                <span>
                  <CalendarOutlined />
                  {dayjs(currentArticle.createTime).format('YYYY年MM月DD日')}
                </span>
                <span>
                  <EyeOutlined />
                  {0} 次浏览
                </span>
              </Space>
            </div>
            {currentArticle.tags && currentArticle.tags.length > 0 && (
              <div className="preview-tags">
                <TagsOutlined />
                <Space wrap>
                  {currentArticle.tags.map(tag => (
                    <Tag key={tag.id} color="blue">
                      {tag.name}
                    </Tag>
                  ))}
                </Space>
              </div>
            )}
          </div>
          
          {currentArticle.summary && (
            <div className="preview-summary">
              <Title level={4}>摘要</Title>
              <Paragraph>{currentArticle.summary}</Paragraph>
            </div>
          )}
          
          <div className="preview-body">
            <Title level={4}>正文</Title>
            <div
              className="content-preview"
              dangerouslySetInnerHTML={{ __html: currentArticle.content || '' }}
            />
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ArticleDetail;