import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import LoadingBar from '../LoadingBar';
import { 
  startRouteLoading, 
  completeRouteLoading, 
  selectRouteLoading,
  selectRouteProgress 
} from '../../../store/slices/routeLoadingSlice';
import type { AppDispatch, RootState } from '../../../store';

/**
 * 路由加载提供者组件
 * 负责监听路由变化并显示加载进度条
 */
interface RouteLoadingProviderProps {
  children: React.ReactNode;
  /** 进度条配置 */
  loadingBarProps?: {
    color?: string;
    height?: number;
    duration?: number;
    hideDelay?: number;
  };
  /** 是否启用路由加载效果 */
  enabled?: boolean;
}

const RouteLoadingProvider: React.FC<RouteLoadingProviderProps> = ({
  children,
  loadingBarProps = {},
  enabled = true,
}) => {
  const location = useLocation();
  const dispatch = useDispatch<AppDispatch>();
  
  const loading = useSelector((state: RootState) => selectRouteLoading(state));
  const progress = useSelector((state: RootState) => selectRouteProgress(state));

  useEffect(() => {
    if (!enabled) return;

    // 路由开始变化时启动加载
    dispatch(startRouteLoading({ path: location.pathname }));

    // 模拟页面加载完成，使用更长的延迟让用户看到进度条
    const timer = setTimeout(() => {
      dispatch(completeRouteLoading());
    }, 500); // 增加延迟时间

    return () => {
      clearTimeout(timer);
    };
  }, [location.pathname, dispatch, enabled]);

  return (
    <>
      {enabled && (
        <LoadingBar
          loading={loading}
          color={loadingBarProps.color}
          height={loadingBarProps.height}
          duration={loadingBarProps.duration}
          hideDelay={loadingBarProps.hideDelay}
        />
      )}
      {children}
    </>
  );
};

export default RouteLoadingProvider;