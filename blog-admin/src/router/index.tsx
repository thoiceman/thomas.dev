import React from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import {
  Dashboard,
  CategoryManagement,
  TagManagement,
  TechStackManagement,
  ThoughtManagement,
  ArticleList,
  ArticleCreate,
  UserManagement
} from '../pages';
import AppLayoutWithRouter from '../components/Layout/AppLayoutWithRouter';

// 创建路由配置
export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayoutWithRouter />,
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
            element: <ArticleCreate />,
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
        path: 'users',
        element: <UserManagement />,
      },
    ],
  },
  {
    path: '*',
    element: <Navigate to="/dashboard" replace />,
  },
]);

export default router;