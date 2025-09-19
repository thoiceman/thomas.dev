import React from 'react';
import { Button, Switch, Tooltip, Dropdown, Space } from 'antd';
import { 
  SunOutlined, 
  MoonOutlined, 
  DesktopOutlined
} from '@ant-design/icons';
import { useTheme } from '../../hooks/useTheme';
import type { MenuProps } from 'antd';
import './index.css';

// 主题切换组件属性
interface ThemeToggleProps {
  /** 显示模式 */
  mode?: 'button' | 'switch' | 'dropdown';
  /** 尺寸 */
  size?: 'small' | 'middle' | 'large';
  /** 是否显示文本 */
  showText?: boolean;
  /** 自定义类名 */
  className?: string;
}

// 主题切换组件
export const ThemeToggle: React.FC<ThemeToggleProps> = ({
  mode = 'button',
  size = 'middle',
  showText = false,
  className = '',
}) => {
  const { 
    mode: themeMode, 
    isTransitioning, 
    followSystem, 
    systemPreference,
    toggle, 
    setTheme, 
    setFollowSystemTheme 
  } = useTheme();

  // 按钮模式
  if (mode === 'button') {
    return (
      <Tooltip title={themeMode === 'light' ? '切换到暗色模式' : '切换到亮色模式'}>
        <Button
          type="text"
          size={size}
          icon={themeMode === 'light' ? <MoonOutlined /> : <SunOutlined />}
          onClick={toggle}
          loading={isTransitioning}
          className={`theme-toggle-button ${className}`}
        >
          {showText && (themeMode === 'light' ? '暗色' : '亮色')}
        </Button>
      </Tooltip>
    );
  }

  // 开关模式
  if (mode === 'switch') {
    return (
      <div className={`theme-toggle-switch ${className}`}>
        <Space>
          <SunOutlined className={themeMode === 'light' ? 'active' : ''} />
          <Switch
            checked={themeMode === 'dark'}
            onChange={(checked) => setTheme(checked ? 'dark' : 'light')}
            loading={isTransitioning}
            size={size === 'large' ? 'default' : 'small'}
          />
          <MoonOutlined className={themeMode === 'dark' ? 'active' : ''} />
          {showText && <span>{themeMode === 'light' ? '亮色模式' : '暗色模式'}</span>}
        </Space>
      </div>
    );
  }

  // 下拉菜单模式
  if (mode === 'dropdown') {
    const menuItems: MenuProps['items'] = [
      {
        key: 'light',
        icon: <SunOutlined />,
        label: '亮色模式',
        onClick: () => setTheme('light'),
      },
      {
        key: 'dark',
        icon: <MoonOutlined />,
        label: '暗色模式',
        onClick: () => setTheme('dark'),
      },
      {
        type: 'divider',
      },
      {
        key: 'system',
        icon: <DesktopOutlined />,
        label: (
          <Space>
            跟随系统
            <Switch
              size="small"
              checked={followSystem}
              onChange={(checked) => setFollowSystemTheme(checked)}
            />
          </Space>
        ),
        onClick: () => {}, // 空函数，防止菜单关闭
      },
    ];

    return (
      <Dropdown
        menu={{ items: menuItems }}
        trigger={['click']}
        placement="bottomRight"
        className={className}
      >
        <Button
          type="text"
          size={size}
          icon={
            followSystem ? (
              <DesktopOutlined />
            ) : themeMode === 'light' ? (
              <SunOutlined />
            ) : (
              <MoonOutlined />
            )
          }
          loading={isTransitioning}
          className="theme-toggle-dropdown"
        >
          {showText && (
            followSystem 
              ? `跟随系统 (${systemPreference === 'light' ? '亮色' : '暗色'})`
              : themeMode === 'light' ? '亮色模式' : '暗色模式'
          )}
        </Button>
      </Dropdown>
    );
  }

  return null;
};

// 简单的主题切换按钮（默认导出）
const SimpleThemeToggle: React.FC = () => {
  return <ThemeToggle mode="button" />;
};

export default SimpleThemeToggle;