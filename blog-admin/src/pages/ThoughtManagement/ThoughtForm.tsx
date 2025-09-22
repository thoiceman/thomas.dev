import React, { useEffect, useState } from 'react';
import {
  Modal,
  Form,
  Input,
  Select,
  Switch,
  Upload,
  Button,
  message,
  Row,
  Col,
  Space,
  Divider,
  Typography,
  Card,
  Image,
  Tag,
} from 'antd';
import {
  UploadOutlined,
  DeleteOutlined,
  EyeOutlined,
  PlusOutlined,
  EnvironmentOutlined,
  CloudOutlined,
  HeartOutlined,
} from '@ant-design/icons';
import type { UploadFile, UploadProps } from 'antd/es/upload/interface';
import { useAppDispatch } from '../../hooks/redux';
import {
  createThought,
  updateThought,
  uploadThoughtImage,
} from '../../store/slices/thoughtSlice';
import type {
  Thought,
  ThoughtCreateRequest,
  ThoughtUpdateRequest,
} from '../../types/thought';
import {
  ThoughtStatus,
  MoodType,
  THOUGHT_STATUS_OPTIONS,
  MOOD_OPTIONS,
} from '../../types/thought';

const { TextArea } = Input;
const { Option } = Select;
const { Title } = Typography;

interface ThoughtFormProps {
  visible: boolean;
  onCancel: () => void;
  onSuccess: () => void;
  editingThought?: Thought | null;
  title?: string;
}

/**
 * 想法表单组件
 * 支持新增和编辑想法，包含内容、图片上传、心情选择、位置、天气等功能
 */
