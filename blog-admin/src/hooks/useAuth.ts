import { useSelector, useDispatch } from 'react-redux';
import { useCallback, useEffect } from 'react';
import { RootState, AppDispatch } from '../store';
import { 
  login, 
  logout, 
  fetchUserInfo, 
  logoutAsync,
  refreshToken,
  checkSessionExpiry,
  clearError,
  incrementLoginAttempts,
  resetLoginAttempts
} from '../store/slices/authSlice';

/**
 * 认证相关的自定义钩子
 * 提供认证状态管理和相关操作方法
 */
export const useAuth = () => {
  const dispatch = useDispatch<AppDispatch>();
  
  // 从Redux store获取认证状态
  const {
    isAuthenticated,
    token,
    user,
    loading,
    error,
    loginAttempts,
    lastLoginTime,
    sessionExpiry
  } = useSelector((state: RootState) => state.auth);

  /**
   * 登录方法
   */
  const handleLogin = useCallback(async (credentials: { 
    username: string; 
    password: string; 
    remember: boolean 
  }) => {
    try {
      const result = await dispatch(login(credentials)).unwrap();
      return { success: true, data: result };
    } catch (error: any) {
      return { success: false, error: error };
    }
  }, [dispatch]);

  /**
   * 登出方法
   */
  const handleLogout = useCallback(async () => {
    try {
      await dispatch(logoutAsync()).unwrap();
      return { success: true };
    } catch (error: any) {
      // 即使API调用失败，也执行本地登出
      dispatch(logout());
      return { success: true, warning: '登出API调用失败，但已清除本地认证信息' };
    }
  }, [dispatch]);

  /**
   * 获取用户信息
   */
  const handleFetchUserInfo = useCallback(async () => {
    try {
      const result = await dispatch(fetchUserInfo()).unwrap();
      return { success: true, data: result };
    } catch (error: any) {
      return { success: false, error: error };
    }
  }, [dispatch]);

  /**
   * 刷新token
   */
  const handleRefreshToken = useCallback(async () => {
    try {
      const result = await dispatch(refreshToken()).unwrap();
      return { success: true, data: result };
    } catch (error: any) {
      return { success: false, error: error };
    }
  }, [dispatch]);

  /**
   * 检查会话状态
   */
  const handleCheckSession = useCallback(async () => {
    try {
      const result = await dispatch(checkSessionExpiry()).unwrap();
      return { success: true, isValid: result };
    } catch (error: any) {
      return { success: false, error: error, isValid: false };
    }
  }, [dispatch]);

  /**
   * 清除错误信息
   */
  const handleClearError = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  /**
   * 增加登录尝试次数
   */
  const handleIncrementLoginAttempts = useCallback(() => {
    dispatch(incrementLoginAttempts());
  }, [dispatch]);

  /**
   * 重置登录尝试次数
   */
  const handleResetLoginAttempts = useCallback(() => {
    dispatch(resetLoginAttempts());
  }, [dispatch]);

  /**
   * 检查是否需要重新登录
   */
  const shouldReLogin = useCallback(() => {
    if (!token || !sessionExpiry) return true;
    return Date.now() >= sessionExpiry;
  }, [token, sessionExpiry]);

  /**
   * 获取会话剩余时间（分钟）
   */
  const getSessionTimeRemaining = useCallback(() => {
    if (!sessionExpiry) return 0;
    const remaining = sessionExpiry - Date.now();
    return Math.max(0, Math.floor(remaining / (1000 * 60)));
  }, [sessionExpiry]);

  /**
   * 检查是否为管理员
   */
  const isAdmin = useCallback(() => {
    return user?.role === 'admin';
  }, [user]);

  /**
   * 检查是否有特定权限
   */
  const hasPermission = useCallback((permission: string) => {
    // 这里可以根据实际的权限系统进行扩展
    if (!user) return false;
    
    // 管理员拥有所有权限
    if (user.role === 'admin') return true;
    
    // 根据用户角色和权限进行判断
    // 这里是示例逻辑，实际项目中需要根据具体的权限系统实现
    const rolePermissions: Record<string, string[]> = {
      'editor': ['read', 'write', 'edit'],
      'viewer': ['read'],
      'user': ['read']
    };
    
    const userPermissions = rolePermissions[user.role] || [];
    return userPermissions.includes(permission);
  }, [user]);

  /**
   * 自动检查会话状态
   */
  useEffect(() => {
    if (isAuthenticated && token) {
      // 每5分钟检查一次会话状态
      const interval = setInterval(() => {
        handleCheckSession();
      }, 5 * 60 * 1000);

      return () => clearInterval(interval);
    }
  }, [isAuthenticated, token, handleCheckSession]);

  /**
   * 页面可见性变化时检查会话
   */
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && isAuthenticated) {
        handleCheckSession();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [isAuthenticated, handleCheckSession]);

  return {
    // 状态
    isAuthenticated,
    token,
    user,
    loading,
    error,
    loginAttempts,
    lastLoginTime,
    sessionExpiry,
    
    // 方法
    login: handleLogin,
    logout: handleLogout,
    fetchUserInfo: handleFetchUserInfo,
    refreshToken: handleRefreshToken,
    checkSession: handleCheckSession,
    clearError: handleClearError,
    incrementLoginAttempts: handleIncrementLoginAttempts,
    resetLoginAttempts: handleResetLoginAttempts,
    
    // 工具方法
    shouldReLogin,
    getSessionTimeRemaining,
    isAdmin,
    hasPermission,
  };
};

export default useAuth;