import React from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../../hooks/redux';
import { logout } from '../../store/slices/authSlice';
import AppLayout from './index';

// 路由映射配置
const routeKeyMap: Record<string, string> = {
  '/dashboard': 'dashboard',
  '/articles/list': 'article-list',
  '/articles/create': 'article-create',
  '/categories': 'categories',
  '/tags': 'tags',
  '/tech-stacks': 'tech-stacks',
  '/thoughts': 'thoughts',
  '/travels': 'travels',
  '/users': 'users',
  '/projects': 'projects',
};

// 菜单键到路由的映射
const menuKeyToRoute: Record<string, string> = {
  'dashboard': '/dashboard',
  'articles': '/articles/list', // 添加文章管理父菜单的路由映射
  'article-list': '/articles/list',
  'article-create': '/articles/create',
  'categories': '/categories',
  'tags': '/tags',
  'tech-stacks': '/tech-stacks',
  'thoughts': '/thoughts',
  'travels': '/travels',
  'users': '/users',
  'projects': '/projects',
};

const AppLayoutWithRouter: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  
  // 管理菜单展开状态
  const [openKeys, setOpenKeys] = React.useState<string[]>([]);

  // 处理菜单点击，进行路由跳转
  const handleMenuClick = (key: string) => {
    const route = menuKeyToRoute[key];
    if (route) {
      navigate(route);
    }
  };

  // 处理用户菜单点击
  const handleUserMenuClick = (key: string) => {
    console.log('用户菜单点击:', key);
    if (key === 'logout') {
      dispatch(logout());
    }
  };

  // 处理子菜单展开/收起
  const handleOpenChange = (keys: string[]) => {
    setOpenKeys(keys);
  };

  // 获取当前选中的菜单项
  const getSelectedKeys = () => {
    const currentKey = routeKeyMap[location.pathname];
    return currentKey ? [currentKey] : [];
  };

  // 初始化展开状态
  React.useEffect(() => {
    const pathname = location.pathname;
    if (pathname.startsWith('/articles')) {
      setOpenKeys(['articles']);
    }
  }, [location.pathname]);

  return (
    <AppLayout
      userInfo={{
        name: user?.username || '管理员',
        role: user?.role || 'Administrator',
      }}
      onMenuClick={handleMenuClick}
      onUserMenuClick={handleUserMenuClick}
      selectedKeys={getSelectedKeys()}
      openKeys={openKeys}
      onOpenChange={handleOpenChange}
    >
      <Outlet />
    </AppLayout>
  );
};

export default AppLayoutWithRouter;