const ThoughtForm: React.FC<ThoughtFormProps> = ({
  visible,
  onCancel,
  onSuccess,
  editingThought,
  title,
}) => {
  const dispatch = useAppDispatch();
  const [form] = Form.useForm();

  // 组件状态
  const [loading, setLoading] = useState(false);
  const [imageFileList, setImageFileList] = useState<UploadFile[]>([]);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [previewTitle, setPreviewTitle] = useState('');

  // 是否为编辑模式
  const isEditing = !!editingThought;

  // 初始化表单数据
  useEffect(() => {
    if (visible) {
      if (isEditing && editingThought) {
        // 编辑模式：填充现有数据
        form.setFieldsValue({
          content: editingThought.content,
          mood: editingThought.mood,
          location: editingThought.location,
          weather: editingThought.weather,
          status: editingThought.status,
        });

        // 处理图片列表
        if (editingThought.images && editingThought.images.length > 0) {
          const fileList: UploadFile[] = editingThought.images.map((url, index) => ({
            uid: `existing-${index}`,
            name: `image-${index}`,
            status: 'done',
            url: url,
          }));
          setImageFileList(fileList);
        }
      } else {
        // 新增模式：重置表单
        form.resetFields();
        setImageFileList([]);
        // 设置默认值
        form.setFieldsValue({
          status: ThoughtStatus.PRIVATE, // 默认私密
        });
      }
    }
  }, [visible, isEditing, editingThought, form]);

  // 重置表单
  const resetForm = () => {
    form.resetFields();
    setImageFileList([]);
    setPreviewVisible(false);
    setPreviewImage('');
    setPreviewTitle('');
  };

  // 处理表单取消
  const handleCancel = () => {
    resetForm();
    onCancel();
  };

  // 图片上传前的处理
  const beforeUpload = (file: File) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/gif';
    if (!isJpgOrPng) {
      message.error('只能上传 JPG/PNG/GIF 格式的图片！');
      return false;
    }
    const isLt5M = file.size / 1024 / 1024 < 5;
    if (!isLt5M) {
      message.error('图片大小不能超过 5MB！');
      return false;
    }
    return true;
  };

  // 自定义图片上传
  const customUpload: UploadProps['customRequest'] = async ({ file, onSuccess, onError }) => {
    try {
      const imageUrl = await dispatch(uploadThoughtImage(file as File)).unwrap();
      onSuccess?.(imageUrl);
    } catch (error) {
      onError?.(error as Error);
    }
  };

  // 图片上传状态变化
  const handleImageChange: UploadProps['onChange'] = ({ fileList: newFileList }) => {
    setImageFileList(newFileList);
  };

  // 图片预览
  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as File);
    }

    setPreviewImage(file.url || (file.preview as string));
    setPreviewVisible(true);
    setPreviewTitle(file.name || file.url!.substring(file.url!.lastIndexOf('/') + 1));
  };

  // 获取文件的base64编码
  const getBase64 = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });

  // 移除图片
  const handleRemoveImage = (file: UploadFile) => {
    const newFileList = imageFileList.filter(item => item.uid !== file.uid);
    setImageFileList(newFileList);
  };

  // 提交表单
  const handleSubmit = async () => {
    try {
      setLoading(true);
      const values = await form.validateFields();

      // 处理图片URL列表
      const imageUrls: string[] = [];
      for (const file of imageFileList) {
        if (file.status === 'done') {
          if (file.response) {
            // 新上传的图片
            imageUrls.push(file.response);
          } else if (file.url) {
            // 已存在的图片
            imageUrls.push(file.url);
          }
        }
      }

      const requestData = {
        ...values,
        images: imageUrls.length > 0 ? imageUrls : undefined,
      };

      if (isEditing && editingThought) {
        // 更新想法
        await dispatch(updateThought({
          id: editingThought.id,
          data: requestData as ThoughtUpdateRequest,
        })).unwrap();
        message.success('想法更新成功！');
      } else {
        // 创建想法
        await dispatch(createThought(requestData as ThoughtCreateRequest)).unwrap();
        message.success('想法创建成功！');
      }

      resetForm();
      onSuccess();
    } catch (error) {
      console.error('提交表单失败:', error);
    } finally {
      setLoading(false);
    }
  };

  // 上传按钮
  const uploadButton = (
    <div>
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>上传图片</div>
    </div>
  );

  return (
    <>
      <Modal
        title={
          <Space>
            <HeartOutlined />
            {title || (isEditing ? '编辑想法' : '新增想法')}
          </Space>
        }
        open={visible}
        onCancel={handleCancel}
        onOk={handleSubmit}
        confirmLoading={loading}
        width={900}
        destroyOnClose
        okText={isEditing ? '更新' : '发布'}
        cancelText="取消"
        className="thought-form-modal"
      >
        <div style={{ maxHeight: '70vh', overflowY: 'auto', padding: '8px 0' }}>
          <Form
            form={form}
            layout="vertical"
            preserve={false}
          >
            {/* 想法内容 */}
            <Form.Item
              name="content"
              label={
                <Space>
                  <span>想法内容</span>
                  <span style={{ color: '#ff4d4f' }}>*</span>
                </Space>
              }
              rules={[
                { required: true, message: '请输入想法内容' },
                { min: 1, max: 1000, message: '内容长度应在1-1000字符之间' },
              ]}
            >
              <TextArea
                rows={6}
                placeholder="分享你的想法、感悟或心情..."
                showCount
                maxLength={1000}
                style={{ fontSize: '14px', lineHeight: '1.6' }}
              />
            </Form.Item>

            {/* 图片上传 */}
            <Form.Item
              label="图片"
              extra={
                <span style={{ color: '#666', fontSize: '12px' }}>
                  支持 JPG、PNG、GIF 格式，单张图片不超过 5MB，最多上传 9 张
                </span>
              }
            >
              <Upload
                listType="picture-card"
                fileList={imageFileList}
                onPreview={handlePreview}
                onChange={handleImageChange}
                onRemove={handleRemoveImage}
                beforeUpload={beforeUpload}
                customRequest={customUpload}
                multiple
                maxCount={9}
                className="thought-image-upload"
              >
                {imageFileList.length >= 9 ? null : uploadButton}
              </Upload>
            </Form.Item>

            <Row gutter={16}>
              {/* 心情选择 */}
              <Col xs={24} sm={12}>
                <Form.Item
                  name="mood"
                  label="当前心情"
                >
                  <Select
                    placeholder="选择你的心情"
                    allowClear
                    optionLabelProp="label"
                    size="large"
                  >
                    {MOOD_OPTIONS.map(option => (
                      <Option
                        key={option.value}
                        value={option.value}
                        label={option.label}
                      >
                        <Space>
                          <Tag color={option.color} style={{ margin: 0 }}>
                            {option.label}
                          </Tag>
                        </Space>
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>

              {/* 状态选择 */}
              <Col xs={24} sm={12}>
                <Form.Item
                  name="status"
                  label={
                    <Space>
                      <span>发布状态</span>
                      <span style={{ color: '#ff4d4f' }}>*</span>
                    </Space>
                  }
                  rules={[{ required: true, message: '请选择发布状态' }]}
                >
                  <Select placeholder="选择发布状态" size="large">
                    {THOUGHT_STATUS_OPTIONS.map(option => (
                      <Option key={option.value} value={option.value}>
                        <Space>
                          <span>{option.label}</span>
                          <span style={{ color: '#666', fontSize: '12px' }}>
                            {option.value === ThoughtStatus.PUBLIC ? '(所有人可见)' : '(仅自己可见)'}
                          </span>
                        </Space>
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              {/* 位置信息 */}
              <Col xs={24} sm={12}>
                <Form.Item
                  name="location"
                  label="位置信息"
                >
                  <Input
                    placeholder="你在哪里？"
                    prefix={<EnvironmentOutlined style={{ color: '#1890ff' }} />}
                    maxLength={100}
                    size="large"
                  />
                </Form.Item>
              </Col>

              {/* 天气信息 */}
              <Col xs={24} sm={12}>
                <Form.Item
                  name="weather"
                  label="天气情况"
                >
                  <Input
                    placeholder="今天天气如何？"
                    prefix={<CloudOutlined style={{ color: '#1890ff' }} />}
                    maxLength={50}
                    size="large"
                  />
                </Form.Item>
              </Col>
            </Row>

            {/* 编辑模式显示额外信息 */}
            {isEditing && editingThought && (
              <Card size="small" style={{ backgroundColor: '#f8f9fa', marginBottom: 16 }}>
                <Row gutter={16}>
                  <Col span={8}>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: '12px', color: '#666' }}>创建时间</div>
                      <div style={{ fontSize: '14px', fontWeight: 'bold' }}>
                        {new Date(editingThought.createTime).toLocaleDateString()}
                      </div>
                    </div>
                  </Col>
                  <Col span={8}>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: '12px', color: '#666' }}>更新时间</div>
                      <div style={{ fontSize: '14px', fontWeight: 'bold' }}>
                        {new Date(editingThought.updateTime).toLocaleDateString()}
                      </div>
                    </div>
                  </Col>
                  <Col span={8}>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: '12px', color: '#666' }}>想法ID</div>
                      <div style={{ fontSize: '14px', fontWeight: 'bold' }}>
                        #{editingThought.id}
                      </div>
                    </div>
                  </Col>
                </Row>
              </Card>
            )}

            {/* 表单提示 */}
            <Card size="small" style={{ backgroundColor: '#e6f7ff', border: '1px solid #91d5ff' }}>
              <Space direction="vertical" size="small" style={{ width: '100%' }}>
                <div style={{ fontSize: '14px', color: '#1890ff', fontWeight: 'bold' }}>
                  <HeartOutlined style={{ marginRight: 6 }} />
                  温馨提示
                </div>
                <div style={{ fontSize: '13px', color: '#1890ff', lineHeight: '1.5' }}>
                  <ul style={{ margin: 0, paddingLeft: 16 }}>
                    <li>想法内容支持换行，可以记录你的心情、感悟或日常生活</li>
                    <li>私密状态的想法只有你自己可以看到，公开状态所有人都能看到</li>
                    <li>位置和天气信息可以帮助你回忆当时的情境和心境</li>
                    <li>选择合适的心情标签，让想法更有意义和情感色彩</li>
                  </ul>
                </div>
              </Space>
            </Card>
          </Form>
        </div>
      </Modal>

      {/* 图片预览弹窗 */}
      <Modal
        open={previewVisible}
        title={previewTitle}
        footer={null}
        onCancel={() => setPreviewVisible(false)}
      >
        <img alt="preview" style={{ width: '100%' }} src={previewImage} />
      </Modal>
    </>
  );
};

export default ThoughtForm;