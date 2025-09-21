import React, { useState } from 'react';
import TagList from './TagList';
import TagForm from './TagForm';
import type { Tag } from '../../types/tag';

/**
 * 标签管理主页面组件
 * 整合标签列表和表单功能，提供完整的标签管理界面
 */
const TagManagement: React.FC = () => {
  // 组件状态
  const [formVisible, setFormVisible] = useState(false);
  const [editingTag, setEditingTag] = useState<Tag | null>(null);

  // 打开新增表单
  const handleAdd = () => {
    setEditingTag(null);
    setFormVisible(true);
  };

  // 打开编辑表单
  const handleEdit = (tag: Tag) => {
    setEditingTag(tag);
    setFormVisible(true);
  };

  // 关闭表单
  const handleFormCancel = () => {
    setFormVisible(false);
    setEditingTag(null);
  };

  // 表单提交成功
  const handleFormSuccess = () => {
    setFormVisible(false);
    setEditingTag(null);
    // 刷新列表数据会在TagList组件中自动处理
  };

  return (
    <div className="tag-management">
      {/* 标签列表 */}
      <TagList 
        onEdit={handleEdit}
        onAdd={handleAdd}
      />

      {/* 标签表单弹窗 */}
      <TagForm
        visible={formVisible}
        onCancel={handleFormCancel}
        onSuccess={handleFormSuccess}
        editingTag={editingTag}
        title={editingTag ? '编辑标签' : '新增标签'}
      />
    </div>
  );
};

export default TagManagement;