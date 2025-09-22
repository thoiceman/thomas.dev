import React from 'react';
import { Typography, Card, Space, Tag } from 'antd';

const { Title, Paragraph, Text } = Typography;

/**
 * 仪表盘页面
 * 显示系统概览和快速导航
 */
const Dashboard: React.FC = () => (
  <div className="dashboard-page">
    <Title level={2}>欢迎使用博客管理系统</Title>
    
    <Card title="系统概览" className="mb-6">
      <Paragraph>
        欢迎使用博客管理系统！这是一个基于现代技术栈构建的博客管理系统。
      </Paragraph>
      
      <Title level={4}>已集成的技术栈：</Title>
      <Space wrap>
        <Tag color="blue">TypeScript</Tag>
        <Tag color="green">Tailwind CSS</Tag>
        <Tag color="purple">Ant Design</Tag>
        <Tag color="red">Axios</Tag>
        <Tag color="orange">Redux Toolkit</Tag>
        <Tag color="cyan">React Router</Tag>
      </Space>
    </Card>

    <Card title="布局组件特性" className="mb-6">
      <Paragraph>
        当前使用的布局组件具备以下特性：
      </Paragraph>
      <ul className="list-disc list-inside space-y-2 text-gray-700">
        <li>响应式设计，适配移动端和桌面端</li>
        <li>可折叠的侧边栏导航</li>
        <li>支持主题定制（明亮/暗黑模式）</li>
        <li>灵活的菜单配置</li>
        <li>用户信息展示和操作</li>
        <li>良好的可扩展性和自定义能力</li>
      </ul>
    </Card>

    <Card title="快速开始">
      <Paragraph>
        你可以通过左侧导航菜单访问不同的功能模块：
      </Paragraph>
      <ul className="list-disc list-inside space-y-1 text-gray-700">
        <li><Text strong>仪表盘</Text> - 查看系统概览和统计信息</li>
        <li><Text strong>文章管理</Text> - 创建、编辑和管理博客文章</li>
        <li><Text strong>分类管理</Text> - 管理博客分类和标签</li>
        <li><Text strong>项目管理</Text> - 管理技术项目和作品展示</li>
      </ul>
    </Card>
  </div>
);

export default Dashboard;