import React, { useEffect, useState } from 'react';
import {
  Modal,
  Form,
  Input,
  Button,
  Space,
  message,
  Row,
  Col,
  Typography,
  Divider,
  Tooltip,
  Tag,
  Card,
  Select,
  Switch,
  DatePicker,
  InputNumber,
  Upload,
  Image,
} from 'antd';
import {
  InfoCircleOutlined,
  EyeOutlined,
  ReloadOutlined,
  ProjectOutlined,
  PlusOutlined,
  DeleteOutlined,
  UploadOutlined,
} from '@ant-design/icons';
import { useAppDispatch } from '../../hooks/redux';
import {
  createProject,
  updateProject,
} from '../../store/slices/projectSlice';
import type {
  Project,
  ProjectCreateRequest,
  ProjectUpdateRequest,
  ProjectStatus,
  ProjectType,
} from '../../types/project';
import {
  PROJECT_STATUS_OPTIONS,
  PROJECT_TYPE_OPTIONS,
  PROJECT_FORM_INITIAL_VALUES,
  COMMON_TECH_STACK_OPTIONS,
} from '../../types/project';
import dayjs from 'dayjs';

const { TextArea } = Input;
const { Text } = Typography;
const { Option } = Select;

// 组件属性接口
interface ProjectFormProps {
  /** 是否显示弹窗 */
  visible: boolean;
  /** 关闭弹窗回调 */
  onCancel: () => void;
  /** 提交成功回调 */
  onSuccess?: () => void;
  /** 编辑的项目数据（新增时为null） */
  editingProject?: Project | null;
  /** 弹窗标题 */
  title?: string;
}

// 表单数据接口
interface FormData {
  name: string;
  slug: string;
  description?: string;
  content?: string;
  coverImage?: string;
  images?: string[];
  demoUrl?: string;
  githubUrl?: string;
  downloadUrl?: string;
  techStack?: string[];
  features?: string[];
  projectType?: ProjectType;
  status: ProjectStatus;
  isFeatured: boolean;
  isOpenSource: boolean;
  startDate?: string;
  endDate?: string;
  sortOrder: number;
}

/**
 * 项目表单组件
 * 支持新增和编辑项目功能
 */
