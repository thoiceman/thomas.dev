import React from 'react';
import { Button, ConfigProvider, Card, Typography, Space, Tag, theme } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import { useAppSelector, useAppDispatch } from './hooks/redux';
import { loginSuccess, logout } from './store/slices/authSlice';
import { useTheme, useThemeProvider } from './hooks/useTheme';
import AppLayout from './components/Layout';
import './App.css';

const { Title, Paragraph, Text } = Typography;

function App() {
  const dispatch = useAppDispatch();
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);
  
  // 使用主题hook
  const { mode, isTransitioning } = useTheme();
  
  // 初始化主题提供者
  useThemeProvider();
  
  // 获取Ant Design主题配置
  const { defaultAlgorithm, darkAlgorithm } = theme;
  const themeConfig = {
    algorithm: mode === 'dark' ? darkAlgorithm : defaultAlgorithm,
    token: {
      // 自定义主题令牌
      colorPrimary: '#1890ff',
      borderRadius: 6,
    },
  };

  const handleLogin = () => {
    // 模拟登录
    dispatch(loginSuccess({
      token: 'mock-token',
      user: { id: 1, username: 'admin', email: 'admin@example.com', role: 'admin' }
    }));
  };

  const handleLogout = () => {
    dispatch(logout());
  };

  // 处理菜单点击
  const handleMenuClick = (key: string) => {
    console.log('菜单点击:', key);
    // 这里可以添加路由跳转逻辑
  };

  // 处理用户菜单点击
  const handleUserMenuClick = (key: string) => {
    console.log('用户菜单点击:', key);
    if (key === 'logout') {
      handleLogout();
    }
  };

  // 未登录状态的登录页面
  if (!isAuthenticated) {
    return (
      <ConfigProvider 
        locale={zhCN} 
        theme={themeConfig}
      >
        <div className={`min-h-screen bg-gray-100 flex items-center justify-center ${isTransitioning ? 'theme-transitioning' : ''}`}>
          <Card className="w-96">
            <div className="text-center">
              <Title level={2}>博客管理系统</Title>
              <Paragraph type="secondary">
                请先登录以访问管理后台
              </Paragraph>
              <Button type="primary" size="large" onClick={handleLogin}>
                模拟登录
              </Button>
            </div>
          </Card>
        </div>
      </ConfigProvider>
    );
  }

  // 已登录状态的主界面
  return (
    <ConfigProvider 
      locale={zhCN} 
      theme={themeConfig}
    >
      <div className={isTransitioning ? 'theme-transitioning' : ''}>
        <AppLayout
          userInfo={{
            name: user?.username || '管理员',
            role: user?.role || 'Administrator',
          }}
          onMenuClick={handleMenuClick}
          onUserMenuClick={handleUserMenuClick}
        >
        {/* 主要内容区域 */}
        <div>
          <Title level={2}>欢迎使用博客管理系统</Title>
          
          <Card title="系统概览" className="mb-6">
            <Paragraph>
              欢迎回来，<Text strong>{user?.username}</Text>！
              这是一个基于现代技术栈构建的博客管理系统。
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
              <li><Text strong>用户管理</Text> - 管理系统用户和权限</li>
            </ul>
          </Card>
        </div>
      </AppLayout>
      </div>
    </ConfigProvider>
  );
}

export default App;
