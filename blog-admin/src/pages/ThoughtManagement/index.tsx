import React, { useState } from 'react';
import ThoughtList from './ThoughtList';
import ThoughtForm from './ThoughtForm';
import type { Thought } from '../../types/thought';

/**
 * 想法管理主页面组件
 * 整合想法列表和表单功能，提供完整的想法管理界面
 */
const ThoughtManagement: React.FC = () => {
  // 组件状态
  const [formVisible, setFormVisible] = useState(false);
  const [editingThought, setEditingThought] = useState<Thought | null>(null);

  // 打开新增表单
  const handleAdd = () => {
    setEditingThought(null);
    setFormVisible(true);
  };

  // 打开编辑表单
  const handleEdit = (thought: Thought) => {
    setEditingThought(thought);
    setFormVisible(true);
  };

  // 关闭表单
  const handleFormCancel = () => {
    setFormVisible(false);
    setEditingThought(null);
  };

  // 表单提交成功
  const handleFormSuccess = () => {
    setFormVisible(false);
    setEditingThought(null);
    // 刷新列表数据会在ThoughtList组件中自动处理
  };

  return (
    <div className="thought-management">
      {/* 想法列表 */}
      <ThoughtList 
        onEdit={handleEdit}
        onAdd={handleAdd}
      />

      {/* 想法表单弹窗 */}
      <ThoughtForm
        visible={formVisible}
        onCancel={handleFormCancel}
        onSuccess={handleFormSuccess}
        editingThought={editingThought}
        title={editingThought ? '编辑想法' : '新增想法'}
      />
    </div>
  );
};

export default ThoughtManagement;