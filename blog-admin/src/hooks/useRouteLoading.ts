import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * 路由加载状态管理Hook
 * 用于管理页面切换时的加载状态
 */
export interface RouteLoadingOptions {
  /** 最小加载时间（毫秒），防止闪烁 */
  minLoadingTime?: number;
  /** 最大加载时间（毫秒），超时后自动完成 */
  maxLoadingTime?: number;
  /** 延迟开始时间（毫秒），短距离跳转不显示进度条 */
  delayStart?: number;
}

export const useRouteLoading = (options: RouteLoadingOptions = {}) => {
  const {
    minLoadingTime = 300,
    maxLoadingTime = 5000,
    delayStart = 100,
  } = options;

  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [loadingStartTime, setLoadingStartTime] = useState<number | null>(null);

  useEffect(() => {
    let delayTimer: NodeJS.Timeout;
    let minTimer: NodeJS.Timeout;
    let maxTimer: NodeJS.Timeout;

    // 开始加载
    const startLoading = () => {
      const startTime = Date.now();
      setLoadingStartTime(startTime);
      setLoading(true);

      // 设置最大加载时间
      maxTimer = setTimeout(() => {
        setLoading(false);
        setLoadingStartTime(null);
      }, maxLoadingTime);
    };

    // 延迟开始加载（避免快速切换时的闪烁）
    delayTimer = setTimeout(startLoading, delayStart);

    // 页面加载完成后的清理
    const handleLoadComplete = () => {
      if (loadingStartTime) {
        const elapsed = Date.now() - loadingStartTime;
        
        if (elapsed < minLoadingTime) {
          // 如果加载时间太短，延迟完成以避免闪烁
          minTimer = setTimeout(() => {
            setLoading(false);
            setLoadingStartTime(null);
          }, minLoadingTime - elapsed);
        } else {
          setLoading(false);
          setLoadingStartTime(null);
        }
      }
    };

    // 监听页面加载完成事件
    const handlePageLoad = () => {
      // 延迟一点时间确保页面渲染完成
      setTimeout(handleLoadComplete, 50);
    };

    // 添加事件监听
    window.addEventListener('load', handlePageLoad);
    document.addEventListener('DOMContentLoaded', handlePageLoad);

    // 如果页面已经加载完成，立即触发完成事件
    if (document.readyState === 'complete') {
      handlePageLoad();
    }

    return () => {
      // 清理定时器
      if (delayTimer) clearTimeout(delayTimer);
      if (minTimer) clearTimeout(minTimer);
      if (maxTimer) clearTimeout(maxTimer);
      
      // 移除事件监听
      window.removeEventListener('load', handlePageLoad);
      document.removeEventListener('DOMContentLoaded', handlePageLoad);
    };
  }, [location.pathname, minLoadingTime, maxLoadingTime, delayStart, loadingStartTime]);

  return {
    loading,
    /** 手动开始加载 */
    startLoading: () => {
      const startTime = Date.now();
      setLoadingStartTime(startTime);
      setLoading(true);
    },
    /** 手动完成加载 */
    completeLoading: () => {
      if (loadingStartTime) {
        const elapsed = Date.now() - loadingStartTime;
        
        if (elapsed < minLoadingTime) {
          setTimeout(() => {
            setLoading(false);
            setLoadingStartTime(null);
          }, minLoadingTime - elapsed);
        } else {
          setLoading(false);
          setLoadingStartTime(null);
        }
      }
    },
  };
};