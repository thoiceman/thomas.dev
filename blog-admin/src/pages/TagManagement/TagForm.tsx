import React, { useEffect, useState } from 'react';
import {
  Modal,
  Form,
  Input,
  ColorPicker,
  Button,
  Space,
  message,
  Row,
  Col,
  Typography,
  Divider,
  Tooltip,
  Tag as AntTag,
  Card,
} from 'antd';
import {
  InfoCircleOutlined,
  EyeOutlined,
  ReloadOutlined,
  TagOutlined,
} from '@ant-design/icons';
import { useAppDispatch } from '../../hooks/redux';
import {
  createTag,
  updateTag,
} from '../../store/slices/tagSlice';
import type {
  Tag,
  TagCreateRequest,
  TagUpdateRequest,
} from '../../types/tag';
import {
  DEFAULT_TAG_COLORS,
  TAG_COLOR_PRESETS,
} from '../../types/tag';

const { TextArea } = Input;
const { Text } = Typography;

// 组件属性接口
interface TagFormProps {
  /** 是否显示弹窗 */
  visible: boolean;
  /** 关闭弹窗回调 */
  onCancel: () => void;
  /** 提交成功回调 */
  onSuccess?: () => void;
  /** 编辑的标签数据（新增时为null） */
  editingTag?: Tag | null;
  /** 弹窗标题 */
  title?: string;
}

// 表单数据接口
interface FormData {
  name: string;
  slug: string;
  color?: string;
}

/**
 * 标签表单组件
 * 支持新增和编辑标签功能
 */
