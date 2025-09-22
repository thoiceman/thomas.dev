import React, { useState } from 'react';
import { Card, Typography, Space, Row, Col, Button } from 'antd';
import {
  PlusOutlined,
  ReloadOutlined,
} from '@ant-design/icons';
import { useAppDispatch } from '../../hooks/redux';
import TechStackList from './TechStackList';
import TechStackForm from './TechStackForm';
import type { TechStack } from '../../types/techStack';

const { Title } = Typography;

/**
 * 技术栈管理页面
 */
const TechStackManagement: React.FC = () => {
  const dispatch = useAppDispatch();

  // 组件状态
  const [formVisible, setFormVisible] = useState(false);
  const [editingTechStack, setEditingTechStack] = useState<TechStack | null>(null);

  // 打开新增表单
  const handleAdd = () => {
    setEditingTechStack(null);
    setFormVisible(true);
  };

  // 打开编辑表单
  const handleEdit = (techStack: TechStack) => {
    setEditingTechStack(techStack);
    setFormVisible(true);
  };

  // 关闭表单
  const handleFormCancel = () => {
    setFormVisible(false);
    setEditingTechStack(null);
  };

  // 表单提交成功
  const handleFormSuccess = () => {
    setFormVisible(false);
    setEditingTechStack(null);
  };

  // 刷新数据
  const handleRefresh = () => {
    // 刷新功能由TechStackList组件处理
  };

  return (
    <div className="tech-stack-management">

      {/* 技术栈列表 */}
      <TechStackList
        onEdit={handleEdit}
        onAdd={handleAdd}
      />

      {/* 技术栈表单弹窗 */}
      <TechStackForm
        visible={formVisible}
        onCancel={handleFormCancel}
        onSuccess={handleFormSuccess}
        editingTechStack={editingTechStack}
      />
    </div>
  );
};

export default TechStackManagement;