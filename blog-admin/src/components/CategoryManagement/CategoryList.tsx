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
} from '@ant-design/icons';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import {
  fetchCategories,
  deleteCategory,
  updateCategoryStatus,
  batchUpdateCategoryStatus,
  batchDeleteCategories,
} from '../../store/slices/categorySlice';
import type {
  Category,
  CategoryQueryParams,
} from '../../types/category';
import { 
  CategoryStatus,
  CATEGORY_STATUS_OPTIONS,
  SORT_OPTIONS,
} from '../../types/category';

const { Search } = Input;
const { Option } = Select;
const { Title } = Typography;

interface CategoryListProps {
  onEdit?: (category: Category) => void;
  onAdd?: () => void;
}

const CategoryList: React.FC<CategoryListProps> = ({ onEdit, onAdd }) => {
  const dispatch = useAppDispatch();
  const { 
    categories, 
    pagination, 
    loading, 
    queryParams: storeQueryParams 
  } = useAppSelector((state) => state.category);

  // 搜索表单状态
  const [searchForm] = Form.useForm();
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

  // 查询参数状态
  const [queryParams, setQueryParams] = useState<CategoryQueryParams>({
    page: 1,
    size: 10,
    sortBy: 'createTime',
    sortOrder: 'desc',
  });

  // 组件挂载时获取数据
  useEffect(() => {
    handleSearch();
  }, []);

  // 搜索处理
  const handleSearch = (params?: Partial<CategoryQueryParams>) => {
    const searchParams = { ...queryParams, ...params, page: 1 };
    setQueryParams(searchParams);
    dispatch(fetchCategories(searchParams));
  };

  // 重置搜索
  const handleReset = () => {
    searchForm.resetFields();
    const resetParams = {
      page: 1,
      size: 10,
      sortBy: 'sortOrder' as const,
      sortOrder: 'asc' as const,
    };
    setQueryParams(resetParams);
    dispatch(fetchCategories(resetParams));
  };

  // 刷新数据
  const handleRefresh = () => {
    dispatch(fetchCategories(queryParams));
  };

  // 表格分页变化处理
  const handleTableChange = (
    pagination: TablePaginationConfig,
    _: any,
    sorter: any
  ) => {
    const newParams = {
      ...queryParams,
      page: pagination.current || 1,
      size: pagination.pageSize || 10,
    };

    if (sorter && sorter.field) {
      newParams.sortBy = sorter.field;
      newParams.sortOrder = sorter.order === 'ascend' ? 'asc' : 'desc';
    }

    setQueryParams(newParams);
    dispatch(fetchCategories(newParams));
  };

  // 删除分类
  const handleDelete = async (id: number) => {
    try {
      await dispatch(deleteCategory(id)).unwrap();
      message.success('删除成功');
      handleRefresh();
    } catch (error: any) {
      message.error(error || '删除失败');
    }
  };

  // 更新分类状态
  const handleStatusChange = async (id: number, status: CategoryStatus) => {
    try {
      await dispatch(updateCategoryStatus({ id, status })).unwrap();
      message.success('状态更新成功');
      handleRefresh();
    } catch (error: any) {
      message.error(error || '状态更新失败');
    }
  };

  // 状态切换处理
  const handleStatusToggle = async (record: Category, checked: boolean) => {
    try {
      const newStatus = checked ? CategoryStatus.ENABLED : CategoryStatus.DISABLED;
      await dispatch(updateCategoryStatus({ 
        id: record.id, 
        status: newStatus 
      })).unwrap();
      message.success('状态更新成功');
    } catch (error) {
      message.error('状态更新失败');
    }
  };

  // 批量删除
  const handleBatchDelete = async () => {
    if (selectedRowKeys.length === 0) {
      message.warning('请选择要删除的分类');
      return;
    }

    Modal.confirm({
      title: '确认删除',
      content: `确定要删除选中的 ${selectedRowKeys.length} 个分类吗？`,
      onOk: async () => {
        try {
          await dispatch(
            batchDeleteCategories(selectedRowKeys as number[])
          ).unwrap();
          message.success('批量删除成功');
          setSelectedRowKeys([]);
          handleRefresh();
        } catch (error: any) {
          message.error(error || '批量删除失败');
        }
      },
    });
  };

  // 批量更新状态
  const handleBatchStatusUpdate = async (status: CategoryStatus) => {
    if (selectedRowKeys.length === 0) {
      message.warning('请选择要更新的分类');
      return;
    }

    try {
      await dispatch(
        batchUpdateCategoryStatus({
          ids: selectedRowKeys as number[],
          status,
        })
      ).unwrap();
      message.success('批量更新成功');
      setSelectedRowKeys([]);
      handleRefresh();
    } catch (error: any) {
      message.error(error || '批量更新失败');
    }
  };

  // 表格列定义
  const columns: ColumnsType<Category> = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 80,
      sorter: true,
    },
    {
      title: '分类名称',
      dataIndex: 'name',
      key: 'name',
      ellipsis: true,
      render: (text: string, record: Category) => (
        <Space>
          <span>{text}</span>
          {record.icon && (
            <span
              style={{ fontSize: '16px' }}
              dangerouslySetInnerHTML={{ __html: record.icon }}
            />
          )}
        </Space>
      ),
    },
    {
      title: 'Slug',
      dataIndex: 'slug',
      key: 'slug',
      ellipsis: true,
      render: (text: string) => (
        <code style={{ fontSize: '12px', padding: '2px 4px' }}>{text}</code>
      ),
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
      width: 200,
    },
    {
      title: '颜色',
      dataIndex: 'color',
      key: 'color',
      width: 80,
      render: (color: string) => (
        <div
          style={{
            width: '20px',
            height: '20px',
            backgroundColor: color,
            borderRadius: '4px',
            border: '1px solid #d9d9d9',
          }}
          title={color}
        />
      ),
    },
    {
      title: '排序',
      dataIndex: 'sortOrder',
      key: 'sortOrder',
      width: 80,
      sorter: true,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: CategoryStatus, record: Category) => (
        <Switch
          checked={status === CategoryStatus.ENABLED}
          onChange={(checked) =>
            handleStatusChange(
              record.id,
              checked ? CategoryStatus.ENABLED : CategoryStatus.DISABLED
            )
          }
          checkedChildren={<CheckOutlined />}
          unCheckedChildren={<CloseOutlined />}
        />
      ),
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
      width: 180,
      sorter: true,
      render: (date: string) => new Date(date).toLocaleString(),
    },
    {
      title: '操作',
      key: 'action',
      width: 150,
      fixed: 'right',
      render: (_, record: Category) => (
        <Space size="small">
          <Tooltip title="查看">
            <Button
              type="text"
              size="small"
              icon={<EyeOutlined />}
              onClick={() => {
                // 这里可以添加查看详情的逻辑
                console.log('查看分类:', record);
              }}
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
          <Tooltip title="删除">
            <Popconfirm
              title="确定要删除这个分类吗？"
              onConfirm={() => handleDelete(record.id)}
              okText="确定"
              cancelText="取消"
            >
              <Button
                type="text"
                size="small"
                danger
                icon={<DeleteOutlined />}
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
    onChange: (newSelectedRowKeys: React.Key[]) => {
      setSelectedRowKeys(newSelectedRowKeys);
    },
    getCheckboxProps: (record: Category) => ({
      disabled: record.isDelete === 1, // 已删除的不能选择
    }),
  };

  return (
    <div>
      <Card>
        <div style={{ marginBottom: 16 }}>
          <Row justify="space-between" align="middle">
            <Col>
              <Title level={4} style={{ margin: 0 }}>
                分类管理
              </Title>
            </Col>
            <Col>
              <Space>
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={onAdd}
                >
                  新增分类
                </Button>
                <Button icon={<ReloadOutlined />} onClick={handleRefresh}>
                  刷新
                </Button>
              </Space>
            </Col>
          </Row>
        </div>

        <Divider />

        {/* 搜索表单 */}
        <Form
          form={searchForm}
          layout="inline"
          style={{ marginBottom: 16 }}
          onFinish={(values) => handleSearch(values)}
        >
          <Form.Item name="name">
            <Search
              placeholder="搜索分类名称或描述"
              allowClear
              style={{ width: 250 }}
              onSearch={(value) => handleSearch({ name: value })}
            />
          </Form.Item>
          <Form.Item name="status">
            <Select
              placeholder="选择状态"
              allowClear
              style={{ width: 120 }}
              onChange={(value) => handleSearch({ status: value })}
            >
              {CATEGORY_STATUS_OPTIONS.map((option) => (
                <Option key={option.value} value={option.value}>
                  {option.label}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="sortBy">
            <Select
              placeholder="排序字段"
              style={{ width: 120 }}
              value={queryParams.sortBy}
              onChange={(value) =>
                handleSearch({ sortBy: value, sortOrder: 'asc' })
              }
            >
              {SORT_OPTIONS.map((option) => (
                <Option key={option.value} value={option.value}>
                  {option.label}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="sortOrder">
            <Select
              style={{ width: 100 }}
              value={queryParams.sortOrder}
              onChange={(value) => handleSearch({ sortOrder: value })}
            >
              <Option value="asc">升序</Option>
              <Option value="desc">降序</Option>
            </Select>
          </Form.Item>
          <Form.Item>
            <Button onClick={handleReset}>重置</Button>
          </Form.Item>
        </Form>

        {/* 批量操作 */}
        {selectedRowKeys.length > 0 && (
          <div style={{ marginBottom: 16 }}>
            <Space>
              <span>已选择 {selectedRowKeys.length} 项</span>
              <Button
                size="small"
                onClick={() =>
                  handleBatchStatusUpdate(CategoryStatus.ENABLED)
                }
              >
                批量启用
              </Button>
              <Button
                size="small"
                onClick={() =>
                  handleBatchStatusUpdate(CategoryStatus.DISABLED)
                }
              >
                批量禁用
              </Button>
              <Button size="small" danger onClick={handleBatchDelete}>
                批量删除
              </Button>
            </Space>
          </div>
        )}

        {/* 数据表格 */}
        <Table
          columns={columns}
          dataSource={categories}
          rowKey="id"
          loading={loading.list}
          rowSelection={rowSelection}
          pagination={{
            current: pagination.currentPage,
            pageSize: pagination.size,
            total: pagination.totalElements,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `第 ${range[0]}-${range[1]} 条/共 ${total} 条`,
            pageSizeOptions: ['10', '20', '50', '100'],
          }}
          onChange={handleTableChange}
          scroll={{ x: 1200 }}
          size="middle"
        />
      </Card>
    </div>
  );
};

export default CategoryList;