const TagForm: React.FC<TagFormProps> = ({
  visible,
  onCancel,
  onSuccess,
  editingTag,
  title,
}) => {
  const dispatch = useAppDispatch();
  const [form] = Form.useForm<FormData>();
  const [loading, setLoading] = useState(false);
  const [previewColor, setPreviewColor] = useState<string>(DEFAULT_TAG_COLORS[0]);

  // 是否为编辑模式
  const isEditing = !!editingTag;
  
  // 弹窗标题
  const modalTitle = title || (isEditing ? '编辑标签' : '新增标签');

  // 监听编辑数据变化，初始化表单
  useEffect(() => {
    if (visible) {
      if (isEditing && editingTag) {
        // 编辑模式：填充现有数据
        const formData: FormData = {
          name: editingTag.name,
          slug: editingTag.slug,
          color: editingTag.color || DEFAULT_TAG_COLORS[0],
        };
        form.setFieldsValue(formData);
        setPreviewColor(editingTag.color || DEFAULT_TAG_COLORS[0]);
      } else {
        // 新增模式：重置表单
        form.resetFields();
        setPreviewColor(DEFAULT_TAG_COLORS[0]);
      }
    }
  }, [visible, isEditing, editingTag, form]);

  // 生成标签别名
  const generateSlug = (name: string): string => {
    return name
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')
      .replace(/[^\w\-]/g, '')
      .replace(/--+/g, '-')
      .replace(/^-|-$/g, '');
  };

  // 标签名称变化时自动生成别名
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    if (name && !isEditing) {
      const slug = generateSlug(name);
      form.setFieldValue('slug', slug);
    }
  };

  // 颜色变化处理
  const handleColorChange = (color: any) => {
    const colorValue = typeof color === 'string' ? color : color.toHexString();
    setPreviewColor(colorValue);
    form.setFieldValue('color', colorValue);
  };

  // 选择预设颜色
  const handlePresetColorSelect = (color: string) => {
    setPreviewColor(color);
    form.setFieldValue('color', color);
  };

  // 表单提交
  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);

      if (isEditing && editingTag) {
        // 编辑标签
        const updateData: TagUpdateRequest = {
          name: values.name,
          slug: values.slug,
          color: values.color,
        };
        
        await dispatch(updateTag({ 
          id: editingTag.id, 
          data: updateData 
        })).unwrap();
        
        message.success('标签更新成功');
      } else {
        // 新增标签
        const createData: TagCreateRequest = {
          name: values.name,
          slug: values.slug,
          color: values.color,
        };
        
        await dispatch(createTag(createData)).unwrap();
        message.success('标签创建成功');
      }

      // 成功后关闭弹窗并回调
      handleCancel();
      onSuccess?.();
    } catch (error: any) {
      message.error(error || `标签${isEditing ? '更新' : '创建'}失败`);
    } finally {
      setLoading(false);
    }
  };

  // 取消操作
  const handleCancel = () => {
    form.resetFields();
    setPreviewColor(DEFAULT_TAG_COLORS[0]);
    onCancel();
  };

  // 重置表单
  const handleReset = () => {
    if (isEditing && editingTag) {
      const formData: FormData = {
        name: editingTag.name,
        slug: editingTag.slug,
        color: editingTag.color || DEFAULT_TAG_COLORS[0],
      };
      form.setFieldsValue(formData);
      setPreviewColor(editingTag.color || DEFAULT_TAG_COLORS[0]);
    } else {
      form.resetFields();
      setPreviewColor(DEFAULT_TAG_COLORS[0]);
    }
  };

  return (
    <Modal
      title={
        <Space>
          <TagOutlined />
          {modalTitle}
        </Space>
      }
      open={visible}
      onCancel={handleCancel}
      width={600}
      footer={[
        <Button key="cancel" onClick={handleCancel}>
          取消
        </Button>,
        <Button key="reset" onClick={handleReset}>
          <ReloadOutlined />
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
        initialValues={{
          color: DEFAULT_TAG_COLORS[0],
        }}
      >
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="name"
              label="标签名称"
              rules={[
                { required: true, message: '请输入标签名称' },
                { min: 1, max: 50, message: '标签名称长度为1-50个字符' },
              ]}
            >
              <Input
                placeholder="请输入标签名称"
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
                  标签别名
                  <Tooltip title="用于URL中的标签标识，只能包含字母、数字和连字符">
                    <InfoCircleOutlined style={{ color: '#999' }} />
                  </Tooltip>
                </Space>
              }
              rules={[
                { required: true, message: '请输入标签别名' },
                { 
                  pattern: /^[a-z0-9-]+$/, 
                  message: '别名只能包含小写字母、数字和连字符' 
                },
                { min: 1, max: 50, message: '别名长度为1-50个字符' },
              ]}
            >
              <Input
                placeholder="请输入标签别名"
                maxLength={50}
                showCount
              />
            </Form.Item>
          </Col>
        </Row>

        <Divider orientation="left">标签样式</Divider>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="color"
              label="标签颜色"
            >
              <Space direction="vertical" style={{ width: '100%' }}>
                <ColorPicker
                  value={previewColor}
                  onChange={handleColorChange}
                  showText
                  size="large"
                  style={{ width: '100%' }}
                />
                
                {/* 预设颜色选择 */}
                <div>
                  <Text type="secondary" style={{ fontSize: '12px' }}>
                    预设颜色：
                  </Text>
                  <div style={{ marginTop: 8 }}>
                    <Space wrap>
                      {TAG_COLOR_PRESETS.map((preset) => (
                        <Tooltip key={preset.value} title={preset.label}>
                          <div
                            style={{
                              width: 24,
                              height: 24,
                              backgroundColor: preset.value,
                              borderRadius: '50%',
                              cursor: 'pointer',
                              border: previewColor === preset.value 
                                ? '2px solid #1890ff' 
                                : '1px solid #d9d9d9',
                              display: 'inline-block',
                            }}
                            onClick={() => handlePresetColorSelect(preset.value)}
                          />
                        </Tooltip>
                      ))}
                    </Space>
                  </div>
                </div>
              </Space>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="预览效果">
              <Card size="small" style={{ textAlign: 'center' }}>
                <AntTag 
                  color={previewColor}
                  style={{ fontSize: '14px', padding: '4px 8px' }}
                >
                  <TagOutlined style={{ marginRight: 4 }} />
                  {form.getFieldValue('name') || '标签预览'}
                </AntTag>
              </Card>
            </Form.Item>
          </Col>
        </Row>

        {/* 编辑模式显示额外信息 */}
        {isEditing && editingTag && (
          <>
            <Divider orientation="left">标签信息</Divider>
            <Row gutter={16}>
              <Col span={8}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#1890ff' }}>
                    {editingTag.useCount}
                  </div>
                  <div style={{ color: '#666', fontSize: '12px' }}>使用次数</div>
                </div>
              </Col>
              <Col span={8}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '12px', color: '#666' }}>
                    创建时间
                  </div>
                  <div style={{ fontSize: '14px' }}>
                    {new Date(editingTag.createTime).toLocaleDateString()}
                  </div>
                </div>
              </Col>
              <Col span={8}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '12px', color: '#666' }}>
                    更新时间
                  </div>
                  <div style={{ fontSize: '14px' }}>
                    {new Date(editingTag.updateTime).toLocaleDateString()}
                  </div>
                </div>
              </Col>
            </Row>
          </>
        )}
      </Form>
    </Modal>
  );
};

export default TagForm;