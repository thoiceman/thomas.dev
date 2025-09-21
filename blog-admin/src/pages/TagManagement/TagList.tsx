import React, { useEffect, useState } from 'react';
import {
  Table,
  Button,
  Space,
  Tag as AntTag,
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
  ColorPicker,
} from 'antd';
import type { ColumnsType, TablePaginationConfig } from 'antd/es/table';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  ReloadOutlined,
  SearchOutlined,
  TagOutlined,
  FireOutlined,
} from '@ant-design/icons';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import {
  fetchTags,
  deleteTag,
  batchDeleteTags,
  fetchPopularTags,
  fetchTagStats,
} from '../../store/slices/tagSlice';
import type {
  Tag,
  TagQueryParams,
} from '../../types/tag';
import { 
  TAG_SORT_OPTIONS,
  DEFAULT_TAG_COLORS,
} from '../../types/tag';

const { Search } = Input;
const { Title } = Typography;

interface TagListProps {
  onEdit?: (tag: Tag) => void;
  onAdd?: () => void;
}

const TagList: React.FC<TagListProps> = ({ onEdit, onAdd }) => {
  const dispatch = useAppDispatch();
  const { 
    tags, 
    pagination, 
    loading, 
    error, 
    queryParams,
    popularTags,
    stats 
  } = useAppSelector(state => state.tag);

  // 本地状态
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [searchForm] = Form.useForm();
  const [usageModalVisible, setUsageModalVisible] = useState(false);
  const [selectedTag, setSelectedTag] = useState<Tag | null>(null);

  // 初始化数据
  useEffect(() => {
    handleRefresh();
    dispatch(fetchPopularTags(5));
    dispatch(fetchTagStats());
  }, [dispatch]);

  // 监听查询参数变化
  useEffect(() => {
    dispatch(fetchTags(queryParams));
  }, [dispatch, queryParams]);

  // 刷新数据
  const handleRefresh = () => {
    dispatch(fetchTags(queryParams));
  };

  // 搜索处理
  const handleSearch = (values: any) => {
    const newParams: TagQueryParams = {
      ...queryParams,
      page: 1,
      name: values.name?.trim() || undefined,
    };
    dispatch(fetchTags(newParams));
  };

  // 重置搜索
  const handleResetSearch = () => {
    searchForm.resetFields();
    const newParams: TagQueryParams = {
      page: 1,
      size: queryParams.size,
      sortBy: 'createTime',
      sortOrder: 'desc',
    };
    dispatch(fetchTags(newParams));
  };

  // 删除标签
  const handleDelete = async (id: number) => {
    try {
      await dispatch(deleteTag(id)).unwrap();
      message.success('删除成功');
      setSelectedRowKeys(selectedRowKeys.filter(key => key !== id));
    } catch (error: any) {
      message.error(error || '删除失败');
    }
  };

  // 批量删除
  const handleBatchDelete = async () => {
    if (selectedRowKeys.length === 0) {
      message.warning('请选择要删除的标签');
      return;
    }

    try {
      await dispatch(batchDeleteTags(selectedRowKeys as number[])).unwrap();
      message.success(`成功删除 ${selectedRowKeys.length} 个标签`);
      setSelectedRowKeys([]);
    } catch (error: any) {
      message.error(error || '批量删除失败');
    }
  };

  // 查看标签使用情况
  const handleViewUsage = (tag: Tag) => {
    setSelectedTag(tag);
    setUsageModalVisible(true);
  };

  // 表格列定义
  const columns: ColumnsType<Tag> = [
    {
      title: '标签名称',
      dataIndex: 'name',
      key: 'name',
      width: 200,
      render: (text: string, record: Tag) => (
        <Space>
          <AntTag 
            color={record.color || DEFAULT_TAG_COLORS[0]}
            style={{ margin: 0 }}
          >
            <TagOutlined style={{ marginRight: 4 }} />
            {text}
          </AntTag>
        </Space>
      ),
    },
    {
      title: '标签别名',
      dataIndex: 'slug',
      key: 'slug',
      width: 150,
      render: (text: string) => (
        <code style={{ 
          background: '#f5f5f5', 
          padding: '2px 6px', 
          borderRadius: '4px',
          fontSize: '12px'
        }}>
          {text}
        </code>
      ),
    },
    {
      title: '颜色',
      dataIndex: 'color',
      key: 'color',
      width: 100,
      align: 'center',
      render: (color: string) => (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div
            style={{
              width: 20,
              height: 20,
              backgroundColor: color || DEFAULT_TAG_COLORS[0],
              borderRadius: '50%',
              border: '1px solid #d9d9d9',
            }}
          />
          <span style={{ marginLeft: 8, fontSize: '12px', color: '#666' }}>
            {color || DEFAULT_TAG_COLORS[0]}
          </span>
        </div>
      ),
    },
    {
      title: '使用次数',
      dataIndex: 'useCount',
      key: 'useCount',
      width: 120,
      align: 'center',
      sorter: true,
      render: (count: number) => (
        <Badge 
          count={count} 
          showZero 
          style={{ backgroundColor: count > 0 ? '#52c41a' : '#d9d9d9' }}
        />
      ),
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
      width: 180,
      sorter: true,
      render: (text: string) => (
        <span style={{ fontSize: '12px' }}>
          {new Date(text).toLocaleString()}
        </span>
      ),
    },
    {
      title: '更新时间',
      dataIndex: 'updateTime',
      key: 'updateTime',
      width: 180,
      sorter: true,
      render: (text: string) => (
        <span style={{ fontSize: '12px' }}>
          {new Date(text).toLocaleString()}
        </span>
      ),
    },
    {
      title: '操作',
      key: 'action',
      width: 200,
      fixed: 'right',
      render: (_, record: Tag) => (
        <Space size="small">
          <Tooltip title="查看使用情况">
            <Button
              type="text"
              size="small"
              icon={<EyeOutlined />}
              onClick={() => handleViewUsage(record)}
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
            title="确定要删除这个标签吗？"
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

  // 表格分页配置
  const paginationConfig: TablePaginationConfig = {
    current: pagination.currentPage,
    pageSize: pagination.size,
    total: pagination.totalElements,
    showSizeChanger: true,
    showQuickJumper: true,
    showTotal: (total, range) => `第 ${range[0]}-${range[1]} 条，共 ${total} 条`,
    onChange: (page, size) => {
      const newParams = { ...queryParams, page, size };
      dispatch(fetchTags(newParams));
    },
  };

  // 行选择配置
  const rowSelection = {
    selectedRowKeys,
    onChange: (newSelectedRowKeys: React.Key[]) => {
      setSelectedRowKeys(newSelectedRowKeys);
    },
    getCheckboxProps: (record: Tag) => ({
      name: record.name,
    }),
  };

  return (
    <div>
      <Card>
        <div style={{ marginBottom: 16 }}>
          <Row justify="space-between" align="middle">
            <Col>
              <Title level={4} style={{ margin: 0 }}>
                标签管理
              </Title>
            </Col>
            <Col>
              <Space>
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={onAdd}
                >
                  新增标签
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
                  <div style={{ color: '#666' }}>总标签数</div>
                </div>
              </Card>
            </Col>
            <Col span={6}>
              <Card size="small">
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#52c41a' }}>
                    {stats.totalUseCount}
                  </div>
                  <div style={{ color: '#666' }}>总使用次数</div>
                </div>
              </Card>
            </Col>
            <Col span={6}>
              <Card size="small">
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#faad14' }}>
                    {stats.averageUseCount.toFixed(1)}
                  </div>
                  <div style={{ color: '#666' }}>平均使用次数</div>
                </div>
              </Card>
            </Col>
            <Col span={6}>
              <Card size="small">
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#f5222d' }}>
                    <FireOutlined style={{ marginRight: 4 }} />
                    {stats.mostUsedTag?.name || '暂无'}
                  </div>
                  <div style={{ color: '#666' }}>最热门标签</div>
                </div>
              </Card>
            </Col>
          </Row>
        )}

        {/* 搜索表单 */}
        <Card size="small" style={{ marginBottom: 16 }}>
          <Form
            form={searchForm}
            layout="inline"
            onFinish={handleSearch}
            style={{ marginBottom: 0 }}
          >
            <Form.Item name="name" style={{ marginBottom: 0 }}>
              <Input
                placeholder="搜索标签名称"
                prefix={<SearchOutlined />}
                style={{ width: 200 }}
                allowClear
              />
            </Form.Item>
            <Form.Item style={{ marginBottom: 0 }}>
              <Space>
                <Button type="primary" htmlType="submit">
                  搜索
                </Button>
                <Button onClick={handleResetSearch}>
                  重置
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </Card>

        {/* 批量操作 */}
        {selectedRowKeys.length > 0 && (
          <div style={{ marginBottom: 16 }}>
            <Space>
              <span>已选择 {selectedRowKeys.length} 项</span>
              <Popconfirm
                title={`确定要删除选中的 ${selectedRowKeys.length} 个标签吗？`}
                description="删除后不可恢复，请谨慎操作。"
                onConfirm={handleBatchDelete}
                okText="确定"
                cancelText="取消"
              >
                <Button danger>批量删除</Button>
              </Popconfirm>
              <Button onClick={() => setSelectedRowKeys([])}>取消选择</Button>
            </Space>
          </div>
        )}

        {/* 标签表格 */}
        <Table
          columns={columns}
          dataSource={tags}
          rowKey="id"
          loading={loading.list}
          pagination={paginationConfig}
          rowSelection={rowSelection}
          scroll={{ x: 1200 }}
          size="small"
        />
      </Card>

      {/* 标签使用情况弹窗 */}
      <Modal
        title={
          <Space>
            <TagOutlined />
            标签使用情况
            {selectedTag && (
              <AntTag color={selectedTag.color}>
                {selectedTag.name}
              </AntTag>
            )}
          </Space>
        }
        open={usageModalVisible}
        onCancel={() => setUsageModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setUsageModalVisible(false)}>
            关闭
          </Button>
        ]}
        width={600}
      >
        {selectedTag && (
          <div>
            <p><strong>标签别名：</strong>{selectedTag.slug}</p>
            <p><strong>使用次数：</strong>{selectedTag.useCount}</p>
            <p><strong>创建时间：</strong>{new Date(selectedTag.createTime).toLocaleString()}</p>
            <p><strong>更新时间：</strong>{new Date(selectedTag.updateTime).toLocaleString()}</p>
            <Divider />
            <p style={{ color: '#666' }}>
              详细的文章使用情况需要后端API支持，这里仅显示基本信息。
            </p>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default TagList;