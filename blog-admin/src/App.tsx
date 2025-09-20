import React from 'react';
import { Button, ConfigProvider, Card, Typography, Space, Tag, theme } from 'antd';
import { RouterProvider } from 'react-router-dom';
import zhCN from 'antd/locale/zh_CN';
import { useAppSelector, useAppDispatch } from './hooks/redux';
import { loginSuccess } from './store/slices/authSlice';
import { useTheme, useThemeProvider } from './hooks/useTheme';
import router from './router';
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

  // 已登录状态的主界面 - 使用路由
  return (
    <ConfigProvider 
      locale={zhCN} 
      theme={themeConfig}
    >
      <div className={isTransitioning ? 'theme-transitioning' : ''}>
        <RouterProvider router={router} />
      </div>
    </ConfigProvider>
  );
}

export default App;
