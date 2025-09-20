import React, { useEffect, useState } from 'react';
import {
  Modal,
  Form,
  Input,
  Select,
  ColorPicker,
  InputNumber,
  Switch,
  Button,
  Space,
  message,
  Row,
  Col,
  Typography,
  Divider,
  Tooltip,
} from 'antd';
import {
  InfoCircleOutlined,
  EyeOutlined,
  ReloadOutlined,
} from '@ant-design/icons';
import { useAppDispatch } from '../../hooks/redux';
import {
  createCategory,
  updateCategory,
} from '../../store/slices/categorySlice';
import type {
  Category,
  CategoryCreateRequest,
  CategoryUpdateRequest,
} from '../../types/category';
import {
  CategoryStatus,
  CATEGORY_STATUS_OPTIONS,
  DEFAULT_CATEGORY_COLORS,
} from '../../types/category';

const { TextArea } = Input;
const { Option } = Select;
const { Text } = Typography;

// 组件属性接口
interface CategoryFormProps {
  /** 是否显示弹窗 */
  visible: boolean;
  /** 关闭弹窗回调 */
  onCancel: () => void;
  /** 提交成功回调 */
  onSuccess?: () => void;
  /** 编辑的分类数据（新增时为null） */
  editingCategory?: Category | null;
  /** 弹窗标题 */
  title?: string;
}

// 表单数据接口
interface FormData {
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  color?: string;
  sortOrder: number;
  status: CategoryStatus;
}

/**
 * 分类表单组件
 * 支持新增和编辑分类
 */
