/**
 * Markdown 编辑器组件
 * 支持实时预览、图片上传、全屏编辑等功能
 */

import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Button, Upload, message, Tooltip, Space, Modal } from 'antd';
import {
  FullscreenOutlined,
  FullscreenExitOutlined,
  EyeOutlined,
  EyeInvisibleOutlined,
  PictureOutlined,
  InfoCircleOutlined
} from '@ant-design/icons';
import MDEditor from '@uiw/react-md-editor';
import { useAppDispatch } from '../../hooks/redux';
import { uploadImage } from '../../store/slices/articleSlice';
import type { UploadFile, UploadProps } from 'antd/es/upload';
import type { ImageUploadResponse } from '../../types/article';
import './index.css';

interface MarkdownEditorProps {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  height?: number;
  disabled?: boolean;
  preview?: 'edit' | 'preview' | 'live';
  hideToolbar?: boolean;
  visibleDragBar?: boolean;
  className?: string;
  style?: React.CSSProperties;
  onWordCountChange?: (wordCount: number, readingTime: number) => void;
}

const MarkdownEditor: React.FC<MarkdownEditorProps> = ({
  value = '',
  onChange,
  placeholder = '请输入文章内容...',
  height = 400,
  disabled = false,
  preview = 'live',
  hideToolbar = false,
  visibleDragBar = true,
  className,
  style,
  onWordCountChange
}) => {
  const dispatch = useAppDispatch();
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [previewMode, setPreviewMode] = useState<'edit' | 'preview' | 'live'>(preview);
  const [uploading, setUploading] = useState(false);
  const [wordCount, setWordCount] = useState(0);
  const [readingTime, setReadingTime] = useState(0);
  const editorRef = useRef<HTMLDivElement>(null);

  // 计算字数和阅读时间
  const calculateStats = useCallback((content: string) => {
    // 移除 Markdown 语法字符，只计算实际内容
    const plainText = content
      .replace(/[#*`_~\[\]()]/g, '') // 移除 Markdown 语法字符
      .replace(/!\[.*?\]\(.*?\)/g, '') // 移除图片语法
      .replace(/\[.*?\]\(.*?\)/g, '') // 移除链接语法
      .replace(/```[\s\S]*?```/g, '') // 移除代码块
      .replace(/`.*?`/g, '') // 移除行内代码
      .replace(/\n+/g, ' ') // 将换行符替换为空格
      .trim();

    const words = plainText.length;
    const time = Math.ceil(words / 200); // 假设每分钟阅读200字

    setWordCount(words);
    setReadingTime(time);
    onWordCountChange?.(words, time);
  }, [onWordCountChange]);

  // 监听内容变化
  useEffect(() => {
    calculateStats(value);
  }, [value, calculateStats]);

  // 处理内容变化
  const handleChange = useCallback((val?: string) => {
    const newValue = val || '';
    onChange?.(newValue);
  }, [onChange]);

  // 切换全屏模式
  const toggleFullscreen = useCallback(() => {
    setIsFullscreen(!isFullscreen);
  }, [isFullscreen]);

  // 切换预览模式
  const togglePreview = useCallback(() => {
    const modes: Array<'edit' | 'preview' | 'live'> = ['edit', 'live', 'preview'];
    const currentIndex = modes.indexOf(previewMode);
    const nextIndex = (currentIndex + 1) % modes.length;
    setPreviewMode(modes[nextIndex]);
  }, [previewMode]);

  // 图片上传处理
  const handleImageUpload: UploadProps['customRequest'] = async (options) => {
    const { file, onSuccess, onError } = options;
    
    try {
      setUploading(true);
      const result = await dispatch(uploadImage(file as File)).unwrap();
      
      // 插入图片到编辑器
      const imageMarkdown = `![${result.filename}](${result.url})`;
      const newValue = value + '\n' + imageMarkdown;
      handleChange(newValue);
      
      onSuccess?.(result);
      message.success('图片上传成功');
    } catch (error: any) {
      onError?.(error);
      message.error(error.message || '图片上传失败');
    } finally {
      setUploading(false);
    }
  };

  // 粘贴图片处理
  const handlePaste = useCallback(async (event: ClipboardEvent) => {
    const items = event.clipboardData?.items;
    if (!items) return;

    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (item.type.indexOf('image') !== -1) {
        event.preventDefault();
        const file = item.getAsFile();
        if (file) {
          try {
            setUploading(true);
            const result = await dispatch(uploadImage(file)).unwrap();
            const imageMarkdown = `![${result.filename}](${result.url})`;
            const newValue = value + '\n' + imageMarkdown;
            handleChange(newValue);
            message.success('图片上传成功');
          } catch (error: any) {
            message.error(error.message || '图片上传失败');
          } finally {
            setUploading(false);
          }
        }
        break;
      }
    }
  }, [dispatch, value, handleChange]);

  // 绑定粘贴事件
  useEffect(() => {
    const editor = editorRef.current;
    if (editor) {
      editor.addEventListener('paste', handlePaste);
      return () => {
        editor.removeEventListener('paste', handlePaste);
      };
    }
  }, [handlePaste]);

  // 获取预览模式图标和文本
  const getPreviewModeInfo = () => {
    switch (previewMode) {
      case 'edit':
        return { icon: <EyeInvisibleOutlined />, text: '编辑模式' };
      case 'preview':
        return { icon: <EyeOutlined />, text: '预览模式' };
      case 'live':
        return { icon: <EyeOutlined />, text: '实时预览' };
      default:
        return { icon: <EyeOutlined />, text: '实时预览' };
    }
  };

  const previewInfo = getPreviewModeInfo();

  // 自定义工具栏
  const customToolbar = (
    <div className="markdown-editor-toolbar">
      <Space>
        <Upload
          accept="image/*"
          showUploadList={false}
          customRequest={handleImageUpload}
          disabled={disabled || uploading}
        >
          <Tooltip title="上传图片">
            <Button
              type="text"
              icon={<PictureOutlined />}
              loading={uploading}
              disabled={disabled}
            >
              图片
            </Button>
          </Tooltip>
        </Upload>
        
        <Tooltip title={previewInfo.text}>
          <Button
            type="text"
            icon={previewInfo.icon}
            onClick={togglePreview}
            disabled={disabled}
          />
        </Tooltip>
        
        <Tooltip title={isFullscreen ? '退出全屏' : '全屏编辑'}>
          <Button
            type="text"
            icon={isFullscreen ? <FullscreenExitOutlined /> : <FullscreenOutlined />}
            onClick={toggleFullscreen}
            disabled={disabled}
          />
        </Tooltip>
        
        <div className="markdown-editor-stats">
          <Tooltip title="字数统计">
            <span className="stat-item">
              <InfoCircleOutlined /> {wordCount} 字
            </span>
          </Tooltip>
          <Tooltip title="预计阅读时间">
            <span className="stat-item">
              约 {readingTime} 分钟
            </span>
          </Tooltip>
        </div>
      </Space>
    </div>
  );

  return (
    <>
      <div
        ref={editorRef}
        className={`markdown-editor-container ${className || ''}`}
        style={style}
      >
        {!hideToolbar && customToolbar}
        
        <MDEditor
          value={value}
          onChange={handleChange}
          preview={previewMode}
          height={height}
          visibleDragbar={visibleDragBar}
          data-color-mode="light"
          hideToolbar
          textareaProps={{
            placeholder,
            disabled,
            style: { fontSize: 14, lineHeight: 1.6 }
          }}
        />
      </div>

      {/* 全屏模式弹窗 */}
      <Modal
        title="全屏编辑"
        open={isFullscreen}
        onCancel={toggleFullscreen}
        footer={null}
        width="100vw"
        style={{ top: 0, paddingBottom: 0 }}
        bodyStyle={{ height: 'calc(100vh - 55px)', padding: 0 }}
        destroyOnClose
      >
        <div className="markdown-editor-fullscreen">
          <MDEditor
            value={value}
            onChange={handleChange}
            preview={previewMode}
            height="100%"
            visibleDragbar={visibleDragBar}
            data-color-mode="light"
            hideToolbar
            textareaProps={{
              placeholder,
              disabled,
              style: { fontSize: 14, lineHeight: 1.6 }
            }}
          />
        </div>
      </Modal>
    </>
  );
};

export default MarkdownEditor;