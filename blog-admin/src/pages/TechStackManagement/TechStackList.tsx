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
  Switch,
  Modal,
  Row,
  Col,
  Typography,
  Divider,
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
  CheckOutlined,
  CloseOutlined,
  LinkOutlined,
  CodeOutlined,
} from '@ant-design/icons';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import {
  fetchTechStacks,
  deleteTechStack,
  updateTechStackStatus,
  batchUpdateTechStackStatus,
  batchDeleteTechStacks,
} from '../../store/slices/techStackSlice';
import type {
  TechStack,
  TechStackQueryParams,
} from '../../types/techStack';
import { 
  TechStackStatus,
  TechStackCategory,
  TECH_STACK_STATUS_OPTIONS,
  TECH_STACK_CATEGORY_OPTIONS,
  TECH_STACK_SORT_OPTIONS,
} from '../../types/techStack';

const { Search } = Input;
const { Option } = Select;
const { Title } = Typography;

interface TechStackListProps {
  onEdit?: (techStack: TechStack) => void;
  onAdd?: () => void;
}

const TechStackList: React.FC<TechStackListProps> = ({ onEdit, onAdd }) => {
  const dispatch = useAppDispatch();
  const { techStacks, pagination, loading } = useAppSelector(state => state.techStack);

  // 组件状态
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [searchForm] = Form.useForm();
  const [queryParams, setQueryParams] = useState<TechStackQueryParams>({
    page: 1,
    pageSize: 10,
  });

  // 初始化加载数据
  useEffect(() => {
    handleSearch();
  }, []);

  // 搜索处理
  const handleSearch = (params?: Partial<TechStackQueryParams>) => {
    const searchParams = { ...queryParams, ...params };
    setQueryParams(searchParams);
    dispatch(fetchTechStacks(searchParams));
  };

  // 重置搜索
  const handleReset = () => {
    searchForm.resetFields();
    const resetParams = { page: 1, pageSize: 10 };
    setQueryParams(resetParams);
    dispatch(fetchTechStacks(resetParams));
  };

  // 刷新数据
  const handleRefresh = () => {
    dispatch(fetchTechStacks(queryParams));
  };

  // 分页变化处理
  const handleTableChange = (pagination: TablePaginationConfig) => {
    const params = {
      ...queryParams,
      page: pagination.current || 1,
      pageSize: pagination.pageSize || 10,
    };
    handleSearch(params);
  };

  // 删除技术栈
  const handleDelete = async (id: number) => {
    try {
      await dispatch(deleteTechStack(id)).unwrap();
      handleRefresh();
    } catch (error) {
      console.error('删除技术栈失败:', error);
    }
  };

  // 切换状态
  const handleStatusToggle = async (id: number, status: TechStackStatus) => {
    try {
      await dispatch(updateTechStackStatus({ id, status })).unwrap();
    } catch (error) {
      console.error('更新技术栈状态失败:', error);
    }
  };

  // 批量删除
  const handleBatchDelete = async () => {
    if (selectedRowKeys.length === 0) {
      message.warning('请选择要删除的技术栈');
      return;
    }

    Modal.confirm({
      title: '确认删除',
      content: `确定要删除选中的 ${selectedRowKeys.length} 个技术栈吗？`,
      onOk: async () => {
        try {
          await dispatch(batchDeleteTechStacks(selectedRowKeys as number[])).unwrap();
          setSelectedRowKeys([]);
          handleRefresh();
        } catch (error) {
          console.error('批量删除技术栈失败:', error);
        }
      },
    });
  };

  // 批量更新状态
  const handleBatchStatusUpdate = async (status: TechStackStatus) => {
    if (selectedRowKeys.length === 0) {
      message.warning('请选择要更新的技术栈');
      return;
    }

    try {
      await dispatch(batchUpdateTechStackStatus({ 
        ids: selectedRowKeys as number[], 
        status 
      })).unwrap();
      setSelectedRowKeys([]);
    } catch (error) {
      console.error('批量更新技术栈状态失败:', error);
    }
  };

  // 表格列定义
  const columns: ColumnsType<TechStack> = [
    {
      title: '技术栈信息',
      key: 'info',
      width: 300,
      render: (_, record) => (
        <div className="flex items-center space-x-3">
          <Avatar
            src={record.icon}
            icon={<CodeOutlined />}
            size={40}
            className="flex-shrink-0"
          />
          <div className="flex-1 min-w-0">
            <div className="font-medium text-gray-900 truncate">
              {record.name}
            </div>
            <div className="text-sm text-gray-500 truncate">
              {record.description || '暂无描述'}
            </div>
          </div>
        </div>
      ),
    },
    {
      title: '分类',
      dataIndex: 'category',
      key: 'category',
      width: 120,
      render: (category: TechStackCategory) => {
        const categoryOption = TECH_STACK_CATEGORY_OPTIONS.find(
          option => option.value === category
        );
        return (
          <Tag color="blue">
            {categoryOption?.label || category}
          </Tag>
        );
      },
      filters: TECH_STACK_CATEGORY_OPTIONS.map(option => ({
        text: option.label,
        value: option.value,
      })),
    },
    {
      title: '官方网站',
      dataIndex: 'officialUrl',
      key: 'officialUrl',
      width: 120,
      render: (url: string) => (
        url ? (
          <Tooltip title={url}>
            <Button
              type="link"
              icon={<LinkOutlined />}
              size="small"
              onClick={() => window.open(url, '_blank')}
            >
              访问
            </Button>
          </Tooltip>
        ) : (
          <span className="text-gray-400">-</span>
        )
      ),
    },
    {
      title: '排序权重',
      dataIndex: 'sortOrder',
      key: 'sortOrder',
      width: 100,
      sorter: true,
      render: (sortOrder: number) => (
        <Badge count={sortOrder} color="blue" />
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: TechStackStatus, record) => (
        <Switch
          checked={status === TechStackStatus.VISIBLE}
          onChange={(checked) => 
            handleStatusToggle(
              record.id, 
              checked ? TechStackStatus.VISIBLE : TechStackStatus.HIDDEN
            )
          }
          checkedChildren={<CheckOutlined />}
          unCheckedChildren={<CloseOutlined />}
        />
      ),
      filters: TECH_STACK_STATUS_OPTIONS.map(option => ({
        text: option.label,
        value: option.value,
      })),
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
      width: 180,
      sorter: true,
      render: (time: string) => (
        <span className="text-gray-600">
          {new Date(time).toLocaleString()}
        </span>
      ),
    },
    {
      title: '操作',
      key: 'action',
      width: 150,
      fixed: 'right',
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="查看详情">
            <Button
              type="text"
              icon={<EyeOutlined />}
              size="small"
              onClick={() => {
                Modal.info({
                  title: '技术栈详情',
                  width: 600,
                  content: (
                    <div className="space-y-4 mt-4">
                      <div className="flex items-center space-x-3">
                        <Avatar src={record.icon} icon={<CodeOutlined />} size={48} />
                        <div>
                          <h3 className="text-lg font-medium">{record.name}</h3>
                          <Tag color="blue">
                            {TECH_STACK_CATEGORY_OPTIONS.find(
                              opt => opt.value === record.category
                            )?.label}
                          </Tag>
                        </div>
                      </div>
                      <Divider />
                      <div>
                        <strong>描述：</strong>
                        <p className="mt-1 text-gray-600">
                          {record.description || '暂无描述'}
                        </p>
                      </div>
                      {record.officialUrl && (
                        <div>
                          <strong>官方网站：</strong>
                          <a 
                            href={record.officialUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="ml-2 text-blue-500 hover:text-blue-700"
                          >
                            {record.officialUrl}
                          </a>
                        </div>
                      )}
                      <div>
                        <strong>排序权重：</strong>
                        <span className="ml-2">{record.sortOrder}</span>
                      </div>
                      <div>
                        <strong>状态：</strong>
                        <Tag 
                          color={record.status === TechStackStatus.VISIBLE ? 'green' : 'red'}
                          className="ml-2"
                        >
                          {record.status === TechStackStatus.VISIBLE ? '展示' : '隐藏'}
                        </Tag>
                      </div>
                    </div>
                  ),
                });
              }}
            />
          </Tooltip>
          <Tooltip title="编辑">
            <Button
              type="text"
              icon={<EditOutlined />}
              size="small"
              onClick={() => onEdit?.(record)}
            />
          </Tooltip>
          <Tooltip title="删除">
            <Popconfirm
              title="确定要删除这个技术栈吗？"
              onConfirm={() => handleDelete(record.id)}
              okText="确定"
              cancelText="取消"
            >
              <Button
                type="text"
                danger
                icon={<DeleteOutlined />}
                size="small"
              />
            </Popconfirm>
          </Tooltip>
        </Space>
      ),
    },
  ];

  // 行选择配置
  const rowSelection = {
    selectedRowKeys,
    onChange: setSelectedRowKeys,
    getCheckboxProps: (record: TechStack) => ({
      name: record.name,
    }),
  };

  return (
    <div className="tech-stack-list">
      {/* 搜索区域 */}
      <Card className="mb-4">
        <Form
          form={searchForm}
          layout="inline"
          onFinish={(values) => handleSearch({ ...values, page: 1 })}
          className="search-form"
        >
          <Form.Item name="name" className="mb-2">
            <Search
              placeholder="搜索技术栈名称"
              allowClear
              style={{ width: 200 }}
              onSearch={(value) => handleSearch({ name: value, page: 1 })}
            />
          </Form.Item>
          <Form.Item name="category" className="mb-2">
            <Select
              placeholder="选择分类"
              allowClear
              style={{ width: 150 }}
              onChange={(value) => handleSearch({ category: value, page: 1 })}
            >
              {TECH_STACK_CATEGORY_OPTIONS.map(option => (
                <Option key={option.value} value={option.value}>
                  {option.label}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="status" className="mb-2">
            <Select
              placeholder="选择状态"
              allowClear
              style={{ width: 120 }}
              onChange={(value) => handleSearch({ status: value, page: 1 })}
            >
              {TECH_STACK_STATUS_OPTIONS.map(option => (
                <Option key={option.value} value={option.value}>
                  {option.label}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item className="mb-2">
            <Space>
              <Button type="primary" htmlType="submit" icon={<SearchOutlined />}>
                搜索
              </Button>
              <Button onClick={handleReset}>
                重置
              </Button>
              <Button icon={<ReloadOutlined />} onClick={handleRefresh}>
                刷新
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>

      {/* 操作区域 */}
      <Card className="mb-4">
        <Row justify="space-between" align="middle">
          <Col>
            <Space>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={onAdd}
              >
                新增技术栈
              </Button>
              {selectedRowKeys.length > 0 && (
                <>
                  <Button
                    onClick={() => handleBatchStatusUpdate(TechStackStatus.VISIBLE)}
                  >
                    批量启用
                  </Button>
                  <Button
                    onClick={() => handleBatchStatusUpdate(TechStackStatus.HIDDEN)}
                  >
                    批量禁用
                  </Button>
                  <Button
                    danger
                    onClick={handleBatchDelete}
                  >
                    批量删除
                  </Button>
                </>
              )}
            </Space>
          </Col>
          <Col>
            <span className="text-gray-500">
              {selectedRowKeys.length > 0 && `已选择 ${selectedRowKeys.length} 项 | `}
              共 {pagination.total} 条记录
            </span>
          </Col>
        </Row>
      </Card>

      {/* 表格区域 */}
      <Card>
        <Table
          rowSelection={rowSelection}
          columns={columns}
          dataSource={techStacks}
          rowKey="id"
          loading={loading}
          pagination={{
            current: pagination.current,
            pageSize: pagination.pageSize,
            total: pagination.total,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `第 ${range[0]}-${range[1]} 条/共 ${total} 条`,
          }}
          onChange={handleTableChange}
          scroll={{ x: 1200 }}
          size="middle"
        />
      </Card>
    </div>
  );
};

export default TechStackList;