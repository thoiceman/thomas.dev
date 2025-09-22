import React, { useState } from 'react';

/**
 * 通用管理页面组件
 * 用于减少各个管理页面的重复代码
 */
interface BaseManagementProps<T> {
  /** 列表组件 */
  ListComponent: React.ComponentType<{
    onAdd: () => void;
    onEdit: (item: T) => void;
  }>;
  /** 表单组件 */
  FormComponent: React.ComponentType<{
    visible: boolean;
    onCancel: () => void;
    onSuccess: () => void;
    editingItem?: T | null;
  }>;
  /** 容器类名 */
  className?: string;
}

function BaseManagement<T>({
  ListComponent,
  FormComponent,
  className = '',
}: BaseManagementProps<T>) {
  // 表单弹窗状态
  const [formVisible, setFormVisible] = useState(false);
  // 编辑的数据
  const [editingItem, setEditingItem] = useState<T | null>(null);

  // 打开新增表单
  const handleAdd = () => {
    setEditingItem(null);
    setFormVisible(true);
  };

  // 打开编辑表单
  const handleEdit = (item: T) => {
    setEditingItem(item);
    setFormVisible(true);
  };

  // 关闭表单
  const handleFormCancel = () => {
    setFormVisible(false);
    setEditingItem(null);
  };

  // 表单提交成功
  const handleFormSuccess = () => {
    setFormVisible(false);
    setEditingItem(null);
  };

  return (
    <div className={className}>
      <ListComponent
        onAdd={handleAdd}
        onEdit={handleEdit}
      />

      <FormComponent
        visible={formVisible}
        onCancel={handleFormCancel}
        onSuccess={handleFormSuccess}
        editingItem={editingItem}
      />
    </div>
  );
}

export default BaseManagement;