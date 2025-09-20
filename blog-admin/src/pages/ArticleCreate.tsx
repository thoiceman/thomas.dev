import React from 'react';
import { Typography, Card } from 'antd';

const { Title, Paragraph } = Typography;

/**
 * 文章创建页面
 * 用于创建新的博客文章
 */
const ArticleCreate: React.FC = () => (
  <div className="article-create-page">
    <Title level={2}>创建文章</Title>
    <Card>
      <Paragraph>
        创建文章功能正在开发中...
      </Paragraph>
    </Card>
  </div>
);

export default ArticleCreate;