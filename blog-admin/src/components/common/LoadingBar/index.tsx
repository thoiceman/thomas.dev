import React, { useEffect, useState } from 'react';
import './index.css';

/**
 * 页面加载进度条组件
 * 用于显示页面切换时的加载进度
 */
interface LoadingBarProps {
  /** 是否显示进度条 */
  loading: boolean;
  /** 进度条颜色 */
  color?: string;
  /** 进度条高度 */
  height?: number;
  /** 动画持续时间（毫秒） */
  duration?: number;
  /** 完成后延迟隐藏时间（毫秒） */
  hideDelay?: number;
}

const LoadingBar: React.FC<LoadingBarProps> = ({
  loading,
  color = '#1890ff',
  height = 3,
  duration = 300,
  hideDelay = 200,
}) => {
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    let progressTimer: NodeJS.Timeout;

    if (loading) {
      // 开始加载
      setVisible(true);
      setAnimating(true);
      setProgress(0);

      // 模拟进度增长
      const startProgress = () => {
        let currentProgress = 0;
        const increment = () => {
          if (currentProgress < 90) {
            // 前90%快速增长
            currentProgress += Math.random() * 15 + 5;
            setProgress(Math.min(currentProgress, 90));
            progressTimer = setTimeout(increment, Math.random() * 100 + 50);
          }
        };
        increment();
      };

      timer = setTimeout(startProgress, 50);
    } else {
      // 完成加载
      if (visible) {
        setProgress(100);
        
        // 延迟隐藏
        timer = setTimeout(() => {
          setAnimating(false);
          setTimeout(() => {
            setVisible(false);
            setProgress(0);
          }, duration);
        }, hideDelay);
      }
    }

    return () => {
      if (timer) clearTimeout(timer);
      if (progressTimer) clearTimeout(progressTimer);
    };
  }, [loading, visible, duration, hideDelay]);

  if (!visible) return null;

  return (
    <div 
      className={`loading-bar ${animating ? 'loading-bar--animating' : 'loading-bar--complete'}`}
      style={{
        '--loading-bar-color': color,
        '--loading-bar-height': `${height}px`,
        '--loading-bar-duration': `${duration}ms`,
      } as React.CSSProperties}
    >
      <div 
        className="loading-bar__progress"
        style={{ 
          width: `${progress}%`,
          transition: loading ? 'width 0.3s ease' : `width ${duration}ms ease`,
        }}
      />
      <div className="loading-bar__glow" />
    </div>
  );
};

export default LoadingBar;