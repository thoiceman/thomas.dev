import React, { useEffect, useState } from 'react';
import {
  Modal,
  Form,
  Input,
  Select,
  InputNumber,
  Switch,
  Upload,
  Button,
  message,
  Row,
  Col,
  Space,
  Divider,
  Avatar,
  Typography,
} from 'antd';
import {
  UploadOutlined,
  LinkOutlined,
  CodeOutlined,
  CheckOutlined,
  CloseOutlined,
} from '@ant-design/icons';
import type { UploadFile, UploadProps } from 'antd/es/upload/interface';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import {
  createTechStack,
  updateTechStack,
} from '../../store/slices/techStackSlice';
import { checkTechStackNameAvailable } from '../../api/techStack';
import type {
  TechStack,
  TechStackCreateRequest,
  TechStackUpdateRequest,
} from '../../types/techStack';
import {
  TechStackStatus,
  TechStackCategory,
  TECH_STACK_STATUS_OPTIONS,
  TECH_STACK_CATEGORY_OPTIONS,
} from '../../types/techStack';

const { Option } = Select;
const { TextArea } = Input;
const { Title } = Typography;

interface TechStackFormProps {
  visible: boolean;
  onCancel: () => void;
  onSuccess: () => void;
  editingTechStack?: TechStack | null;
}

