import React, { Suspense } from 'react';
import { Spin } from 'antd';

/**
 * 懒加载包装组件
 * 为懒加载的组件提供加载状态显示
 */
interface LazyWrapperProps {
  children: React.ReactNode;
  /** 自定义加载组件 */
  fallback?: React.ReactNode;
  /** 加载提示文本 */
  tip?: string;
  /** 是否显示在页面中心 */
  center?: boolean;
}

const LazyWrapper: React.FC<LazyWrapperProps> = ({
  children,
  fallback,
  tip = '页面加载中...',
  center = true,
}) => {
  // 默认的加载组件
  const defaultFallback = (
    <div 
      className={`
        flex items-center justify-center 
        ${center ? 'min-h-[400px]' : 'p-8'}
      `}
    >
      <Spin size="large" tip={tip} />
    </div>
  );

  return (
    <Suspense fallback={fallback || defaultFallback}>
      {children}
    </Suspense>
  );
};

/**
 * 创建懒加载组件的高阶函数
 * @param importFunc 动态导入函数
 * @param fallbackProps 加载状态配置
 * @returns 包装后的懒加载组件
 */
export const createLazyComponent = (
  importFunc: () => Promise<{ default: React.ComponentType<any> }>,
  fallbackProps?: Omit<LazyWrapperProps, 'children'>
) => {
  const LazyComponent = React.lazy(importFunc);
  
  return (props: any) => (
    <LazyWrapper {...fallbackProps}>
      <LazyComponent {...props} />
    </LazyWrapper>
  );
};

/**
 * 页面级懒加载组件
 * 专门用于页面组件的懒加载
 */
export const PageLazyWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <LazyWrapper
    tip="页面加载中..."
    center={true}
    fallback={
      <div className="flex items-center justify-center min-h-[60vh]">
        <Spin size="large" tip="页面加载中..." />
      </div>
    }
  >
    {children}
  </LazyWrapper>
);

/**
 * 组件级懒加载组件
 * 用于普通组件的懒加载
 */
export const ComponentLazyWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <LazyWrapper
    tip="组件加载中..."
    center={false}
    fallback={
      <div className="flex items-center justify-center p-4">
        <Spin tip="组件加载中..." />
      </div>
    }
  >
    {children}
  </LazyWrapper>
);

export default LazyWrapper;