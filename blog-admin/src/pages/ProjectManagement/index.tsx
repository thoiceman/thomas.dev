import React, { useState } from 'react';
import ProjectList from './ProjectList';
import ProjectForm from './ProjectForm';
import type { Project } from '../../types/project';

/**
 * 项目记录管理主页面组件
 * 整合项目列表和表单功能，提供完整的项目管理界面
 */
const ProjectManagement: React.FC = () => {
  // 组件状态
  const [formVisible, setFormVisible] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  // 打开新增表单
  const handleAdd = () => {
    setEditingProject(null);
    setFormVisible(true);
  };

  // 打开编辑表单
  const handleEdit = (project: Project) => {
    setEditingProject(project);
    setFormVisible(true);
  };

  // 关闭表单
  const handleFormCancel = () => {
    setFormVisible(false);
    setEditingProject(null);
  };

  // 表单提交成功
  const handleFormSuccess = () => {
    setFormVisible(false);
    setEditingProject(null);
    // 刷新列表数据会在ProjectList组件中自动处理
  };

  return (
    <div className="project-management">
      {/* 项目列表 */}
      <ProjectList 
        onEdit={handleEdit}
        onAdd={handleAdd}
      />

      {/* 项目表单弹窗 */}
      <ProjectForm
        visible={formVisible}
        onCancel={handleFormCancel}
        onSuccess={handleFormSuccess}
        editingProject={editingProject}
        title={editingProject ? '编辑项目' : '新增项目'}
      />
    </div>
  );
};

export default ProjectManagement;