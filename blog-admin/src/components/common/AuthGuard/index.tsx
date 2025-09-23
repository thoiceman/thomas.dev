import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Spin } from 'antd';
import type { RootState, AppDispatch } from '../../../store';
import { fetchUserInfo } from '../../../store/slices/authSlice';
import './index.css';

/**
 * 路由权限守卫组件属性接口
 */
interface AuthGuardProps {
  children: React.ReactNode;
  requireAuth?: boolean; // 是否需要认证，默认为true
  redirectTo?: string; // 重定向路径，默认为登录页
}

/**
 * 公开路由列表（不需要认证的路由）
 */
const PUBLIC_ROUTES = [
  '/auth/login',
  '/auth/register',
  '/terms',
  '/privacy',
  '/404',
  '/500'
];

/**
 * 路由权限守卫组件
 * 用于保护需要认证的路由，未登录用户将被重定向到登录页面
 */
const AuthGuard: React.FC<AuthGuardProps> = ({
  children,
  requireAuth = true,
  redirectTo = '/auth/login'
}) => {
  const location = useLocation();
  const dispatch = useDispatch<AppDispatch>();
  const { isAuthenticated, user, loading, error } = useSelector((state: RootState) => state.auth);
  const [isInitializing, setIsInitializing] = useState(true);

  /**
   * 检查当前路由是否为公开路由
   */
  const isPublicRoute = (pathname: string): boolean => {
    return PUBLIC_ROUTES.some(route => pathname.startsWith(route));
  };

  /**
   * 检查用户是否有权限访问当前路由
   */
  const hasPermission = (pathname: string): boolean => {
    // 如果是公开路由，直接允许访问
    if (isPublicRoute(pathname)) {
      return true;
    }

    // 如果不需要认证，直接允许访问
    if (!requireAuth) {
      return true;
    }

    // 需要认证的路由，检查用户是否已登录
    return isAuthenticated && !!user;
  };

  /**
   * 获取重定向路径
   */
  const getRedirectPath = (): string => {
    const currentPath = location.pathname;
    
    // 如果用户已登录但访问登录/注册页面，重定向到首页
    if (isAuthenticated && (currentPath === '/auth/login' || currentPath === '/auth/register')) {
      return '/dashboard';
    }

    // 如果用户未登录且访问需要认证的页面，重定向到登录页面
    if (!isAuthenticated && !isPublicRoute(currentPath)) {
      // 保存当前路径，登录后可以重定向回来
      const returnUrl = encodeURIComponent(currentPath + location.search);
      return `${redirectTo}?returnUrl=${returnUrl}`;
    }

    return redirectTo;
  };

  /**
   * 初始化认证状态
   */
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // 检查本地存储中是否有token
        const token = localStorage.getItem('token') || sessionStorage.getItem('token');
        
        if (token && !isAuthenticated && !user) {
          // 如果有token但用户信息为空，尝试获取用户信息
          await dispatch(fetchUserInfo()).unwrap();
        }
      } catch (error) {
        console.error('初始化认证状态失败:', error);
        // 清除无效的token
        localStorage.removeItem('token');
        sessionStorage.removeItem('token');
      } finally {
        setIsInitializing(false);
      }
    };

    initializeAuth();
  }, [dispatch, isAuthenticated, user]);

  /**
   * 监听路由变化，验证权限
   */
  useEffect(() => {
    // 如果正在初始化，不进行权限检查
    if (isInitializing || loading) {
      return;
    }

    const currentPath = location.pathname;
    
    // 记录访问日志（可选）
    console.log(`访问路由: ${currentPath}, 认证状态: ${isAuthenticated}, 用户: ${user?.username || '未登录'}`);
    
    // 检查权限
    if (!hasPermission(currentPath)) {
      console.warn(`用户无权限访问路由: ${currentPath}`);
    }
  }, [location.pathname, isAuthenticated, user, isInitializing, loading]);

  // 显示加载状态
  if (isInitializing || loading) {
    return (
      <div className="auth-guard-loading">
        <Spin size="large" tip="正在验证身份..." />
      </div>
    );
  }

  // 检查权限并决定是否重定向
  const currentPath = location.pathname;
  
  // 如果用户已登录但访问登录/注册页面，重定向到首页
  if (isAuthenticated && (currentPath === '/auth/login' || currentPath === '/auth/register')) {
    return <Navigate to="/dashboard" replace />;
  }

  // 如果需要认证但用户未登录，重定向到登录页面
  if (requireAuth && !isAuthenticated && !isPublicRoute(currentPath)) {
    const returnUrl = encodeURIComponent(currentPath + location.search);
    return <Navigate to={`${redirectTo}?returnUrl=${returnUrl}`} replace />;
  }

  // 如果有认证错误且不是公开路由，重定向到登录页面
  if (error && !isPublicRoute(currentPath) && requireAuth) {
    console.error('认证错误:', error);
    return <Navigate to={redirectTo} replace />;
  }

  // 权限验证通过，渲染子组件
  return <>{children}</>;
};

/**
 * 高阶组件：为组件添加认证保护
 */
export const withAuthGuard = <P extends object>(
  Component: React.ComponentType<P>,
  options?: {
    requireAuth?: boolean;
    redirectTo?: string;
  }
) => {
  const WrappedComponent: React.FC<P> = (props) => {
    return (
      <AuthGuard requireAuth={options?.requireAuth} redirectTo={options?.redirectTo}>
        <Component {...props} />
      </AuthGuard>
    );
  };

  WrappedComponent.displayName = `withAuthGuard(${Component.displayName || Component.name})`;
  
  return WrappedComponent;
};

/**
 * Hook：获取当前用户权限信息
 */
export const useAuthGuard = () => {
  const location = useLocation();
  const { isAuthenticated, user, loading, error } = useSelector((state: RootState) => state.auth);

  const isPublicRoute = (pathname?: string): boolean => {
    const path = pathname || location.pathname;
    return PUBLIC_ROUTES.some(route => path.startsWith(route));
  };

  const hasPermission = (pathname?: string): boolean => {
    const path = pathname || location.pathname;
    
    if (isPublicRoute(path)) {
      return true;
    }

    return isAuthenticated && !!user;
  };

  const canAccess = (pathname: string): boolean => {
    return hasPermission(pathname);
  };

  return {
    isAuthenticated,
    user,
    loading,
    error,
    isPublicRoute,
    hasPermission,
    canAccess,
    currentPath: location.pathname
  };
};

export default AuthGuard;