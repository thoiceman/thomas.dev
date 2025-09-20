import React from 'react';
import { Typography, Card } from 'antd';

const { Title, Paragraph } = Typography;

/**
 * 文章列表页面
 * 显示和管理博客文章
 */
const ArticleList: React.FC = () => (
  <div className="article-list-page">
    <Title level={2}>文章列表</Title>
    <Card>
      <Paragraph>
        文章列表功能正在开发中...
      </Paragraph>
    </Card>
  </div>
);

export default ArticleList;