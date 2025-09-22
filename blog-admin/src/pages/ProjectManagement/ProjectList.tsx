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
  Image,
  Switch,
} from 'antd';
import type { ColumnsType, TablePaginationConfig } from 'antd/es/table';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  ReloadOutlined,
  SearchOutlined,
  ProjectOutlined,
  GithubOutlined,
  LinkOutlined,
  DownloadOutlined,
  StarOutlined,
  CodeOutlined,
} from '@ant-design/icons';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import {
  fetchProjects,
  deleteProject,
  batchDeleteProjects,
  fetchProjectStats,
} from '../../store/slices/projectSlice';
import type {
  Project,
  ProjectQueryParams,
  ProjectStatus,
  ProjectType,
} from '../../types/project';
import { 
  PROJECT_STATUS_OPTIONS,
  PROJECT_TYPE_OPTIONS,
  PROJECT_SORT_OPTIONS,
  DEFAULT_PROJECT_QUERY_PARAMS,
} from '../../types/project';

const { Search } = Input;
const { Title } = Typography;
const { Option } = Select;
const { RangePicker } = DatePicker;

interface ProjectListProps {
  onEdit?: (project: Project) => void;
  onAdd?: () => void;
}

const ProjectList: React.FC<ProjectListProps> = ({ onEdit, onAdd }) => {
  const dispatch = useAppDispatch();
  const { 
    projects, 
    pagination, 
    loading, 
    error, 
    queryParams,
    stats 
  } = useAppSelector(state => state.project);

  // 本地状态
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [searchForm] = Form.useForm();
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  // 初始化数据
  useEffect(() => {
    handleRefresh();
    dispatch(fetchProjectStats());
  }, [dispatch]);

  // 监听查询参数变化
  useEffect(() => {
    dispatch(fetchProjects(queryParams));
  }, [dispatch, queryParams]);

  // 刷新数据
  const handleRefresh = () => {
    dispatch(fetchProjects(queryParams));
  };

  // 搜索处理
  const handleSearch = (values: any) => {
    const newParams: ProjectQueryParams = {
      ...queryParams,
      page: 1,
      name: values.name?.trim() || undefined,
      projectType: values.projectType || undefined,
      status: values.status !== undefined ? values.status : undefined,
      isFeatured: values.isFeatured,
      isOpenSource: values.isOpenSource,
      startDate: values.dateRange?.[0]?.format('YYYY-MM-DD') || undefined,
      endDate: values.dateRange?.[1]?.format('YYYY-MM-DD') || undefined,
    };
    dispatch(fetchProjects(newParams));
  };

  // 重置搜索
  const handleResetSearch = () => {
    searchForm.resetFields();
    dispatch(fetchProjects(DEFAULT_PROJECT_QUERY_PARAMS));
  };

  // 删除项目
  const handleDelete = async (id: number) => {
    try {
      await dispatch(deleteProject(id)).unwrap();
      message.success('删除成功');
      setSelectedRowKeys(selectedRowKeys.filter(key => key !== id));
    } catch (error: any) {
      message.error(error || '删除失败');
    }
  };

  // 批量删除
  const handleBatchDelete = async () => {
    if (selectedRowKeys.length === 0) {
      message.warning('请选择要删除的项目');
      return;
    }

    try {
      await dispatch(batchDeleteProjects(selectedRowKeys as number[])).unwrap();
      message.success(`成功删除 ${selectedRowKeys.length} 个项目`);
      setSelectedRowKeys([]);
    } catch (error: any) {
      message.error(error || '批量删除失败');
    }
  };

  // 查看项目详情
  const handleViewDetail = (project: Project) => {
    setSelectedProject(project);
    setDetailModalVisible(true);
  };

  // 获取状态配置
  const getStatusConfig = (status: ProjectStatus) => {
    return PROJECT_STATUS_OPTIONS.find(option => option.value === status) || PROJECT_STATUS_OPTIONS[0];
  };

  // 获取项目类型配置
  const getTypeConfig = (type: ProjectType) => {
    return PROJECT_TYPE_OPTIONS.find(option => option.value === type) || PROJECT_TYPE_OPTIONS[0];
  };

  // 表格列定义
  const columns: ColumnsType<Project> = [
    {
      title: '项目信息',
      key: 'projectInfo',
      width: 300,
      render: (_, record: Project) => (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          {record.coverImage && (
            <Image
              src={record.coverImage}
              alt={record.name}
              width={60}
              height={40}
              style={{ 
                borderRadius: '4px', 
                marginRight: '12px',
                objectFit: 'cover'
              }}
              preview={false}
            />
          )}
          <div>
            <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>
              <ProjectOutlined style={{ marginRight: '4px', color: '#1890ff' }} />
              {record.name}
            </div>
            <div style={{ fontSize: '12px', color: '#666' }}>
              {record.description || '暂无描述'}
            </div>
            <div style={{ fontSize: '12px', color: '#999', marginTop: '2px' }}>
              <code>{record.slug}</code>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: '项目类型',
      dataIndex: 'projectType',
      key: 'projectType',
      width: 120,
      align: 'center',
      render: (type: ProjectType) => {
        const config = getTypeConfig(type);
        return (
          <Tag color="blue">
            <span style={{ marginRight: '4px' }}>{config.icon}</span>
            {config.label.replace(/^[🌐📱💻📚🔧🎮📦]\s*/, '')}
          </Tag>
        );
      },
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      align: 'center',
      render: (status: ProjectStatus) => {
        const config = getStatusConfig(status);
        return (
          <Tag color={config.color}>
            {config.label}
          </Tag>
        );
      },
    },
    {
      title: '技术栈',
      dataIndex: 'techStack',
      key: 'techStack',
      width: 200,
      render: (techStack: string[]) => (
        <div>
          {techStack?.slice(0, 3).map((tech, index) => (
            <Tag key={index} style={{ marginBottom: '2px', fontSize: '12px' }}>
              {tech}
            </Tag>
          ))}
          {techStack?.length > 3 && (
            <Tag color="default" style={{ fontSize: '12px' }}>
              +{techStack.length - 3}
            </Tag>
          )}
        </div>
      ),
    },
    {
      title: '特性',
      key: 'features',
      width: 150,
      align: 'center',
      render: (_, record: Project) => (
        <Space>
          {record.isFeatured && (
            <Tooltip title="精选项目">
              <StarOutlined style={{ color: '#faad14' }} />
            </Tooltip>
          )}
          {record.isOpenSource && (
            <Tooltip title="开源项目">
              <CodeOutlined style={{ color: '#52c41a' }} />
            </Tooltip>
          )}
        </Space>
      ),
    },
    {
      title: '链接',
      key: 'links',
      width: 120,
      align: 'center',
      render: (_, record: Project) => (
        <Space>
          {record.demoUrl && (
            <Tooltip title="演示地址">
              <Button
                type="text"
                size="small"
                icon={<LinkOutlined />}
                onClick={() => window.open(record.demoUrl, '_blank')}
              />
            </Tooltip>
          )}
          {record.githubUrl && (
            <Tooltip title="GitHub">
              <Button
                type="text"
                size="small"
                icon={<GithubOutlined />}
                onClick={() => window.open(record.githubUrl, '_blank')}
              />
            </Tooltip>
          )}
          {record.downloadUrl && (
            <Tooltip title="下载地址">
              <Button
                type="text"
                size="small"
                icon={<DownloadOutlined />}
                onClick={() => window.open(record.downloadUrl, '_blank')}
              />
            </Tooltip>
          )}
        </Space>
      ),
    },
    {
      title: '排序权重',
      dataIndex: 'sortOrder',
      key: 'sortOrder',
      width: 100,
      align: 'center',
      sorter: true,
      render: (sortOrder: number) => (
        <Badge 
          count={sortOrder} 
          showZero 
          style={{ backgroundColor: '#1890ff' }}
        />
      ),
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
      width: 150,
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
      render: (_, record: Project) => (
        <Space size="small">
          <Tooltip title="查看详情">
            <Button
              type="text"
              size="small"
              icon={<EyeOutlined />}
              onClick={() => handleViewDetail(record)}
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
            title="确定要删除这个项目吗？"
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
      dispatch(fetchProjects(newParams));
    },
  };

  // 行选择配置
  const rowSelection = {
    selectedRowKeys,
    onChange: (newSelectedRowKeys: React.Key[]) => {
      setSelectedRowKeys(newSelectedRowKeys);
    },
    getCheckboxProps: (record: Project) => ({
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
                项目管理
              </Title>
            </Col>
            <Col>
              <Space>
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={onAdd}
                >
                  新增项目
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
                  <div style={{ color: '#666' }}>总项目数</div>
                </div>
              </Card>
            </Col>
            <Col span={6}>
              <Card size="small">
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#faad14' }}>
                    {stats.featuredCount}
                  </div>
                  <div style={{ color: '#666' }}>精选项目</div>
                </div>
              </Card>
            </Col>
            <Col span={6}>
              <Card size="small">
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#52c41a' }}>
                    {stats.openSourceCount}
                  </div>
                  <div style={{ color: '#666' }}>开源项目</div>
                </div>
              </Card>
            </Col>
            <Col span={6}>
              <Card size="small">
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#722ed1' }}>
                    {stats.thisYearCount}
                  </div>
                  <div style={{ color: '#666' }}>今年新增</div>
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
            <Form.Item name="name" style={{ marginBottom: 8 }}>
              <Input
                placeholder="搜索项目名称"
                allowClear
                style={{ width: 200 }}
              />
            </Form.Item>
            <Form.Item name="projectType" style={{ marginBottom: 8 }}>
              <Select
                placeholder="项目类型"
                allowClear
                style={{ width: 150 }}
              >
                {PROJECT_TYPE_OPTIONS.map(option => (
                  <Option key={option.value} value={option.value}>
                    <span style={{ marginRight: '4px' }}>{option.icon}</span>
                    {option.label.replace(/^[🌐📱💻📚🔧🎮📦]\s*/, '')}
                  </Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item name="status" style={{ marginBottom: 8 }}>
              <Select
                placeholder="项目状态"
                allowClear
                style={{ width: 120 }}
              >
                {PROJECT_STATUS_OPTIONS.map(option => (
                  <Option key={option.value} value={option.value}>
                    {option.label}
                  </Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item name="isFeatured" style={{ marginBottom: 8 }}>
              <Select
                placeholder="是否精选"
                allowClear
                style={{ width: 100 }}
              >
                <Option value={true}>精选</Option>
                <Option value={false}>普通</Option>
              </Select>
            </Form.Item>
            <Form.Item name="isOpenSource" style={{ marginBottom: 8 }}>
              <Select
                placeholder="是否开源"
                allowClear
                style={{ width: 100 }}
              >
                <Option value={true}>开源</Option>
                <Option value={false}>闭源</Option>
              </Select>
            </Form.Item>
            <Form.Item name="dateRange" style={{ marginBottom: 8 }}>
              <RangePicker
                placeholder={['开始日期', '结束日期']}
                style={{ width: 240 }}
              />
            </Form.Item>
            <Form.Item style={{ marginBottom: 8 }}>
              <Space>
                <Button type="primary" htmlType="submit" icon={<SearchOutlined />}>
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
                title={`确定要删除选中的 ${selectedRowKeys.length} 个项目吗？`}
                description="删除后不可恢复，请谨慎操作。"
                onConfirm={handleBatchDelete}
                okText="确定"
                cancelText="取消"
              >
                <Button danger size="small">
                  批量删除
                </Button>
              </Popconfirm>
              <Button 
                size="small" 
                onClick={() => setSelectedRowKeys([])}
              >
                取消选择
              </Button>
            </Space>
          </div>
        )}

        {/* 项目表格 */}
        <Table
          columns={columns}
          dataSource={projects}
          rowKey="id"
          loading={loading.list}
          pagination={paginationConfig}
          rowSelection={rowSelection}
          scroll={{ x: 1400 }}
          size="small"
        />
      </Card>

      {/* 项目详情弹窗 */}
      <Modal
        title="项目详情"
        open={detailModalVisible}
        onCancel={() => setDetailModalVisible(false)}
        footer={null}
        width={800}
      >
        {selectedProject && (
          <div>
            <Row gutter={16}>
              <Col span={8}>
                {selectedProject.coverImage && (
                  <Image
                    src={selectedProject.coverImage}
                    alt={selectedProject.name}
                    width="100%"
                    style={{ borderRadius: '8px' }}
                  />
                )}
              </Col>
              <Col span={16}>
                <Title level={4}>{selectedProject.name}</Title>
                <p style={{ color: '#666' }}>{selectedProject.description}</p>
                
                <Divider />
                
                <Row gutter={[16, 8]}>
                  <Col span={12}>
                    <strong>项目类型：</strong>
                    <Tag color="blue">
                      {getTypeConfig(selectedProject.projectType!).label}
                    </Tag>
                  </Col>
                  <Col span={12}>
                    <strong>状态：</strong>
                    <Tag color={getStatusConfig(selectedProject.status).color}>
                      {getStatusConfig(selectedProject.status).label}
                    </Tag>
                  </Col>
                  <Col span={12}>
                    <strong>是否精选：</strong>
                    <Switch checked={selectedProject.isFeatured} disabled />
                  </Col>
                  <Col span={12}>
                    <strong>是否开源：</strong>
                    <Switch checked={selectedProject.isOpenSource} disabled />
                  </Col>
                  {selectedProject.startDate && (
                    <Col span={12}>
                      <strong>开始日期：</strong>
                      {selectedProject.startDate}
                    </Col>
                  )}
                  {selectedProject.endDate && (
                    <Col span={12}>
                      <strong>结束日期：</strong>
                      {selectedProject.endDate}
                    </Col>
                  )}
                </Row>

                {selectedProject.techStack && selectedProject.techStack.length > 0 && (
                  <>
                    <Divider />
                    <div>
                      <strong>技术栈：</strong>
                      <div style={{ marginTop: '8px' }}>
                        {selectedProject.techStack.map((tech, index) => (
                          <Tag key={index} style={{ marginBottom: '4px' }}>
                            {tech}
                          </Tag>
                        ))}
                      </div>
                    </div>
                  </>
                )}

                {selectedProject.features && selectedProject.features.length > 0 && (
                  <>
                    <Divider />
                    <div>
                      <strong>主要功能：</strong>
                      <ul style={{ marginTop: '8px' }}>
                        {selectedProject.features.map((feature, index) => (
                          <li key={index}>{feature}</li>
                        ))}
                      </ul>
                    </div>
                  </>
                )}

                <Divider />
                <Space>
                  {selectedProject.demoUrl && (
                    <Button 
                      type="primary" 
                      icon={<LinkOutlined />}
                      onClick={() => window.open(selectedProject.demoUrl, '_blank')}
                    >
                      查看演示
                    </Button>
                  )}
                  {selectedProject.githubUrl && (
                    <Button 
                      icon={<GithubOutlined />}
                      onClick={() => window.open(selectedProject.githubUrl, '_blank')}
                    >
                      GitHub
                    </Button>
                  )}
                  {selectedProject.downloadUrl && (
                    <Button 
                      icon={<DownloadOutlined />}
                      onClick={() => window.open(selectedProject.downloadUrl, '_blank')}
                    >
                      下载
                    </Button>
                  )}
                </Space>
              </Col>
            </Row>

            {selectedProject.content && (
              <>
                <Divider />
                <div>
                  <strong>项目介绍：</strong>
                  <div 
                    style={{ 
                      marginTop: '8px', 
                      padding: '12px', 
                      background: '#f5f5f5', 
                      borderRadius: '4px',
                      whiteSpace: 'pre-wrap'
                    }}
                  >
                    {selectedProject.content}
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default ProjectList;