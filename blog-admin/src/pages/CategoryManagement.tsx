import React, { useState } from 'react';
import CategoryList from '../components/CategoryManagement/CategoryList';
import CategoryForm from '../components/CategoryManagement/CategoryForm';
import type { Category } from '../types/category';

/**
 * 分类管理页面
 * 整合分类列表和表单功能的页面级组件
 */
const CategoryManagement: React.FC = () => {
  // 表单弹窗状态
  const [formVisible, setFormVisible] = useState(false);
  // 编辑的分类数据
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  // 打开新增表单
  const handleAdd = () => {
    setEditingCategory(null);
    setFormVisible(true);
  };

  // 打开编辑表单
  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setFormVisible(true);
  };

  // 关闭表单
  const handleFormCancel = () => {
    setFormVisible(false);
    setEditingCategory(null);
  };

  // 表单提交成功
  const handleFormSuccess = () => {
    setFormVisible(false);
    setEditingCategory(null);
    // 这里可以触发列表刷新，但由于使用了Redux，列表会自动更新
  };

  return (
    <div className="category-management-page">
      <CategoryList
        onAdd={handleAdd}
        onEdit={handleEdit}
      />

      <CategoryForm
        visible={formVisible}
        onCancel={handleFormCancel}
        onSuccess={handleFormSuccess}
        editingCategory={editingCategory}
      />
    </div>
  );
};

export default CategoryManagement;