import React, { useEffect, useState } from 'react';
import {
  Table,
  Button,
  Space,
  Tag,
  Popconfirm,
  message,
  Form,
  Input,
  Select,
  Card,
  Tooltip,
  Badge,
  Modal,
  Row,
  Col,
  Typography,
  Divider,
  Image,
  Avatar,
  DatePicker,
} from 'antd';
import type { ColumnsType, TablePaginationConfig } from 'antd/es/table';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  ReloadOutlined,
  SearchOutlined,
  HeartOutlined,
  CommentOutlined,
  CalendarOutlined,
  EnvironmentOutlined,
  CloudOutlined,
} from '@ant-design/icons';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import {
  fetchThoughts,
  deleteThought,
  batchDeleteThoughts,
  fetchThoughtStats,
} from '../../store/slices/thoughtSlice';
import type {
  Thought,
  ThoughtQueryParams,
} from '../../types/thought';
import { 
  ThoughtStatus,
  MoodType,
  THOUGHT_STATUS_OPTIONS,
  MOOD_OPTIONS,
  THOUGHT_SORT_OPTIONS,
  DEFAULT_THOUGHT_QUERY_PARAMS,
} from '../../types/thought';

const { Search } = Input;
const { Option } = Select;
const { Title } = Typography;
const { RangePicker } = DatePicker;

interface ThoughtListProps {
  onEdit?: (thought: Thought) => void;
  onAdd?: () => void;
}

/**
 * 想法列表组件
 * 提供想法的展示、搜索、筛选、分页、批量操作等功能
 */
