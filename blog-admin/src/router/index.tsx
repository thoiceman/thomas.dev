import React from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { createLazyComponent } from '../components/common/LazyWrapper';
import AppLayoutWithRouter from '../components/Layout/AppLayoutWithRouter';
import AuthGuard from '../components/common/AuthGuard';

// 使用懒加载创建页面组件
const Dashboard = createLazyComponent(() => import('../pages/Dashboard'), {
  tip: '仪表板加载中...'
});

const CategoryManagement = createLazyComponent(() => import('../pages/CategoryManagement'), {
  tip: '分类管理加载中...'
});

const TagManagement = createLazyComponent(() => import('../pages/TagManagement'), {
  tip: '标签管理加载中...'
});

const TechStackManagement = createLazyComponent(() => import('../pages/TechStackManagement'), {
  tip: '技术栈管理加载中...'
});

const ThoughtManagement = createLazyComponent(() => import('../pages/ThoughtManagement'), {
  tip: '想法管理加载中...'
});

const TravelManagement = createLazyComponent(() => import('../pages/TravelManagement'), {
  tip: '旅行管理加载中...'
});

const ProjectManagement = createLazyComponent(() => import('../pages/ProjectManagement'), {
  tip: '项目管理加载中...'
});

const ArticleList = createLazyComponent(() => import('../pages/ArticleManagement/ArticleList'), {
  tip: '文章列表加载中...'
});

const ArticleEditor = createLazyComponent(() => import('../pages/ArticleManagement/ArticleEditor'), {
  tip: '文章编辑器加载中...'
});

const ArticleDetail = createLazyComponent(() => import('../pages/ArticleManagement/ArticleDetail'), {
  tip: '文章详情加载中...'
});

// 认证相关页面组件
const Login = createLazyComponent(() => import('../pages/Auth/Login'), {
  tip: '登录页面加载中...'
});

const Register = createLazyComponent(() => import('../pages/Auth/Register'), {
  tip: '注册页面加载中...'
});

/**
 * 受保护的路由组件
 * 需要用户登录才能访问
 */
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <AuthGuard requireAuth={true}>
      {children}
    </AuthGuard>
  );
};

/**
 * 公开路由组件
 * 不需要用户登录即可访问
 */
const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <AuthGuard requireAuth={false}>
      {children}
    </AuthGuard>
  );
};

// 创建路由配置
export const router = createBrowserRouter([
  // 认证相关路由（公开访问）
  {
    path: '/auth',
    children: [
      {
        path: 'login',
        element: (
          <PublicRoute>
            <Login />
          </PublicRoute>
        ),
      },
      {
        path: 'register',
        element: (
          <PublicRoute>
            <Register />
          </PublicRoute>
        ),
      },
    ],
  },
  // 主应用路由（需要认证）
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <AppLayoutWithRouter />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <Navigate to="/dashboard" replace />,
      },
      {
        path: 'dashboard',
        element: <Dashboard />,
      },
      {
        path: 'articles',
        children: [
          {
            index: true,
            element: <Navigate to="/articles/list" replace />,
          },
          {
            path: 'list',
            element: <ArticleList />,
          },
          {
            path: 'create',
            element: <ArticleEditor />,
          },
          {
            path: 'editor/:id',
            element: <ArticleEditor />,
          },
          {
            path: 'detail/:id',
            element: <ArticleDetail />,
          },
        ],
      },
      {
        path: 'categories',
        element: <CategoryManagement />,
      },
      {
        path: 'tags',
        element: <TagManagement />,
      },
      {
        path: 'tech-stacks',
        element: <TechStackManagement />,
      },
      {
        path: 'thoughts',
        element: <ThoughtManagement />,
      },
      {
        path: 'travels',
        element: <TravelManagement />,
      },
      {
        path: 'projects',
        element: <ProjectManagement />,
      },
    ],
  },
  // 404 页面
  {
    path: '*',
    element: <Navigate to="/auth/login" replace />,
  },
]);

export default router;