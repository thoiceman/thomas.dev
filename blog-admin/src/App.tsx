import React from 'react';
import { ConfigProvider, theme } from 'antd';
import { RouterProvider } from 'react-router-dom';
import zhCN from 'antd/locale/zh_CN';
import { useTheme, useThemeProvider } from './hooks/useTheme';
import router from './router';
import './App.css';

function App() {
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

  // 直接使用路由系统，让AuthGuard处理认证逻辑
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