const TechStackForm: React.FC<TechStackFormProps> = ({
  visible,
  onCancel,
  onSuccess,
  editingTechStack,
}) => {
  const dispatch = useAppDispatch();
  const { loading } = useAppSelector(state => state.techStack);
  
  const [form] = Form.useForm();
  const [iconFileList, setIconFileList] = useState<UploadFile[]>([]);
  const [previewIcon, setPreviewIcon] = useState<string>('');
  const [nameCheckLoading, setNameCheckLoading] = useState(false);

  const isEditing = !!editingTechStack;

  // 初始化表单数据
  useEffect(() => {
    if (visible) {
      if (isEditing && editingTechStack) {
        // 编辑模式：填充现有数据
        form.setFieldsValue({
          name: editingTechStack.name,
          description: editingTechStack.description,
          category: editingTechStack.category,
          officialUrl: editingTechStack.officialUrl,
          sortOrder: editingTechStack.sortOrder,
          status: editingTechStack.status,
        });
        setPreviewIcon(editingTechStack.icon || '');
        setIconFileList([]);
      } else {
        // 新增模式：设置默认值
        form.setFieldsValue({
          status: TechStackStatus.VISIBLE,
          sortOrder: 0,
          category: TechStackCategory.FRONTEND,
        });
        setPreviewIcon('');
        setIconFileList([]);
      }
    }
  }, [visible, isEditing, editingTechStack, form]);

  // 重置表单
  const resetForm = () => {
    form.resetFields();
    setIconFileList([]);
    setPreviewIcon('');
  };

  // 处理取消
  const handleCancel = () => {
    resetForm();
    onCancel();
  };

  // 检查技术栈名称是否存在
  const checkNameExists = async (name: string) => {
    if (!name || (isEditing && name === editingTechStack?.name)) {
      return Promise.resolve();
    }

    setNameCheckLoading(true);
    try {
      const isAvailable = await checkTechStackNameAvailable(name, isEditing ? editingTechStack?.id : undefined);
      if (!isAvailable) {
        return Promise.reject(new Error('技术栈名称已存在'));
      }
    } catch (error) {
      return Promise.reject(new Error('检查名称失败'));
    } finally {
      setNameCheckLoading(false);
    }
  };

  // 图标上传配置
  const uploadProps: UploadProps = {
    name: 'file',
    listType: 'picture',
    maxCount: 1,
    beforeUpload: (file) => {
      const isImage = file.type.startsWith('image/');
      if (!isImage) {
        message.error('只能上传图片文件！');
        return false;
      }
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        message.error('图片大小不能超过 2MB！');
        return false;
      }

      // 预览图片
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewIcon(e.target?.result as string);
      };
      reader.readAsDataURL(file);

      return false; // 阻止自动上传
    },
    onRemove: () => {
      setPreviewIcon('');
      setIconFileList([]);
    },
    fileList: iconFileList,
    onChange: ({ fileList }) => {
      setIconFileList(fileList);
    },
  };

  // 提交表单
  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      
      // 处理图标上传
      let iconUrl = previewIcon;
      if (iconFileList.length > 0 && iconFileList[0].originFileObj) {
        // 这里应该调用实际的文件上传接口
        // 暂时使用预览图片作为图标URL
        iconUrl = previewIcon;
      }

      const requestData = {
        ...values,
        icon: iconUrl,
      };

      if (isEditing && editingTechStack) {
        // 更新技术栈
        await dispatch(updateTechStack({
          id: editingTechStack.id,
          ...requestData,
        } as TechStackUpdateRequest)).unwrap();
        message.success('技术栈更新成功！');
      } else {
        // 创建技术栈
        await dispatch(createTechStack(requestData as TechStackCreateRequest)).unwrap();
        message.success('技术栈创建成功！');
      }

      resetForm();
      onSuccess();
    } catch (error) {
      console.error('提交表单失败:', error);
    }
  };

  return (
    <Modal
      title={
        <div className="flex items-center space-x-2">
          <CodeOutlined className="text-blue-500" />
          <span>{isEditing ? '编辑技术栈' : '新增技术栈'}</span>
        </div>
      }
      open={visible}
      onCancel={handleCancel}
      footer={[
        <Button key="cancel" onClick={handleCancel}>
          取消
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
      width={800}
      destroyOnClose
    >
      <Form
        form={form}
        layout="vertical"
        className="tech-stack-form"
      >
        <Row gutter={16}>
          {/* 左侧：基本信息 */}
          <Col span={14}>
            <Form.Item
              name="name"
              label="技术栈名称"
              rules={[
                { required: true, message: '请输入技术栈名称' },
                { min: 2, max: 50, message: '名称长度应在2-50个字符之间' },
                { validator: (_, value) => checkNameExists(value) },
              ]}
              hasFeedback
              validateStatus={nameCheckLoading ? 'validating' : undefined}
            >
              <Input
                placeholder="请输入技术栈名称"
                prefix={<CodeOutlined />}
              />
            </Form.Item>

            <Form.Item
              name="description"
              label="描述"
              rules={[
                { max: 500, message: '描述长度不能超过500个字符' },
              ]}
            >
              <TextArea
                placeholder="请输入技术栈描述"
                rows={3}
                showCount
                maxLength={500}
              />
            </Form.Item>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="category"
                  label="分类"
                  rules={[
                    { required: true, message: '请选择技术栈分类' },
                  ]}
                >
                  <Select placeholder="请选择分类">
                    {TECH_STACK_CATEGORY_OPTIONS.map(option => (
                      <Option key={option.value} value={option.value}>
                        {option.label}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="status"
                  label="状态"
                  rules={[
                    { required: true, message: '请选择状态' },
                  ]}
                >
                  <Select placeholder="请选择状态">
                    {TECH_STACK_STATUS_OPTIONS.map(option => (
                      <Option key={option.value} value={option.value}>
                        {option.label}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
            </Row>

            <Form.Item
              name="officialUrl"
              label="官方网站"
              rules={[
                { type: 'url', message: '请输入有效的URL地址' },
              ]}
            >
              <Input
                placeholder="请输入官方网站URL"
                prefix={<LinkOutlined />}
              />
            </Form.Item>

            <Form.Item
              name="sortOrder"
              label="排序权重"
              rules={[
                { required: true, message: '请输入排序权重' },
                { type: 'number', min: 0, max: 9999, message: '排序权重应在0-9999之间' },
              ]}
              tooltip="数值越大排序越靠前"
            >
              <InputNumber
                placeholder="请输入排序权重"
                min={0}
                max={9999}
                style={{ width: '100%' }}
              />
            </Form.Item>
          </Col>

          {/* 右侧：图标上传和预览 */}
          <Col span={10}>
            <div className="text-center">
              <Title level={5}>技术栈图标</Title>
              
              {/* 图标预览 */}
              <div className="mb-4">
                <Avatar
                  src={previewIcon}
                  icon={<CodeOutlined />}
                  size={80}
                  className="border-2 border-dashed border-gray-300"
                />
              </div>

              {/* 图标上传 */}
              <Form.Item
                name="icon"
                label=""
                className="mb-2"
              >
                <Upload {...uploadProps}>
                  <Button icon={<UploadOutlined />} size="small">
                    {iconFileList.length > 0 ? '重新上传' : '上传图标'}
                  </Button>
                </Upload>
              </Form.Item>

              <div className="text-xs text-gray-500">
                <p>支持 JPG、PNG 格式</p>
                <p>建议尺寸：64x64px</p>
                <p>文件大小不超过 2MB</p>
              </div>
            </div>
          </Col>
        </Row>

        <Divider />

        {/* 表单提示信息 */}
        <div className="bg-blue-50 p-3 rounded-md">
          <div className="text-sm text-blue-600">
            <strong>填写提示：</strong>
            <ul className="mt-1 ml-4 list-disc">
              <li>技术栈名称必须唯一，系统会自动检查重复</li>
              <li>分类用于在前端页面中进行技术栈分组展示</li>
              <li>排序权重决定技术栈在列表中的显示顺序</li>
              <li>官方网站URL将在前端页面中提供跳转链接</li>
              <li>图标建议使用技术栈的官方Logo或标识</li>
            </ul>
          </div>
        </div>
      </Form>
    </Modal>
  );
};

export default TechStackForm;