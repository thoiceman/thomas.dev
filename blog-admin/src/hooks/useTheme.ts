import { useEffect } from 'react';
import { useAppSelector, useAppDispatch } from './redux';
import { 
  setThemeMode, 
  toggleTheme, 
  updateSystemPreference, 
  setFollowSystem,
  setTransitioning,
  type ThemeMode 
} from '../store/slices/themeSlice';

// 主题hook
export const useTheme = () => {
  const dispatch = useAppDispatch();
  const theme = useAppSelector((state) => state.theme);

  // 监听系统主题变化
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = (e: MediaQueryListEvent) => {
      const systemTheme: ThemeMode = e.matches ? 'dark' : 'light';
      dispatch(updateSystemPreference(systemTheme));
    };

    // 添加监听器
    mediaQuery.addEventListener('change', handleChange);

    // 初始化系统偏好
    const initialSystemTheme: ThemeMode = mediaQuery.matches ? 'dark' : 'light';
    dispatch(updateSystemPreference(initialSystemTheme));

    // 清理监听器
    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, [dispatch]);

  // 设置主题模式
  const setTheme = (mode: ThemeMode) => {
    dispatch(setTransitioning(true));
    
    // 添加过渡效果
    setTimeout(() => {
      dispatch(setThemeMode(mode));
      setTimeout(() => {
        dispatch(setTransitioning(false));
      }, 300);
    }, 50);
  };

  // 切换主题
  const toggle = () => {
    dispatch(setTransitioning(true));
    
    setTimeout(() => {
      dispatch(toggleTheme());
      setTimeout(() => {
        dispatch(setTransitioning(false));
      }, 300);
    }, 50);
  };

  // 设置跟随系统
  const setFollowSystemTheme = (follow: boolean) => {
    dispatch(setFollowSystem(follow));
  };

  // 获取当前主题的CSS类名
  const getThemeClassName = () => {
    return theme.mode === 'dark' ? 'dark-theme' : 'light-theme';
  };

  // 检查是否为暗色主题
  const isDark = theme.mode === 'dark';

  // 检查是否为亮色主题
  const isLight = theme.mode === 'light';

  return {
    // 状态
    mode: theme.mode,
    isTransitioning: theme.isTransitioning,
    systemPreference: theme.systemPreference,
    followSystem: theme.followSystem,
    isDark,
    isLight,
    
    // 方法
    setTheme,
    toggle,
    setFollowSystemTheme,
    getThemeClassName,
  };
};

// 主题提供者hook（用于在组件树顶层初始化主题）
export const useThemeProvider = () => {
  const { mode } = useTheme();

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // 设置HTML根元素的主题类
    const root = document.documentElement;
    root.setAttribute('data-theme', mode);
    
    // 设置主题类名
    if (mode === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.add('light');
      root.classList.remove('dark');
    }

    // 设置CSS变量（可选，用于自定义样式）
    if (mode === 'dark') {
      root.style.setProperty('--theme-bg', '#141414');
      root.style.setProperty('--theme-text', '#ffffff');
      root.style.setProperty('--theme-border', '#434343');
    } else {
      root.style.setProperty('--theme-bg', '#ffffff');
      root.style.setProperty('--theme-text', '#000000');
      root.style.setProperty('--theme-border', '#d9d9d9');
    }
  }, [mode]);

  return { mode };
};