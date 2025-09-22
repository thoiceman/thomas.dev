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
  Card,
  Tooltip,
  Badge,
  Modal,
  Row,
  Col,
  Typography,
  Divider,
  Select,
  DatePicker,
  Rate,
  Image,
  Avatar,
} from 'antd';
import type { ColumnsType, TablePaginationConfig } from 'antd/es/table';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  ReloadOutlined,
  SearchOutlined,
  EnvironmentOutlined,
  CalendarOutlined,
  DollarOutlined,
  StarOutlined,
  GlobalOutlined,
  CarOutlined,
  TeamOutlined,
  CloudOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';
import type {
  Travel,
  TravelQueryParams,
} from '../../types/travel';
import {
  TravelStatus,
  TravelRating,
  TransportationType,
} from '../../types/travel';
import {
  TRAVEL_STATUS_OPTIONS,
  TRAVEL_RATING_OPTIONS,
  TRANSPORTATION_OPTIONS,
  TRAVEL_SORT_OPTIONS,
  DEFAULT_TRAVEL_QUERY_PARAMS,
} from '../../types/travel';

const { Search } = Input;
const { Title } = Typography;
const { RangePicker } = DatePicker;
const { Option } = Select;

interface TravelListProps {
  onEdit?: (travel: Travel) => void;
  onAdd?: () => void;
}

