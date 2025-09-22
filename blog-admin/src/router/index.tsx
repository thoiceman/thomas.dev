import React from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import {
  Dashboard,
  CategoryManagement,
  TagManagement,
  TechStackManagement,
  ThoughtManagement,
  TravelManagement,
  UserManagement,
  ProjectManagement
} from '../pages';
import AppLayoutWithRouter from '../components/Layout/AppLayoutWithRouter';
import ArticleList from '../pages/ArticleManagement/ArticleList';
import ArticleEditor from '../pages/ArticleManagement/ArticleEditor';
import ArticleDetail from '../pages/ArticleManagement/ArticleDetail';

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
        path: 'users',
        element: <UserManagement />,
      },
      {
        path: 'projects',
        element: <ProjectManagement />,
      },
    ],
  },
  {
    path: '*',
    element: <Navigate to="/dashboard" replace />,
  },
]);

export default router;