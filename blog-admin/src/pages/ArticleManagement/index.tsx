import React from 'react';
import { Card, Row, Col, Statistic, Button, Typography } from 'antd';
import { 
  FileTextOutlined, 
  EditOutlined, 
  EyeOutlined, 
  PlusOutlined,
  BarChartOutlined,
  FolderOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import './index.css';

const { Title, Paragraph } = Typography;

/**
 * 文章管理主页面组件
 * 提供文章管理的统一入口和概览信息
 */
const ArticleManagement: React.FC = () => {
  const navigate = useNavigate();

  // 模拟统计数据
  const stats = {
    total: 156,
    published: 89,
    draft: 45,
    offline: 22,
    views: 12580,
    comments: 342
  };

  return (
    <div className="article-management">
      <div className="page-header">
        <Title level={2}>文章管理</Title>
        <Paragraph>
          管理您的博客文章，包括创建、编辑、发布和统计分析
        </Paragraph>
      </div>

      {/* 统计概览 */}
      <Row gutter={[16, 16]} className="stats-row">
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="总文章数"
              value={stats.total}
              prefix={<FileTextOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="已发布"
              value={stats.published}
              prefix={<EyeOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="草稿"
              value={stats.draft}
              prefix={<EditOutlined />}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic
              title="已下线"
              value={stats.offline}
              prefix={<FileTextOutlined />}
              valueStyle={{ color: '#f5222d' }}
            />
          </Card>
        </Col>
      </Row>

      {/* 快速操作 */}
      <Card title="快速操作" className="quick-actions">
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} md={8}>
            <Card 
              hoverable 
              className="action-card"
              onClick={() => navigate('/articles/create')}
            >
              <div className="action-content">
                <PlusOutlined className="action-icon" />
                <Title level={4}>创建文章</Title>
                <Paragraph>开始写作新的博客文章</Paragraph>
              </div>
            </Card>
          </Col>
          <Col xs={24} sm={12} md={8}>
            <Card 
              hoverable 
              className="action-card"
              onClick={() => navigate('/articles/list')}
            >
              <div className="action-content">
                <FileTextOutlined className="action-icon" />
                <Title level={4}>文章列表</Title>
                <Paragraph>查看和管理所有文章</Paragraph>
              </div>
            </Card>
          </Col>
          <Col xs={24} sm={12} md={8}>
            <Card 
              hoverable 
              className="action-card"
              onClick={() => navigate('/categories')}
            >
              <div className="action-content">
                <FolderOutlined className="action-icon" />
                <Title level={4}>分类管理</Title>
                <Paragraph>管理文章分类和标签</Paragraph>
              </div>
            </Card>
          </Col>
        </Row>
      </Card>

      {/* 最近活动 */}
      <Row gutter={16}>
        <Col xs={24} lg={12}>
          <Card title="最近文章" extra={<Button type="link" onClick={() => navigate('/articles/list')}>查看全部</Button>}>
            <div className="recent-articles">
              <div className="article-item">
                <div className="article-info">
                  <Title level={5}>React 18 新特性详解</Title>
                  <Paragraph type="secondary">2024-01-15 · 已发布</Paragraph>
                </div>
                <Button size="small" onClick={() => navigate('/articles/detail/1')}>
                  查看
                </Button>
              </div>
              <div className="article-item">
                <div className="article-info">
                  <Title level={5}>TypeScript 高级类型应用</Title>
                  <Paragraph type="secondary">2024-01-14 · 草稿</Paragraph>
                </div>
                <Button size="small" onClick={() => navigate('/articles/editor/2')}>
                  编辑
                </Button>
              </div>
              <div className="article-item">
                <div className="article-info">
                  <Title level={5}>前端性能优化实践</Title>
                  <Paragraph type="secondary">2024-01-13 · 已发布</Paragraph>
                </div>
                <Button size="small" onClick={() => navigate('/articles/detail/3')}>
                  查看
                </Button>
              </div>
            </div>
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title="统计分析" extra={<Button type="link">详细报告</Button>}>
            <Row gutter={16}>
              <Col span={12}>
                <Statistic
                  title="总浏览量"
                  value={stats.views}
                  prefix={<EyeOutlined />}
                />
              </Col>
              <Col span={12}>
                <Statistic
                  title="总评论数"
                  value={stats.comments}
                  prefix={<BarChartOutlined />}
                />
              </Col>
            </Row>
            <div className="chart-placeholder">
              <Paragraph type="secondary" style={{ textAlign: 'center', marginTop: 20 }}>
                📊 这里可以显示文章访问趋势图表
              </Paragraph>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default ArticleManagement;