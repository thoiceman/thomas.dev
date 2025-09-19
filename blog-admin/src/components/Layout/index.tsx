import React, { useState } from 'react';
import { Layout, Menu, Avatar, Dropdown, Button, Space, Typography, theme } from 'antd';
import type { MenuProps } from 'antd';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  DashboardOutlined,
  FileTextOutlined,
  UserOutlined,
  SettingOutlined,
  LogoutOutlined,
  BellOutlined,
  TeamOutlined,
} from '@ant-design/icons';
import { ThemeToggle } from '../ThemeToggle';
import { useTheme } from '../../hooks/useTheme';
import './index.css';

const { Header, Sider, Content } = Layout;
const { Text } = Typography;

// 定义组件Props接口
interface AppLayoutProps {
  children?: React.ReactNode;
  logo?: React.ReactNode;
  title?: string;
  menuItems?: MenuProps['items'];
  userInfo?: {
    name: string;
    avatar?: string;
    role?: string;
  };
  onMenuClick?: (key: string) => void;
  onUserMenuClick?: (key: string) => void;
  className?: string;
  style?: React.CSSProperties;
  siderWidth?: number;
  collapsedWidth?: number;
  theme?: 'light' | 'dark';
}

// 默认菜单项
const defaultMenuItems: MenuProps['items'] = [
  {
    key: 'dashboard',
    icon: <DashboardOutlined />,
    label: '仪表盘',
  },
  {
    key: 'articles',
    icon: <FileTextOutlined />,
    label: '文章管理',
    children: [
      {
        key: 'article-list',
        label: '文章列表',
      },
      {
        key: 'article-create',
        label: '创建文章',
      },
    ],
  },
  {
    key: 'users',
    icon: <TeamOutlined />,
    label: '用户管理',
  },
];

// 默认用户信息
const defaultUserInfo = {
  name: '管理员',
  role: 'Administrator',
  avatar: undefined,
};

const AppLayout: React.FC<AppLayoutProps> = ({
  children,
  logo,
  title = '博客管理系统',
  menuItems = defaultMenuItems,
  userInfo = defaultUserInfo,
  onMenuClick,
  onUserMenuClick,
  className,
  style,
  siderWidth = 256,
  collapsedWidth = 80,
  theme: layoutTheme = 'light',
}) => {
  // 侧边栏折叠状态
  const [collapsed, setCollapsed] = useState(false);
  
  // 获取主题状态
  const { mode, followSystem, systemPreference } = useTheme();
  
  // 确定有效的主题模式
  const effectiveTheme = followSystem ? systemPreference : mode;
  
  // 获取Ant Design主题token
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  // 用户下拉菜单
  const userMenuItems: MenuProps['items'] = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: '个人资料',
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: '设置',
    },
    {
      type: 'divider',
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: '退出登录',
      danger: true,
    },
  ];

  // 处理菜单点击
  const handleMenuClick = ({ key }: { key: string }) => {
    onMenuClick?.(key);
  };

  // 处理用户菜单点击
  const handleUserMenuClick = ({ key }: { key: string }) => {
    onUserMenuClick?.(key);
  };

  return (
    <Layout className={`app-layout ${className || ''}`} style={style}>
      {/* 侧边栏 */}
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        width={siderWidth}
        collapsedWidth={collapsedWidth}
        theme={effectiveTheme}
        className="app-layout-sider"
      >
        {/* Logo区域 */}
        <div className="app-layout-logo">
          {logo || (
            <div className="default-logo">
              <FileTextOutlined style={{ fontSize: '24px', color: '#1890ff' }} />
              {!collapsed && <span className="logo-text">{title}</span>}
            </div>
          )}
        </div>

        {/* 导航菜单 */}
        <Menu
          theme={effectiveTheme}
          mode="inline"
          items={menuItems}
          onClick={handleMenuClick}
          className="app-layout-menu"
        />
      </Sider>

      {/* 主体布局 */}
      <Layout className="app-layout-main">
        {/* 顶部导航栏 */}
        <Header
          className="app-layout-header"
          style={{
            padding: '0 24px',
            background: colorBgContainer,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '1px solid #f0f0f0',
          }}
        >
          {/* 左侧：折叠按钮 */}
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{
              fontSize: '16px',
              width: 64,
              height: 64,
            }}
          />

          {/* 右侧：主题切换和用户信息 */}
          <Space>
            {/* 主题切换按钮 */}
            <ThemeToggle mode="dropdown" showText={false} />
            
            {/* 通知按钮 */}
            <Button
              type="text"
              icon={<BellOutlined />}
              style={{ fontSize: '16px' }}
            />
            
            {/* 用户下拉菜单 */}
            <Dropdown
              menu={{
                items: userMenuItems,
                onClick: handleUserMenuClick,
              }}
              placement="bottomRight"
              arrow
            >
              <Space className="user-info" style={{ cursor: 'pointer' }}>
                <Avatar
                  size="small"
                  src={userInfo.avatar}
                  icon={!userInfo.avatar && <UserOutlined />}
                />
                <div className="user-details">
                  <Text strong>{userInfo.name}</Text>
                  {userInfo.role && (
                    <Text type="secondary" style={{ fontSize: '12px', display: 'block' }}>
                      {userInfo.role}
                    </Text>
                  )}
                </div>
              </Space>
            </Dropdown>
          </Space>
        </Header>

        {/* 内容区域 */}
        <Content
          className="app-layout-content"
          style={{
            margin: '24px',
            padding: '24px',
            minHeight: 'calc(100vh - 112px)',
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
            overflow: 'auto',
          }}
        >
          {children}
        </Content>
      </Layout>
    </Layout>
  );
};

export default AppLayout;