const ProjectForm: React.FC<ProjectFormProps> = ({
  visible,
  onCancel,
  onSuccess,
  editingProject,
  title,
}) => {
  const dispatch = useAppDispatch();
  const [form] = Form.useForm<FormData>();
  const [loading, setLoading] = useState(false);

  // 是否为编辑模式
  const isEditing = !!editingProject;
  
  // 弹窗标题
  const modalTitle = title || (isEditing ? '编辑项目' : '新增项目');

  // 监听编辑数据变化，初始化表单
  useEffect(() => {
    if (visible) {
      if (isEditing && editingProject) {
        // 编辑模式：填充现有数据
        const formData: FormData = {
          name: editingProject.name,
          slug: editingProject.slug,
          description: editingProject.description,
          content: editingProject.content,
          coverImage: editingProject.coverImage,
          images: editingProject.images || [],
          demoUrl: editingProject.demoUrl,
          githubUrl: editingProject.githubUrl,
          downloadUrl: editingProject.downloadUrl,
          techStack: editingProject.techStack || [],
          features: editingProject.features || [],
          projectType: editingProject.projectType,
          status: editingProject.status,
          isFeatured: editingProject.isFeatured,
          isOpenSource: editingProject.isOpenSource,
          startDate: editingProject.startDate,
          endDate: editingProject.endDate,
          sortOrder: editingProject.sortOrder,
        };
        form.setFieldsValue(formData);
      } else {
        // 新增模式：设置默认值
        form.setFieldsValue(PROJECT_FORM_INITIAL_VALUES);
      }
    }
  }, [visible, isEditing, editingProject, form]);

  // 生成项目别名
  const generateSlug = (name: string): string => {
    return name
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')
      .replace(/[^\w\-]/g, '')
      .replace(/--+/g, '-')
      .replace(/^-|-$/g, '');
  };

  // 项目名称变化时自动生成别名
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    if (name && !isEditing) {
      const slug = generateSlug(name);
      form.setFieldValue('slug', slug);
    }
  };

  // 表单提交
  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);

      // 处理日期格式
      const processedValues = {
        ...values,
        startDate: values.startDate ? dayjs(values.startDate).format('YYYY-MM-DD') : undefined,
        endDate: values.endDate ? dayjs(values.endDate).format('YYYY-MM-DD') : undefined,
      };

      if (isEditing && editingProject) {
        // 编辑项目
        const updateData: ProjectUpdateRequest = processedValues;
        
        await dispatch(updateProject({ 
          id: editingProject.id, 
          data: updateData 
        })).unwrap();
        
        message.success('项目更新成功');
      } else {
        // 新增项目
        const createData: ProjectCreateRequest = processedValues;
        
        await dispatch(createProject(createData)).unwrap();
        message.success('项目创建成功');
      }

      // 成功后关闭弹窗并回调
      handleCancel();
      onSuccess?.();
    } catch (error: any) {
      message.error(error || `项目${isEditing ? '更新' : '创建'}失败`);
    } finally {
      setLoading(false);
    }
  };

  // 取消操作
  const handleCancel = () => {
    form.resetFields();
    onCancel();
  };

  // 重置表单
  const handleReset = () => {
    if (isEditing && editingProject) {
      const formData: FormData = {
        name: editingProject.name,
        slug: editingProject.slug,
        description: editingProject.description,
        content: editingProject.content,
        coverImage: editingProject.coverImage,
        images: editingProject.images || [],
        demoUrl: editingProject.demoUrl,
        githubUrl: editingProject.githubUrl,
        downloadUrl: editingProject.downloadUrl,
        techStack: editingProject.techStack || [],
        features: editingProject.features || [],
        projectType: editingProject.projectType,
        status: editingProject.status,
        isFeatured: editingProject.isFeatured,
        isOpenSource: editingProject.isOpenSource,
        startDate: editingProject.startDate,
        endDate: editingProject.endDate,
        sortOrder: editingProject.sortOrder,
      };
      form.setFieldsValue(formData);
    } else {
      form.setFieldsValue(PROJECT_FORM_INITIAL_VALUES);
    }
  };

  return (
    <Modal
      title={
        <Space>
          <ProjectOutlined />
          {modalTitle}
        </Space>
      }
      open={visible}
      onCancel={handleCancel}
      width={800}
      footer={
        <Space>
          <Button onClick={handleCancel}>
            取消
          </Button>
          <Button 
            icon={<ReloadOutlined />} 
            onClick={handleReset}
          >
            重置
          </Button>
          <Button
            type="primary"
            loading={loading}
            onClick={handleSubmit}
          >
            {isEditing ? '更新' : '创建'}
          </Button>
        </Space>
      }
      destroyOnClose
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={PROJECT_FORM_INITIAL_VALUES}
      >
        {/* 基本信息 */}
        <Card size="small" title="基本信息" style={{ marginBottom: 16 }}>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="name"
                label="项目名称"
                rules={[
                  { required: true, message: '请输入项目名称' },
                  { max: 100, message: '项目名称不能超过100个字符' },
                ]}
              >
                <Input
                  placeholder="请输入项目名称"
                  onChange={handleNameChange}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="slug"
                label={
                  <Space>
                    项目别名
                    <Tooltip title="用于生成SEO友好的URL，建议使用英文和连字符">
                      <InfoCircleOutlined />
                    </Tooltip>
                  </Space>
                }
                rules={[
                  { required: true, message: '请输入项目别名' },
                  { pattern: /^[a-z0-9-]+$/, message: '别名只能包含小写字母、数字和连字符' },
                  { max: 100, message: '别名不能超过100个字符' },
                ]}
              >
                <Input placeholder="project-slug" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="description"
            label="项目描述"
            rules={[
              { max: 500, message: '描述不能超过500个字符' },
            ]}
          >
            <TextArea
              placeholder="请输入项目简短描述"
              rows={3}
              showCount
              maxLength={500}
            />
          </Form.Item>

          <Form.Item
            name="content"
            label="详细介绍"
            rules={[
              { max: 5000, message: '详细介绍不能超过5000个字符' },
            ]}
          >
            <TextArea
              placeholder="请输入项目详细介绍，支持Markdown格式"
              rows={6}
              showCount
              maxLength={5000}
            />
          </Form.Item>
        </Card>

        {/* 项目分类 */}
        <Card size="small" title="项目分类" style={{ marginBottom: 16 }}>
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                name="projectType"
                label="项目类型"
              >
                <Select placeholder="选择项目类型" allowClear>
                  {PROJECT_TYPE_OPTIONS.map(option => (
                    <Option key={option.value} value={option.value}>
                      <Space>
                        <span>{option.icon}</span>
                        {option.label.replace(/^[🌐📱💻📚🔧🎮📦]\s*/, '')}
                      </Space>
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="status"
                label="项目状态"
                rules={[{ required: true, message: '请选择项目状态' }]}
              >
                <Select placeholder="选择项目状态">
                  {PROJECT_STATUS_OPTIONS.map(option => (
                    <Option key={option.value} value={option.value}>
                      <Tag color={option.color}>{option.label}</Tag>
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="sortOrder"
                label="排序权重"
                rules={[{ required: true, message: '请输入排序权重' }]}
              >
                <InputNumber
                  placeholder="数值越大越靠前"
                  min={0}
                  max={9999}
                  style={{ width: '100%' }}
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="isFeatured"
                label="是否精选"
                valuePropName="checked"
              >
                <Switch checkedChildren="精选" unCheckedChildren="普通" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="isOpenSource"
                label="是否开源"
                valuePropName="checked"
              >
                <Switch checkedChildren="开源" unCheckedChildren="闭源" />
              </Form.Item>
            </Col>
          </Row>
        </Card>

        {/* 项目链接 */}
        <Card size="small" title="项目链接" style={{ marginBottom: 16 }}>
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                name="demoUrl"
                label="演示地址"
                rules={[
                  { type: 'url', message: '请输入有效的URL地址' },
                ]}
              >
                <Input placeholder="https://demo.example.com" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="githubUrl"
                label="GitHub地址"
                rules={[
                  { type: 'url', message: '请输入有效的URL地址' },
                ]}
              >
                <Input placeholder="https://github.com/username/repo" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="downloadUrl"
                label="下载地址"
                rules={[
                  { type: 'url', message: '请输入有效的URL地址' },
                ]}
              >
                <Input placeholder="https://releases.example.com" />
              </Form.Item>
            </Col>
          </Row>
        </Card>

        {/* 技术信息 */}
        <Card size="small" title="技术信息" style={{ marginBottom: 16 }}>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="techStack"
                label="技术栈"
              >
                <Select
                  mode="tags"
                  placeholder="选择或输入技术栈"
                  style={{ width: '100%' }}
                  options={COMMON_TECH_STACK_OPTIONS.map(tech => ({
                    label: tech,
                    value: tech,
                  }))}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="features"
                label="主要功能"
              >
                <Select
                  mode="tags"
                  placeholder="输入主要功能特性"
                  style={{ width: '100%' }}
                />
              </Form.Item>
            </Col>
          </Row>
        </Card>

        {/* 项目时间 */}
        <Card size="small" title="项目时间" style={{ marginBottom: 16 }}>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="startDate"
                label="开始日期"
              >
                <DatePicker
                  placeholder="选择开始日期"
                  style={{ width: '100%' }}
                  format="YYYY-MM-DD"
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="endDate"
                label="结束日期"
              >
                <DatePicker
                  placeholder="选择结束日期"
                  style={{ width: '100%' }}
                  format="YYYY-MM-DD"
                />
              </Form.Item>
            </Col>
          </Row>
        </Card>

        {/* 项目媒体 */}
        <Card size="small" title="项目媒体">
          <Form.Item
            name="coverImage"
            label="封面图片"
            rules={[
              { type: 'url', message: '请输入有效的图片URL地址' },
            ]}
          >
            <Input placeholder="https://example.com/cover.jpg" />
          </Form.Item>

          <Form.Item
            name="images"
            label="项目截图"
          >
            <Select
              mode="tags"
              placeholder="输入项目截图URL地址"
              style={{ width: '100%' }}
            />
          </Form.Item>
        </Card>
      </Form>
    </Modal>
  );
};

export default ProjectForm;