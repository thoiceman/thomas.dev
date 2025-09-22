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
  Card,
  Select,
  DatePicker,
  InputNumber,
  Rate,
  Upload,
  Image,
  Tag,
  Switch,
} from 'antd';
import type { UploadFile, UploadProps } from 'antd';
import {
  InfoCircleOutlined,
  ReloadOutlined,
  EnvironmentOutlined,
  CalendarOutlined,
  DollarOutlined,
  StarOutlined,
  CameraOutlined,
  PlusOutlined,
  DeleteOutlined,
  GlobalOutlined,
  CarOutlined,
  TeamOutlined,
  CloudOutlined,
  HomeOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';
import type {
  Travel,
  TravelCreateRequest,
  TravelUpdateRequest,
} from '../../types/travel';
import {
  TravelStatus,
  TravelRating,
  TransportationType,
  TRAVEL_STATUS_OPTIONS,
  TRAVEL_RATING_OPTIONS,
  TRANSPORTATION_OPTIONS,
} from '../../types/travel';

const { TextArea } = Input;
const { Text } = Typography;
const { RangePicker } = DatePicker;
const { Option } = Select;

// 组件属性接口
interface TravelFormProps {
  /** 是否显示弹窗 */
  visible: boolean;
  /** 关闭弹窗回调 */
  onCancel: () => void;
  /** 提交成功回调 */
  onSuccess?: () => void;
  /** 编辑的旅行记录数据（新增时为null） */
  editingTravel?: Travel | null;
  /** 弹窗标题 */
  title?: string;
}

// 表单数据接口
interface FormData {
  title: string;
  destination: string;
  country?: string;
  city?: string;
  description?: string;
  content?: string;
  dateRange: [dayjs.Dayjs, dayjs.Dayjs];
  budget?: number;
  companions?: string;
  transportation?: TransportationType;
  accommodation?: string;
  highlights?: string[];
  weather?: string;
  rating?: TravelRating;
  status: TravelStatus;
  latitude?: number;
  longitude?: number;
}

/**
 * 旅行记录表单组件
 * 支持新增和编辑旅行记录功能
 */
const TravelForm: React.FC<TravelFormProps> = ({
  visible,
  onCancel,
  onSuccess,
  editingTravel,
  title,
}) => {
  const [form] = Form.useForm<FormData>();
  const [loading, setLoading] = useState(false);
  const [coverImageList, setCoverImageList] = useState<UploadFile[]>([]);
  const [imageList, setImageList] = useState<UploadFile[]>([]);
  const [highlightInput, setHighlightInput] = useState('');
  const [highlights, setHighlights] = useState<string[]>([]);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState('');

  // 是否为编辑模式
  const isEditing = !!editingTravel;
  
  // 弹窗标题
  const modalTitle = title || (isEditing ? '编辑旅行记录' : '新增旅行记录');

  // 监听编辑数据变化，初始化表单
  useEffect(() => {
    if (visible) {
      if (isEditing && editingTravel) {
        // 编辑模式：填充现有数据
        const formData: FormData = {
          title: editingTravel.title,
          destination: editingTravel.destination,
          country: editingTravel.country,
          city: editingTravel.city,
          description: editingTravel.description,
          content: editingTravel.content,
          dateRange: [
            dayjs(editingTravel.startDate),
            dayjs(editingTravel.endDate)
          ],
          budget: editingTravel.budget,
          companions: editingTravel.companions,
          transportation: editingTravel.transportation,
          accommodation: editingTravel.accommodation,
          weather: editingTravel.weather,
          rating: editingTravel.rating,
          status: editingTravel.status,
          latitude: editingTravel.latitude,
          longitude: editingTravel.longitude,
        };
        form.setFieldsValue(formData);
        setHighlights(editingTravel.highlights || []);
        
        // 设置图片列表
        if (editingTravel.coverImage) {
          setCoverImageList([{
            uid: '-1',
            name: 'cover.jpg',
            status: 'done',
            url: editingTravel.coverImage,
          }]);
        }
        
        if (editingTravel.images && editingTravel.images.length > 0) {
          setImageList(editingTravel.images.map((url, index) => ({
            uid: `-${index + 2}`,
            name: `image-${index + 1}.jpg`,
            status: 'done',
            url,
          })));
        }
      } else {
        // 新增模式：重置表单
        form.resetFields();
        setHighlights([]);
        setCoverImageList([]);
        setImageList([]);
        setHighlightInput('');
      }
    }
  }, [visible, isEditing, editingTravel, form]);

  // 处理表单提交
  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);

      // 构建提交数据
      const submitData: any = {
        ...values,
        startDate: values.dateRange[0].format('YYYY-MM-DD'),
        endDate: values.dateRange[1].format('YYYY-MM-DD'),
        duration: values.dateRange[1].diff(values.dateRange[0], 'day') + 1,
        highlights,
        coverImage: coverImageList[0]?.url || coverImageList[0]?.response?.url,
        images: imageList.map(file => file.url || file.response?.url).filter(Boolean),
      };

      // 移除dateRange字段
      const { dateRange, ...finalData } = submitData;

      if (isEditing && editingTravel) {
        // 编辑模式
        const updateData: TravelUpdateRequest = finalData;
        // TODO: 调用更新API
        console.log('更新旅行记录:', updateData);
        message.success('旅行记录更新成功');
      } else {
        // 新增模式
        const createData: TravelCreateRequest = finalData;
        // TODO: 调用创建API
        console.log('创建旅行记录:', createData);
        message.success('旅行记录创建成功');
      }

      onSuccess?.();
      handleCancel();
    } catch (error) {
      console.error('表单验证失败:', error);
      message.error('请检查表单填写是否正确');
    } finally {
      setLoading(false);
    }
  };

  // 处理取消
  const handleCancel = () => {
    form.resetFields();
    setHighlights([]);
    setCoverImageList([]);
    setImageList([]);
    setHighlightInput('');
    onCancel();
  };

  // 处理重置
  const handleReset = () => {
    form.resetFields();
    setHighlights([]);
    setCoverImageList([]);
    setImageList([]);
    setHighlightInput('');
  };

  // 处理封面图片上传
  const handleCoverImageChange: UploadProps['onChange'] = ({ fileList }) => {
    setCoverImageList(fileList.slice(-1)); // 只保留最后一张图片
  };

  // 处理相册图片上传
  const handleImageChange: UploadProps['onChange'] = ({ fileList }) => {
    setImageList(fileList);
  };

  // 处理图片预览
  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as File);
    }
    setPreviewImage(file.url || (file.preview as string));
    setPreviewVisible(true);
  };

  // 获取图片base64
  const getBase64 = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });

  // 添加亮点
  const handleAddHighlight = () => {
    if (highlightInput.trim() && !highlights.includes(highlightInput.trim())) {
      setHighlights([...highlights, highlightInput.trim()]);
      setHighlightInput('');
    }
  };

  // 删除亮点
  const handleRemoveHighlight = (highlight: string) => {
    setHighlights(highlights.filter(h => h !== highlight));
  };

  // 上传按钮
  const uploadButton = (
    <div>
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>上传图片</div>
    </div>
  );

  return (
    <Modal
      title={
        <Space>
          <EnvironmentOutlined />
          {modalTitle}
        </Space>
      }
      open={visible}
      onCancel={handleCancel}
      width={900}
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
      <div style={{ maxHeight: '70vh', overflowY: 'auto', paddingRight: '8px' }}>
        <Form
          form={form}
          layout="vertical"
          initialValues={{
            status: TravelStatus.PRIVATE,
            rating: 5,
          }}
        >
          {/* 基本信息 */}
          <Divider orientation="left">
            <Space>
              <InfoCircleOutlined />
              基本信息
            </Space>
          </Divider>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="title"
                label="旅行标题"
                rules={[
                  { required: true, message: '请输入旅行标题' },
                  { min: 1, max: 100, message: '标题长度为1-100个字符' },
                ]}
              >
                <Input
                  placeholder="请输入旅行标题"
                  prefix={<EnvironmentOutlined />}
                  maxLength={100}
                  showCount
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="destination"
                label="目的地"
                rules={[
                  { required: true, message: '请输入目的地' },
                  { min: 1, max: 50, message: '目的地长度为1-50个字符' },
                ]}
              >
                <Input
                  placeholder="请输入目的地"
                  prefix={<GlobalOutlined />}
                  maxLength={50}
                  showCount
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                name="country"
                label="国家"
              >
                <Input
                  placeholder="请输入国家"
                  maxLength={30}
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="city"
                label="城市"
              >
                <Input
                  placeholder="请输入城市"
                  maxLength={30}
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="status"
                label="状态"
                rules={[{ required: true, message: '请选择状态' }]}
              >
                <Select placeholder="请选择状态">
                  {TRAVEL_STATUS_OPTIONS.map(option => (
                    <Option key={option.value} value={option.value}>
                      {option.label}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="description"
            label="旅行描述"
          >
            <TextArea
              placeholder="请输入旅行描述"
              rows={3}
              maxLength={500}
              showCount
            />
          </Form.Item>

          {/* 时间和预算 */}
          <Divider orientation="left">
            <Space>
              <CalendarOutlined />
              时间和预算
            </Space>
          </Divider>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="dateRange"
                label="旅行日期"
                rules={[{ required: true, message: '请选择旅行日期' }]}
              >
                <RangePicker
                  style={{ width: '100%' }}
                  placeholder={['开始日期', '结束日期']}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="budget"
                label={
                  <Space>
                    <DollarOutlined />
                    预算（元）
                  </Space>
                }
              >
                <InputNumber
                  placeholder="请输入预算"
                  style={{ width: '100%' }}
                  min={0}
                  max={999999}
                />
              </Form.Item>
            </Col>
          </Row>

          {/* 旅行详情 */}
          <Divider orientation="left">
            <Space>
              <CarOutlined />
              旅行详情
            </Space>
          </Divider>

          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                name="companions"
                label={
                  <Space>
                    <TeamOutlined />
                    同行人员
                  </Space>
                }
              >
                <Input
                  placeholder="如：朋友、家人、独自"
                  maxLength={50}
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="transportation"
                label="交通方式"
              >
                <Select placeholder="请选择交通方式" allowClear>
                  {TRANSPORTATION_OPTIONS.map(option => (
                    <Option key={option.value} value={option.value}>
                      <Space>
                        <span>{option.icon}</span>
                        {option.label}
                      </Space>
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="accommodation"
                label={
                  <Space>
                    <HomeOutlined />
                    住宿类型
                  </Space>
                }
              >
                <Input
                  placeholder="如：酒店、民宿、青旅"
                  maxLength={50}
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="weather"
                label={
                  <Space>
                    <CloudOutlined />
                    天气情况
                  </Space>
                }
              >
                <Input
                  placeholder="如：晴朗、多云、雨天"
                  maxLength={50}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="rating"
                label={
                  <Space>
                    <StarOutlined />
                    旅行评分
                  </Space>
                }
              >
                <Rate allowHalf />
              </Form.Item>
            </Col>
          </Row>

          {/* 旅行亮点 */}
          <Form.Item
            label="旅行亮点"
          >
            <Space.Compact style={{ display: 'flex', marginBottom: 8 }}>
              <Input
                placeholder="输入旅行亮点，如景点、美食等"
                value={highlightInput}
                onChange={(e) => setHighlightInput(e.target.value)}
                onPressEnter={handleAddHighlight}
                maxLength={30}
              />
              <Button type="primary" onClick={handleAddHighlight}>
                添加
              </Button>
            </Space.Compact>
            <div>
              {highlights.map((highlight, index) => (
                <Tag
                  key={index}
                  closable
                  onClose={() => handleRemoveHighlight(highlight)}
                  style={{ marginBottom: 4 }}
                >
                  {highlight}
                </Tag>
              ))}
            </div>
          </Form.Item>

          {/* 位置信息 */}
          <Divider orientation="left">
            <Space>
              <GlobalOutlined />
              位置信息
            </Space>
          </Divider>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="latitude"
                label="纬度"
              >
                <InputNumber
                  placeholder="请输入纬度"
                  style={{ width: '100%' }}
                  min={-90}
                  max={90}
                  step={0.000001}
                  precision={6}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="longitude"
                label="经度"
              >
                <InputNumber
                  placeholder="请输入经度"
                  style={{ width: '100%' }}
                  min={-180}
                  max={180}
                  step={0.000001}
                  precision={6}
                />
              </Form.Item>
            </Col>
          </Row>

          {/* 图片上传 */}
          <Divider orientation="left">
            <Space>
              <CameraOutlined />
              图片上传
            </Space>
          </Divider>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="封面图片">
                <Upload
                  listType="picture-card"
                  fileList={coverImageList}
                  onChange={handleCoverImageChange}
                  onPreview={handlePreview}
                  beforeUpload={() => false} // 阻止自动上传
                  maxCount={1}
                >
                  {coverImageList.length >= 1 ? null : uploadButton}
                </Upload>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="相册图片">
                <Upload
                  listType="picture-card"
                  fileList={imageList}
                  onChange={handleImageChange}
                  onPreview={handlePreview}
                  beforeUpload={() => false} // 阻止自动上传
                  multiple
                >
                  {imageList.length >= 8 ? null : uploadButton}
                </Upload>
              </Form.Item>
            </Col>
          </Row>

          {/* 详细内容 */}
          <Divider orientation="left">详细内容</Divider>

          <Form.Item
            name="content"
            label="旅行游记"
          >
            <TextArea
              placeholder="请输入详细的旅行游记内容"
              rows={6}
              maxLength={5000}
              showCount
            />
          </Form.Item>

          {/* 编辑模式显示额外信息 */}
          {isEditing && editingTravel && (
            <>
              <Divider orientation="left">记录信息</Divider>
              <Row gutter={16}>
                <Col span={8}>
                  <Card size="small">
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: '12px', color: '#666' }}>
                        记录ID
                      </div>
                      <div style={{ fontSize: '16px', fontWeight: 'bold' }}>
                        #{editingTravel.id}
                      </div>
                    </div>
                  </Card>
                </Col>
                <Col span={8}>
                  <Card size="small">
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: '12px', color: '#666' }}>
                        创建时间
                      </div>
                      <div style={{ fontSize: '14px' }}>
                        {dayjs(editingTravel.createTime).format('YYYY-MM-DD HH:mm')}
                      </div>
                    </div>
                  </Card>
                </Col>
                <Col span={8}>
                  <Card size="small">
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: '12px', color: '#666' }}>
                        更新时间
                      </div>
                      <div style={{ fontSize: '14px' }}>
                        {dayjs(editingTravel.updateTime).format('YYYY-MM-DD HH:mm')}
                      </div>
                    </div>
                  </Card>
                </Col>
              </Row>
            </>
          )}
        </Form>
      </div>

      {/* 图片预览弹窗 */}
      <Modal
        open={previewVisible}
        title="图片预览"
        footer={null}
        onCancel={() => setPreviewVisible(false)}
      >
        <img alt="preview" style={{ width: '100%' }} src={previewImage} />
      </Modal>
    </Modal>
  );
};

export default TravelForm;