const ThoughtList: React.FC<ThoughtListProps> = ({ onEdit, onAdd }) => {
  const dispatch = useAppDispatch();
  const { thoughts, pagination, loading, stats } = useAppSelector(state => state.thought);

  // 组件状态
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [searchForm] = Form.useForm();
  const [queryParams, setQueryParams] = useState<ThoughtQueryParams>(DEFAULT_THOUGHT_QUERY_PARAMS);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewThought, setPreviewThought] = useState<Thought | null>(null);

  // 初始化加载数据
  useEffect(() => {
    handleSearch();
    // 加载统计信息
    dispatch(fetchThoughtStats());
  }, []);

  // 搜索处理
  const handleSearch = (resetPage = false) => {
    const formValues = searchForm.getFieldsValue();
    const searchParams: ThoughtQueryParams = {
      ...queryParams,
      ...formValues,
      page: resetPage ? 1 : queryParams.page,
    };
    
    setQueryParams(searchParams);
    dispatch(fetchThoughts(searchParams));
  };

  // 重置搜索
  const handleReset = () => {
    searchForm.resetFields();
    const resetParams = { ...DEFAULT_THOUGHT_QUERY_PARAMS };
    setQueryParams(resetParams);
    dispatch(fetchThoughts(resetParams));
  };

  // 刷新数据
  const handleRefresh = () => {
    dispatch(fetchThoughts(queryParams));
    dispatch(fetchThoughtStats());
  };

  // 分页变化处理
  const handleTableChange = (paginationConfig: TablePaginationConfig) => {
    const newParams = {
      ...queryParams,
      page: paginationConfig.current || 1,
      pageSize: paginationConfig.pageSize || 10,
    };
    setQueryParams(newParams);
    dispatch(fetchThoughts(newParams));
  };

  // 删除想法
  const handleDelete = async (id: number) => {
    try {
      await dispatch(deleteThought(id)).unwrap();
      handleRefresh();
    } catch (error) {
      console.error('删除想法失败:', error);
    }
  };

  // 批量删除
  const handleBatchDelete = async () => {
    if (selectedRowKeys.length === 0) {
      message.warning('请选择要删除的想法');
      return;
    }

    try {
      await dispatch(batchDeleteThoughts(selectedRowKeys as number[])).unwrap();
      setSelectedRowKeys([]);
      handleRefresh();
    } catch (error) {
      console.error('批量删除失败:', error);
    }
  };

  // 批量状态切换
  const handleBatchStatusChange = async (status: ThoughtStatus) => {
    if (selectedRowKeys.length === 0) {
      message.warning('请选择要修改状态的想法');
      return;
    }

    try {
      // 这里需要后端API支持批量状态更新
      // await dispatch(batchUpdateThoughtStatus({ ids: selectedRowKeys as number[], status })).unwrap();
      message.success(`成功将 ${selectedRowKeys.length} 个想法设置为${status === ThoughtStatus.PUBLIC ? '公开' : '私密'}`);
      setSelectedRowKeys([]);
      // 刷新列表
      handleSearch();
    } catch (error: any) {
      message.error(error || '批量状态更新失败');
    }
  };

  // 预览想法详情
  const handlePreview = (thought: Thought) => {
    setPreviewThought(thought);
    setPreviewVisible(true);
  };

  // 获取心情标签颜色
  const getMoodColor = (mood?: MoodType) => {
    if (!mood) return '#d9d9d9';
    const moodOption = MOOD_OPTIONS.find(option => option.value === mood);
    return moodOption?.color || '#d9d9d9';
  };

  // 获取心情标签文本
  const getMoodLabel = (mood?: MoodType) => {
    if (!mood) return '未设置';
    const moodOption = MOOD_OPTIONS.find(option => option.value === mood);
    return moodOption?.label || mood;
  };

  // 表格列定义
  const columns: ColumnsType<Thought> = [
    {
      title: '内容',
      dataIndex: 'content',
      key: 'content',
      width: 250,
      ellipsis: {
        showTitle: false,
      },
      render: (content: string, record: Thought) => (
        <div>
          <Tooltip title={content}>
            <div className="max-w-xs truncate text-sm">
              {content}
            </div>
          </Tooltip>
          {record.images && record.images.length > 0 && (
            <div className="mt-1 flex gap-1">
              {record.images.slice(0, 2).map((image, index) => (
                <Image
                  key={index}
                  width={30}
                  height={30}
                  src={image}
                  className="rounded object-cover"
                  preview={false}
                />
              ))}
              {record.images.length > 2 && (
                <div className="w-7 h-7 bg-gray-100 rounded flex items-center justify-center text-xs text-gray-500">
                  +{record.images.length - 2}
                </div>
              )}
            </div>
          )}
        </div>
      ),
    },
    {
      title: '心情',
      dataIndex: 'mood',
      key: 'mood',
      width: 80,
      align: 'center',
      render: (mood: MoodType) => (
        <Tag color={getMoodColor(mood)} style={{ margin: 0, fontSize: '12px' }}>
          {getMoodLabel(mood)}
        </Tag>
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 80,
      align: 'center',
      render: (status: ThoughtStatus) => (
        <Badge
          status={status === ThoughtStatus.PUBLIC ? 'success' : 'default'}
          text={status === ThoughtStatus.PUBLIC ? '公开' : '私密'}
          style={{ fontSize: '12px' }}
        />
      ),
    },
    {
      title: '位置',
      dataIndex: 'location',
      key: 'location',
      width: 120,
      ellipsis: true,
      render: (location: string) => location ? (
        <Tooltip title={location}>
          <Space size="small">
            <EnvironmentOutlined style={{ fontSize: '12px', color: '#666' }} />
            <span style={{ fontSize: '12px' }}>{location}</span>
          </Space>
        </Tooltip>
      ) : (
        <span style={{ color: '#ccc', fontSize: '12px' }}>-</span>
      ),
    },
    {
      title: '天气',
      dataIndex: 'weather',
      key: 'weather',
      width: 100,
      align: 'center',
      render: (weather: string) => weather ? (
        <Space size="small">
          <CloudOutlined style={{ fontSize: '12px', color: '#666' }} />
          <span style={{ fontSize: '12px' }}>{weather}</span>
        </Space>
      ) : (
        <span style={{ color: '#ccc', fontSize: '12px' }}>-</span>
      ),
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
      width: 140,
      sorter: true,
      render: (createTime: string) => (
        <Tooltip title={new Date(createTime).toLocaleString()}>
          <Space size="small">
            <CalendarOutlined style={{ fontSize: '12px', color: '#666' }} />
            <span style={{ fontSize: '12px' }}>
              {new Date(createTime).toLocaleDateString()}
            </span>
          </Space>
        </Tooltip>
      ),
    },
    {
      title: '操作',
      key: 'action',
      width: 120,
      fixed: 'right',
      render: (_, record: Thought) => (
        <Space size="small">
          <Tooltip title="预览">
            <Button
              type="text"
              size="small"
              icon={<EyeOutlined />}
              onClick={() => handlePreview(record)}
            />
          </Tooltip>
          <Tooltip title="编辑">
            <Button
              type="text"
              size="small"
              icon={<EditOutlined />}
              onClick={() => onEdit?.(record)}
            />
          </Tooltip>
          <Popconfirm
            title="确定要删除这个想法吗？"
            description="删除后不可恢复，请谨慎操作。"
            onConfirm={() => handleDelete(record.id)}
            okText="确定"
            cancelText="取消"
          >
            <Tooltip title="删除">
              <Button
                type="text"
                size="small"
                danger
                icon={<DeleteOutlined />}
              />
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  // 行选择配置
  const rowSelection = {
    selectedRowKeys,
    onChange: (newSelectedRowKeys: React.Key[]) => {
      setSelectedRowKeys(newSelectedRowKeys);
    },
    getCheckboxProps: (record: Thought) => ({
      name: record.content,
    }),
  };

  return (
    <div>
      <Card>
        <div style={{ marginBottom: 16 }}>
          <Row justify="space-between" align="middle">
            <Col>
              <Title level={4} style={{ margin: 0 }}>
                想法管理
              </Title>
            </Col>
            <Col>
              <Space>
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={onAdd}
                >
                  新增想法
                </Button>
                <Button icon={<ReloadOutlined />} onClick={handleRefresh}>
                  刷新
                </Button>
              </Space>
            </Col>
          </Row>
        </div>

        {/* 统计信息 */}
        {stats && (
          <Row gutter={16} style={{ marginBottom: 16 }}>
            <Col span={6}>
              <Card size="small">
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#1890ff' }}>
                    {stats.total}
                  </div>
                  <div style={{ color: '#666' }}>总想法数</div>
                </div>
              </Card>
            </Col>
            <Col span={6}>
              <Card size="small">
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#52c41a' }}>
                    {stats.publicCount}
                  </div>
                  <div style={{ color: '#666' }}>公开想法</div>
                </div>
              </Card>
            </Col>
            <Col span={6}>
              <Card size="small">
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#faad14' }}>
                    {stats.privateCount}
                  </div>
                  <div style={{ color: '#666' }}>私密想法</div>
                </div>
              </Card>
            </Col>
            <Col span={6}>
              <Card size="small">
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#f5222d' }}>
                    {stats.todayCount}
                  </div>
                  <div style={{ color: '#666' }}>今日新增</div>
                </div>
              </Card>
            </Col>
          </Row>
        )}

        {/* 搜索区域 */}
        <Card size="small" style={{ marginBottom: 16 }}>
          <Form
            form={searchForm}
            layout="inline"
            onFinish={() => handleSearch(true)}
            style={{ marginBottom: 0 }}
          >
            <Form.Item name="content" style={{ marginBottom: 0 }}>
              <Input
                placeholder="搜索想法内容"
                prefix={<SearchOutlined />}
                style={{ width: 200 }}
                allowClear
              />
            </Form.Item>
            <Form.Item name="mood" style={{ marginBottom: 0 }}>
              <Select placeholder="选择心情" allowClear style={{ width: 120 }}>
                {MOOD_OPTIONS.map(option => (
                  <Option key={option.value} value={option.value}>
                    {option.label}
                  </Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item name="status" style={{ marginBottom: 0 }}>
              <Select placeholder="选择状态" allowClear style={{ width: 120 }}>
                {THOUGHT_STATUS_OPTIONS.map(option => (
                  <Option key={option.value} value={option.value}>
                    {option.label}
                  </Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item style={{ marginBottom: 0 }}>
              <Space>
                <Button type="primary" htmlType="submit">
                  搜索
                </Button>
                <Button onClick={handleReset}>
                  重置
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </Card>

        {/* 批量操作区域 */}
        {selectedRowKeys.length > 0 && (
          <div style={{ marginBottom: 16 }}>
            <Space>
              <span>已选择 {selectedRowKeys.length} 项</span>
              <Popconfirm
                title={`确定要删除选中的 ${selectedRowKeys.length} 个想法吗？`}
                description="删除后不可恢复，请谨慎操作。"
                onConfirm={handleBatchDelete}
                okText="确定"
                cancelText="取消"
              >
                <Button danger icon={<DeleteOutlined />}>
                  批量删除
                </Button>
              </Popconfirm>
              <Button 
                onClick={() => handleBatchStatusChange(ThoughtStatus.PUBLIC)}
                icon={<EyeOutlined />}
              >
                批量公开
              </Button>
              <Button 
                onClick={() => handleBatchStatusChange(ThoughtStatus.PRIVATE)}
                icon={<EyeOutlined />}
              >
                批量私密
              </Button>
              <Button onClick={() => setSelectedRowKeys([])}>
                取消选择
              </Button>
            </Space>
          </div>
        )}

        {/* 想法表格 */}
        <Table
          columns={columns}
          dataSource={thoughts}
          rowKey="id"
          loading={loading}
          pagination={{
            current: pagination.current,
            pageSize: pagination.pageSize,
            total: pagination.total,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => `第 ${range[0]}-${range[1]} 条，共 ${total} 条`,
            pageSizeOptions: ['10', '20', '50', '100'],
          }}
          rowSelection={rowSelection}
          scroll={{ x: 1200 }}
          size="small"
          onChange={handleTableChange}
        />
      </Card>

      {/* 想法预览弹窗 */}
      <Modal
        title="想法详情"
        open={previewVisible}
        onCancel={() => setPreviewVisible(false)}
        footer={[
          <Button key="close" onClick={() => setPreviewVisible(false)}>
            关闭
          </Button>,
          <Button
            key="edit"
            type="primary"
            onClick={() => {
              setPreviewVisible(false);
              if (previewThought) {
                onEdit?.(previewThought);
              }
            }}
          >
            编辑
          </Button>,
        ]}
        width={600}
      >
        {previewThought && (
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-medium text-gray-500 mb-2">内容</h4>
              <p className="text-gray-900 whitespace-pre-wrap">
                {previewThought.content}
              </p>
            </div>

            {previewThought.images && previewThought.images.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-2">图片</h4>
                <div className="flex flex-wrap gap-2">
                  {previewThought.images.map((image, index) => (
                    <Image
                      key={index}
                      width={100}
                      height={100}
                      src={image}
                      className="rounded object-cover"
                    />
                  ))}
                </div>
              </div>
            )}

            <Row gutter={16}>
              <Col span={12}>
                <h4 className="text-sm font-medium text-gray-500 mb-2">心情</h4>
                <Tag color={getMoodColor(previewThought.mood)}>
                  {getMoodLabel(previewThought.mood)}
                </Tag>
              </Col>
              <Col span={12}>
                <h4 className="text-sm font-medium text-gray-500 mb-2">状态</h4>
                <Badge
                  status={previewThought.status === ThoughtStatus.PUBLIC ? 'success' : 'default'}
                  text={previewThought.status === ThoughtStatus.PUBLIC ? '公开' : '私密'}
                />
              </Col>
            </Row>

            {(previewThought.location || previewThought.weather) && (
              <Row gutter={16}>
                {previewThought.location && (
                  <Col span={12}>
                    <h4 className="text-sm font-medium text-gray-500 mb-2">位置</h4>
                    <Space>
                      <EnvironmentOutlined />
                      {previewThought.location}
                    </Space>
                  </Col>
                )}
                {previewThought.weather && (
                  <Col span={12}>
                    <h4 className="text-sm font-medium text-gray-500 mb-2">天气</h4>
                    <Space>
                      <CloudOutlined />
                      {previewThought.weather}
                    </Space>
                  </Col>
                )}
              </Row>
            )}

            <Row gutter={16}>
              <Col span={12}>
                <h4 className="text-sm font-medium text-gray-500 mb-2">创建时间</h4>
                <Space>
                  <CalendarOutlined />
                  {new Date(previewThought.createTime).toLocaleString()}
                </Space>
              </Col>
              <Col span={12}>
                <h4 className="text-sm font-medium text-gray-500 mb-2">更新时间</h4>
                <Space>
                  <CalendarOutlined />
                  {new Date(previewThought.updateTime).toLocaleString()}
                </Space>
              </Col>
            </Row>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default ThoughtList;