const TravelList: React.FC<TravelListProps> = ({ onEdit, onAdd }) => {
  // 模拟数据和状态（后续会替换为Redux状态管理）
  const [travels, setTravels] = useState<Travel[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [searchForm] = Form.useForm();
  const [previewVisible, setPreviewVisible] = useState(false);
  const [selectedTravel, setSelectedTravel] = useState<Travel | null>(null);
  const [queryParams, setQueryParams] = useState<TravelQueryParams>(DEFAULT_TRAVEL_QUERY_PARAMS);
  
  // 分页配置
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
    showSizeChanger: true,
    showQuickJumper: true,
    showTotal: (total: number, range: [number, number]) => 
      `第 ${range[0]}-${range[1]} 条，共 ${total} 条`,
  });

  // 统计数据
  const [stats, setStats] = useState({
    total: 0,
    publicCount: 0,
    privateCount: 0,
    thisYearCount: 0,
    thisMonthCount: 0,
    totalDays: 0,
    totalBudget: 0,
    averageRating: 0,
  });

  // 初始化数据
  useEffect(() => {
    handleRefresh();
  }, []);

  // 刷新数据
  const handleRefresh = () => {
    setLoading(true);
    // TODO: 调用API获取数据
    setTimeout(() => {
      // 模拟数据
      const mockData: Travel[] = [
        {
          id: 1,
          title: '日本关西之旅',
          destination: '日本关西',
          country: '日本',
          city: '大阪',
          description: '探索日本关西地区的文化和美食',
          content: '详细的旅行游记内容...',
          coverImage: 'https://example.com/cover1.jpg',
          images: ['https://example.com/img1.jpg', 'https://example.com/img2.jpg'],
          startDate: '2024-03-01',
          endDate: '2024-03-07',
          duration: 7,
          budget: 8000,
          companions: '朋友',
          transportation: 'plane' as TransportationType,
          accommodation: '民宿',
          highlights: ['清水寺', '金阁寺', '奈良公园'],
          latitude: 34.6937,
          longitude: 135.5023,
          weather: '晴朗',
          rating: 5 as TravelRating,
          status: 1 as TravelStatus,
          authorId: 1,
          createTime: '2024-03-10 10:00:00',
          updateTime: '2024-03-10 10:00:00',
          isDelete: 0,
        },
        {
          id: 2,
          title: '云南丽江古城游',
          destination: '云南丽江',
          country: '中国',
          city: '丽江',
          description: '感受古城的韵味和纳西文化',
          content: '详细的旅行游记内容...',
          coverImage: 'https://example.com/cover2.jpg',
          images: ['https://example.com/img3.jpg'],
          startDate: '2024-02-15',
          endDate: '2024-02-20',
          duration: 6,
          budget: 3500,
          companions: '家人',
          transportation: 'plane' as TransportationType,
          accommodation: '客栈',
          highlights: ['丽江古城', '玉龙雪山', '束河古镇'],
          latitude: 26.8721,
          longitude: 100.2319,
          weather: '多云',
          rating: 4 as TravelRating,
          status: 1 as TravelStatus,
          authorId: 1,
          createTime: '2024-02-25 15:30:00',
          updateTime: '2024-02-25 15:30:00',
          isDelete: 0,
        },
      ];
      
      setTravels(mockData);
      setPagination(prev => ({ ...prev, total: mockData.length }));
      setStats({
        total: mockData.length,
        publicCount: mockData.filter(t => t.status === 1).length,
        privateCount: mockData.filter(t => t.status === 0).length,
        thisYearCount: mockData.length,
        thisMonthCount: 0,
        totalDays: mockData.reduce((sum, t) => sum + (t.duration || 0), 0),
        totalBudget: mockData.reduce((sum, t) => sum + (t.budget || 0), 0),
        averageRating: mockData.reduce((sum, t) => sum + (t.rating || 0), 0) / mockData.length,
      });
      setLoading(false);
    }, 1000);
  };

  // 搜索处理
  const handleSearch = (values: any) => {
    const newParams: TravelQueryParams = {
      ...queryParams,
      page: 1,
      title: values.title?.trim() || undefined,
      destination: values.destination?.trim() || undefined,
      country: values.country?.trim() || undefined,
      status: values.status,
      rating: values.rating,
      transportation: values.transportation,
    };
    
    if (values.dateRange && values.dateRange.length === 2) {
      newParams.startDate = values.dateRange[0].format('YYYY-MM-DD');
      newParams.endDate = values.dateRange[1].format('YYYY-MM-DD');
    }
    
    setQueryParams(newParams);
    // TODO: 调用API搜索
    console.log('搜索参数:', newParams);
  };

  // 重置搜索
  const handleReset = () => {
    searchForm.resetFields();
    setQueryParams(DEFAULT_TRAVEL_QUERY_PARAMS);
    handleRefresh();
  };

  // 删除单个记录
  const handleDelete = async (id: number) => {
    try {
      setLoading(true);
      // TODO: 调用删除API
      console.log('删除旅行记录:', id);
      message.success('删除成功');
      handleRefresh();
    } catch (error) {
      message.error('删除失败');
    } finally {
      setLoading(false);
    }
  };

  // 批量删除
  const handleBatchDelete = async () => {
    if (selectedRowKeys.length === 0) {
      message.warning('请选择要删除的记录');
      return;
    }
    
    try {
      setLoading(true);
      // TODO: 调用批量删除API
      console.log('批量删除旅行记录:', selectedRowKeys);
      message.success(`成功删除 ${selectedRowKeys.length} 条记录`);
      setSelectedRowKeys([]);
      handleRefresh();
    } catch (error) {
      message.error('批量删除失败');
    } finally {
      setLoading(false);
    }
  };

  // 批量状态切换
  const handleBatchStatusChange = async (status: TravelStatus) => {
    if (selectedRowKeys.length === 0) {
      message.warning('请选择要修改的记录');
      return;
    }
    
    try {
      setLoading(true);
      // TODO: 调用批量状态切换API
      console.log('批量状态切换:', selectedRowKeys, status);
      const statusText = status === TravelStatus.PUBLIC ? '公开' : '私密';
      message.success(`成功将 ${selectedRowKeys.length} 条记录设为${statusText}`);
      setSelectedRowKeys([]);
      handleRefresh();
    } catch (error) {
      message.error('批量状态切换失败');
    } finally {
      setLoading(false);
    }
  };

  // 预览记录
  const handlePreview = (travel: Travel) => {
    setSelectedTravel(travel);
    setPreviewVisible(true);
  };

  // 分页变化处理
  const handleTableChange = (paginationConfig: TablePaginationConfig) => {
    const newParams = {
      ...queryParams,
      page: paginationConfig.current || 1,
      pageSize: paginationConfig.pageSize || 10,
    };
    setQueryParams(newParams);
    setPagination(prev => ({
      ...prev,
      current: paginationConfig.current || 1,
      pageSize: paginationConfig.pageSize || 10,
    }));
  };

  // 行选择配置
  const rowSelection = {
    selectedRowKeys,
    onChange: (newSelectedRowKeys: React.Key[]) => {
      setSelectedRowKeys(newSelectedRowKeys);
    },
    getCheckboxProps: (record: Travel) => ({
      disabled: record.isDelete === 1,
    }),
  };

  // 表格列定义
  const columns: ColumnsType<Travel> = [
    {
      title: '封面',
      dataIndex: 'coverImage',
      key: 'coverImage',
      width: 80,
      render: (coverImage: string, record: Travel) => (
        <Avatar
          size={60}
          shape="square"
          src={coverImage}
          icon={<EnvironmentOutlined />}
          style={{ backgroundColor: '#f0f0f0' }}
        />
      ),
    },
    {
      title: '标题',
      dataIndex: 'title',
      key: 'title',
      width: 200,
      ellipsis: true,
      render: (title: string, record: Travel) => (
        <div>
          <div style={{ fontWeight: 'bold', marginBottom: 4 }}>{title}</div>
          <div style={{ fontSize: '12px', color: '#666' }}>
            <EnvironmentOutlined style={{ marginRight: 4 }} />
            {record.destination}
          </div>
        </div>
      ),
    },
    {
      title: '目的地',
      dataIndex: 'destination',
      key: 'destination',
      width: 150,
      render: (destination: string, record: Travel) => (
        <div>
          <div>{destination}</div>
          {record.country && (
            <div style={{ fontSize: '12px', color: '#666' }}>
              <GlobalOutlined style={{ marginRight: 4 }} />
              {record.country}
            </div>
          )}
        </div>
      ),
    },
    {
      title: '日期',
      dataIndex: 'startDate',
      key: 'dateRange',
      width: 120,
      render: (startDate: string, record: Travel) => (
        <div style={{ fontSize: '12px' }}>
          <div>
            <CalendarOutlined style={{ marginRight: 4, color: '#1890ff' }} />
            {dayjs(startDate).format('MM-DD')}
          </div>
          <div style={{ color: '#666' }}>
            至 {dayjs(record.endDate).format('MM-DD')}
          </div>
          <div style={{ color: '#666' }}>
            {record.duration}天
          </div>
        </div>
      ),
    },
    {
      title: '预算',
      dataIndex: 'budget',
      key: 'budget',
      width: 100,
      align: 'right',
      render: (budget: number) => (
        <div style={{ fontSize: '12px' }}>
          {budget ? (
            <>
              <DollarOutlined style={{ marginRight: 4, color: '#52c41a' }} />
              ¥{budget.toLocaleString()}
            </>
          ) : (
            <span style={{ color: '#ccc' }}>未设置</span>
          )}
        </div>
      ),
    },
    {
      title: '交通',
      dataIndex: 'transportation',
      key: 'transportation',
      width: 80,
      align: 'center',
      render: (transportation: TransportationType) => {
        const option = TRANSPORTATION_OPTIONS.find(opt => opt.value === transportation);
        return option ? (
          <Tooltip title={option.label}>
            <span style={{ fontSize: '16px' }}>{option.icon}</span>
          </Tooltip>
        ) : (
          <span style={{ color: '#ccc' }}>-</span>
        );
      },
    },
    {
      title: '评分',
      dataIndex: 'rating',
      key: 'rating',
      width: 120,
      align: 'center',
      render: (rating: TravelRating) => (
        <div>
          <Rate disabled value={rating} style={{ fontSize: '14px' }} />
          <div style={{ fontSize: '12px', color: '#666' }}>
            {rating ? `${rating}星` : '未评分'}
          </div>
        </div>
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 80,
      align: 'center',
      render: (status: TravelStatus) => (
        <Tag color={status === TravelStatus.PUBLIC ? 'green' : 'orange'}>
          {status === TravelStatus.PUBLIC ? '公开' : '私密'}
        </Tag>
      ),
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
      width: 120,
      sorter: true,
      render: (createTime: string) => (
        <div style={{ fontSize: '12px', color: '#666' }}>
          {dayjs(createTime).format('YYYY-MM-DD')}
        </div>
      ),
    },
    {
      title: '操作',
      key: 'action',
      width: 150,
      fixed: 'right',
      render: (_, record: Travel) => (
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
            title="确定要删除这条旅行记录吗？"
            description="删除后将无法恢复，请谨慎操作。"
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

  return (
    <div className="travel-list">
      {/* 统计信息卡片 */}
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col xs={24} sm={12} md={6}>
          <Card size="small">
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#1890ff' }}>
                {stats.total}
              </div>
              <div style={{ fontSize: '14px', color: '#666' }}>总记录数</div>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card size="small">
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#52c41a' }}>
                {stats.publicCount}
              </div>
              <div style={{ fontSize: '14px', color: '#666' }}>公开记录</div>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card size="small">
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#faad14' }}>
                {stats.totalDays}
              </div>
              <div style={{ fontSize: '14px', color: '#666' }}>总旅行天数</div>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card size="small">
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#f5222d' }}>
                ¥{stats.totalBudget.toLocaleString()}
              </div>
              <div style={{ fontSize: '14px', color: '#666' }}>总花费</div>
            </div>
          </Card>
        </Col>
      </Row>

      {/* 页面标题和操作区域 */}
      <Card>
        <div style={{ marginBottom: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Title level={4} style={{ margin: 0 }}>
              <EnvironmentOutlined style={{ marginRight: 8, color: '#1890ff' }} />
              旅行记录管理
            </Title>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={onAdd}
            >
              新增旅行记录
            </Button>
          </div>
        </div>

        {/* 搜索区域 */}
        <Form
          form={searchForm}
          layout="inline"
          onFinish={handleSearch}
          style={{ marginBottom: 16 }}
        >
          <Form.Item name="title">
            <Input
              placeholder="搜索标题"
              prefix={<SearchOutlined />}
              style={{ width: 200 }}
            />
          </Form.Item>
          <Form.Item name="destination">
            <Input
              placeholder="搜索目的地"
              prefix={<EnvironmentOutlined />}
              style={{ width: 150 }}
            />
          </Form.Item>
          <Form.Item name="country">
            <Input
              placeholder="搜索国家"
              prefix={<GlobalOutlined />}
              style={{ width: 120 }}
            />
          </Form.Item>
          <Form.Item name="status">
            <Select placeholder="状态" style={{ width: 100 }} allowClear>
              {TRAVEL_STATUS_OPTIONS.map(option => (
                <Option key={option.value} value={option.value}>
                  {option.label}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="rating">
            <Select placeholder="评分" style={{ width: 100 }} allowClear>
              {TRAVEL_RATING_OPTIONS.map(option => (
                <Option key={option.value} value={option.value}>
                  {option.label}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="transportation">
            <Select placeholder="交通方式" style={{ width: 120 }} allowClear>
              {TRANSPORTATION_OPTIONS.map(option => (
                <Option key={option.value} value={option.value}>
                  {option.label}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="dateRange">
            <RangePicker placeholder={['开始日期', '结束日期']} />
          </Form.Item>
          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit" icon={<SearchOutlined />}>
                搜索
              </Button>
              <Button onClick={handleReset} icon={<ReloadOutlined />}>
                重置
              </Button>
            </Space>
          </Form.Item>
        </Form>

        {/* 批量操作区域 */}
        {selectedRowKeys.length > 0 && (
          <div style={{ marginBottom: 16, padding: '8px 12px', backgroundColor: '#e6f7ff', borderRadius: '6px' }}>
            <Space>
              <span>已选择 {selectedRowKeys.length} 项</span>
              <Button
                size="small"
                onClick={() => handleBatchStatusChange(TravelStatus.PUBLIC)}
                icon={<EyeOutlined />}
              >
                批量公开
              </Button>
              <Button
                size="small"
                onClick={() => handleBatchStatusChange(TravelStatus.PRIVATE)}
                icon={<EyeOutlined />}
              >
                批量私密
              </Button>
              <Popconfirm
                title="确定要删除选中的旅行记录吗？"
                description={`将删除 ${selectedRowKeys.length} 条记录，删除后无法恢复。`}
                onConfirm={handleBatchDelete}
                okText="确定"
                cancelText="取消"
              >
                <Button
                  size="small"
                  danger
                  icon={<DeleteOutlined />}
                >
                  批量删除
                </Button>
              </Popconfirm>
            </Space>
          </div>
        )}

        {/* 表格区域 */}
        <Table
          columns={columns}
          dataSource={travels}
          rowKey="id"
          loading={loading}
          pagination={{
            ...pagination,
            pageSizeOptions: ['10', '20', '50', '100'],
          }}
          rowSelection={rowSelection}
          onChange={handleTableChange}
          scroll={{ x: 1200 }}
          size="small"
        />
      </Card>

      {/* 旅行记录预览弹窗 */}
      <Modal
        title={
          <Space>
            <EnvironmentOutlined />
            旅行记录详情
          </Space>
        }
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
              if (selectedTravel) {
                onEdit?.(selectedTravel);
              }
            }}
          >
            编辑
          </Button>,
        ]}
        width={800}
      >
        {selectedTravel && (
          <div>
            <Row gutter={16}>
              <Col span={16}>
                <div style={{ marginBottom: 16 }}>
                  <Title level={4}>{selectedTravel.title}</Title>
                  <div style={{ color: '#666', marginBottom: 8 }}>
                    <EnvironmentOutlined style={{ marginRight: 4 }} />
                    {selectedTravel.destination}
                    {selectedTravel.country && ` · ${selectedTravel.country}`}
                    {selectedTravel.city && ` · ${selectedTravel.city}`}
                  </div>
                  <div style={{ color: '#666', marginBottom: 8 }}>
                    <CalendarOutlined style={{ marginRight: 4 }} />
                    {dayjs(selectedTravel.startDate).format('YYYY年MM月DD日')} 至 {dayjs(selectedTravel.endDate).format('YYYY年MM月DD日')}
                    （{selectedTravel.duration}天）
                  </div>
                  {selectedTravel.budget && (
                    <div style={{ color: '#666', marginBottom: 8 }}>
                      <DollarOutlined style={{ marginRight: 4 }} />
                      预算：¥{selectedTravel.budget.toLocaleString()}
                    </div>
                  )}
                  {selectedTravel.companions && (
                    <div style={{ color: '#666', marginBottom: 8 }}>
                      <TeamOutlined style={{ marginRight: 4 }} />
                      同行：{selectedTravel.companions}
                    </div>
                  )}
                  {selectedTravel.transportation && (
                    <div style={{ color: '#666', marginBottom: 8 }}>
                      <CarOutlined style={{ marginRight: 4 }} />
                      交通：{TRANSPORTATION_OPTIONS.find(opt => opt.value === selectedTravel.transportation)?.label}
                    </div>
                  )}
                  {selectedTravel.weather && (
                    <div style={{ color: '#666', marginBottom: 8 }}>
                      <CloudOutlined style={{ marginRight: 4 }} />
                      天气：{selectedTravel.weather}
                    </div>
                  )}
                </div>
                
                {selectedTravel.description && (
                  <div style={{ marginBottom: 16 }}>
                    <Title level={5}>旅行描述</Title>
                    <p>{selectedTravel.description}</p>
                  </div>
                )}

                {selectedTravel.highlights && selectedTravel.highlights.length > 0 && (
                  <div style={{ marginBottom: 16 }}>
                    <Title level={5}>旅行亮点</Title>
                    <Space wrap>
                      {selectedTravel.highlights.map((highlight, index) => (
                        <Tag key={index} color="blue">{highlight}</Tag>
                      ))}
                    </Space>
                  </div>
                )}
              </Col>
              <Col span={8}>
                {selectedTravel.coverImage && (
                  <div style={{ marginBottom: 16 }}>
                    <Image
                      src={selectedTravel.coverImage}
                      alt="封面图片"
                      style={{ width: '100%', borderRadius: '8px' }}
                    />
                  </div>
                )}
                
                <div style={{ textAlign: 'center', marginBottom: 16 }}>
                  <Rate disabled value={selectedTravel.rating} />
                  <div style={{ fontSize: '12px', color: '#666', marginTop: 4 }}>
                    {selectedTravel.rating ? `${selectedTravel.rating}星评价` : '暂无评分'}
                  </div>
                </div>

                <div style={{ textAlign: 'center' }}>
                  <Tag color={selectedTravel.status === TravelStatus.PUBLIC ? 'green' : 'orange'}>
                    {selectedTravel.status === TravelStatus.PUBLIC ? '公开' : '私密'}
                  </Tag>
                </div>
              </Col>
            </Row>

            {selectedTravel.images && selectedTravel.images.length > 0 && (
              <div style={{ marginTop: 16 }}>
                <Title level={5}>相册</Title>
                <Image.PreviewGroup>
                  <Row gutter={8}>
                    {selectedTravel.images.slice(0, 6).map((image, index) => (
                      <Col key={index} span={4}>
                        <Image
                          src={image}
                          alt={`图片${index + 1}`}
                          style={{ width: '100%', height: '80px', objectFit: 'cover', borderRadius: '4px' }}
                        />
                      </Col>
                    ))}
                  </Row>
                </Image.PreviewGroup>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default TravelList;