const CategoryForm: React.FC<CategoryFormProps> = ({
  visible,
  onCancel,
  onSuccess,
  editingCategory,
  title,
}) => {
  const dispatch = useAppDispatch();
  const [form] = Form.useForm<FormData>();
  const [loading, setLoading] = useState(false);
  const [slugChecking, setSlugChecking] = useState(false);
  const [previewColor, setPreviewColor] = useState('#1890ff');

  // 是否为编辑模式
  const isEditing = !!editingCategory;
  
  // 弹窗标题
  const modalTitle = title || (isEditing ? '编辑分类' : '新增分类');

  // 初始化表单数据
  useEffect(() => {
    if (visible) {
      if (isEditing && editingCategory) {
        // 编辑模式：填充现有数据
        form.setFieldsValue({
          name: editingCategory.name,
          slug: editingCategory.slug,
          description: editingCategory.description || '',
          icon: editingCategory.icon || '',
          color: editingCategory.color || '#1890ff',
          sortOrder: editingCategory.sortOrder,
          status: editingCategory.status,
        });
        setPreviewColor(editingCategory.color || '#1890ff');
      } else {
        // 新增模式：设置默认值
        form.setFieldsValue({
          name: '',
          slug: '',
          description: '',
          icon: '',
          color: '#1890ff',
          sortOrder: 0,
          status: CategoryStatus.ENABLED,
        });
        setPreviewColor('#1890ff');
      }
    }
  }, [visible, isEditing, editingCategory, form]);

  // 根据名称自动生成slug
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    if (!isEditing && name) {
      // 简单的slug生成逻辑：转小写，替换空格为连字符
      const slug = name
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9\-]/g, '');
      form.setFieldValue('slug', slug);
    }
  };

  // 颜色变化处理
  const handleColorChange = (color: any) => {
    const colorValue = typeof color === 'string' ? color : color.toHexString();
    setPreviewColor(colorValue);
    form.setFieldValue('color', colorValue);
  };

  // 使用预设颜色
  const handlePresetColorClick = (color: string) => {
    setPreviewColor(color);
    form.setFieldValue('color', color);
  };

  // 表单提交
  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);

      if (isEditing && editingCategory) {
        // 编辑分类
        const updateData: CategoryUpdateRequest = {
          ...values,
        };
        await dispatch(updateCategory({
          id: editingCategory.id,
          data: updateData,
        })).unwrap();
        message.success('分类更新成功');
      } else {
        // 新增分类
        const createData: CategoryCreateRequest = {
          ...values,
        };
        await dispatch(createCategory(createData)).unwrap();
        message.success('分类创建成功');
      }

      onSuccess?.();
      handleCancel();
    } catch (error: any) {
      message.error(error.message || '操作失败');
    } finally {
      setLoading(false);
    }
  };

  // 取消操作
  const handleCancel = () => {
    form.resetFields();
    setPreviewColor('#1890ff');
    onCancel();
  };

  // 重置表单
  const handleReset = () => {
    form.resetFields();
    setPreviewColor('#1890ff');
  };

  return (
    <Modal
      title={modalTitle}
      open={visible}
      onCancel={handleCancel}
      width={600}
      footer={[
        <Button key="cancel" onClick={handleCancel}>
          取消
        </Button>,
        <Button key="reset" onClick={handleReset}>
          重置
        </Button>,
        <Button
          key="submit"
          type="primary"
          loading={loading}
          onClick={handleSubmit}
        >
          {isEditing ? '更新' : '创建'}
        </Button>,
      ]}
      destroyOnClose
    >
      <Form
        form={form}
        layout="vertical"
        requiredMark={false}
        autoComplete="off"
      >
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="name"
              label="分类名称"
              rules={[
                { required: true, message: '请输入分类名称' },
                { max: 50, message: '分类名称不能超过50个字符' },
              ]}
            >
              <Input
                placeholder="请输入分类名称"
                onChange={handleNameChange}
                maxLength={50}
                showCount
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="slug"
              label={
                <Space>
                  分类别名
                  <Tooltip title="用于URL中的分类标识，只能包含字母、数字和连字符">
                    <InfoCircleOutlined />
                  </Tooltip>
                </Space>
              }
              rules={[
                { required: true, message: '请输入分类别名' },
                { 
                  pattern: /^[a-z0-9\-]+$/, 
                  message: '只能包含小写字母、数字和连字符' 
                },
                { max: 50, message: '分类别名不能超过50个字符' },
              ]}
            >
              <Input
                placeholder="请输入分类别名"
                maxLength={50}
                showCount
              />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          name="description"
          label="分类描述"
          rules={[
            { max: 200, message: '分类描述不能超过200个字符' },
          ]}
        >
          <TextArea
            placeholder="请输入分类描述（可选）"
            rows={3}
            maxLength={200}
            showCount
          />
        </Form.Item>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="icon"
              label={
                <Space>
                  分类图标
                  <Tooltip title="可以使用Ant Design图标名称或自定义图标">
                    <InfoCircleOutlined />
                  </Tooltip>
                </Space>
              }
            >
              <Input
                placeholder="如：FileTextOutlined"
                maxLength={50}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="sortOrder"
              label="排序权重"
              rules={[
                { required: true, message: '请输入排序权重' },
              ]}
            >
              <InputNumber
                placeholder="数值越大排序越靠前"
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
              name="color"
              label="分类颜色"
            >
              <Space direction="vertical" style={{ width: '100%' }}>
                <ColorPicker
                  value={previewColor}
                  onChange={handleColorChange}
                  showText
                  style={{ width: '100%' }}
                />
                <div>
                  <Text type="secondary" style={{ fontSize: '12px' }}>
                    预设颜色：
                  </Text>
                  <Space wrap style={{ marginTop: 4 }}>
                    {DEFAULT_CATEGORY_COLORS.map((color) => (
                      <div
                        key={color}
                        style={{
                          width: 20,
                          height: 20,
                          backgroundColor: color,
                          borderRadius: '50%',
                          cursor: 'pointer',
                          border: previewColor === color ? '2px solid #1890ff' : '1px solid #d9d9d9',
                        }}
                        onClick={() => handlePresetColorClick(color)}
                      />
                    ))}
                  </Space>
                </div>
              </Space>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="status"
              label="分类状态"
              rules={[
                { required: true, message: '请选择分类状态' },
              ]}
            >
              <Select placeholder="请选择分类状态">
                {CATEGORY_STATUS_OPTIONS.map((option) => (
                  <Option key={option.value} value={option.value}>
                    {option.label}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Divider />

        <div style={{ textAlign: 'center' }}>
          <Space>
            <div
              style={{
                width: 24,
                height: 24,
                backgroundColor: previewColor,
                borderRadius: '50%',
                display: 'inline-block',
                marginRight: 8,
                border: '1px solid #d9d9d9',
              }}
            />
            <Text type="secondary">颜色预览</Text>
          </Space>
        </div>
      </Form>
    </Modal>
  );
};

export default CategoryForm;