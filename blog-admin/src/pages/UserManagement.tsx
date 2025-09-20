import React from 'react';
import { Typography, Card } from 'antd';

const { Title, Paragraph } = Typography;

/**
 * 用户管理页面
 * 管理系统用户和权限
 */
const UserManagement: React.FC = () => (
  <div className="user-management-page">
    <Title level={2}>用户管理</Title>
    <Card>
      <Paragraph>
        用户管理功能正在开发中...
      </Paragraph>
    </Card>
  </div>
);

export default UserManagement;