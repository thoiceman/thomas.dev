import React, { useState } from 'react';
import TravelList from './TravelList';
import TravelForm from './TravelForm';
import type { Travel } from '../../types/travel';

/**
 * 旅行记录管理主页面组件
 * 整合旅行记录列表和表单功能，提供完整的旅行记录管理界面
 */
const TravelManagement: React.FC = () => {
  // 组件状态
  const [formVisible, setFormVisible] = useState(false);
  const [editingTravel, setEditingTravel] = useState<Travel | null>(null);

  // 打开新增表单
  const handleAdd = () => {
    setEditingTravel(null);
    setFormVisible(true);
  };

  // 打开编辑表单
  const handleEdit = (travel: Travel) => {
    setEditingTravel(travel);
    setFormVisible(true);
  };

  // 关闭表单
  const handleFormCancel = () => {
    setFormVisible(false);
    setEditingTravel(null);
  };

  // 表单提交成功
  const handleFormSuccess = () => {
    setFormVisible(false);
    setEditingTravel(null);
    // 刷新列表数据会在TravelList组件中自动处理
  };

  return (
    <div className="travel-management">
      {/* 旅行记录列表 */}
      <TravelList 
        onEdit={handleEdit}
        onAdd={handleAdd}
      />

      {/* 旅行记录表单弹窗 */}
      <TravelForm
        visible={formVisible}
        onCancel={handleFormCancel}
        onSuccess={handleFormSuccess}
        editingTravel={editingTravel}
        title={editingTravel ? '编辑旅行记录' : '新增旅行记录'}
      />
    </div>
  );
};

export default TravelManagement;