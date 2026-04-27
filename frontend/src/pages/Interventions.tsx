import { Card, Row, Col, Table, Tag, Button, Space, Select } from 'antd';
import MainLayout from '../components/Layout/MainLayout';
import './Interventions.css';

interface Intervention {
  id: string;
  employeeName: string;
  type: string;
  status: 'pending' | 'active' | 'completed';
  startDate: string;
  dueDate: string;
  progress: number;
  assignedTo: string;
}

const mockInterventions: Intervention[] = [
  {
    id: 'int-001',
    employeeName: 'Alice Johnson',
    type: 'Mandatory Training',
    status: 'active',
    startDate: '2024-01-15',
    dueDate: '2024-02-15',
    progress: 65,
    assignedTo: 'John Smith',
  },
  {
    id: 'int-002',
    employeeName: 'Bob Smith',
    type: 'Personalized Coaching',
    status: 'completed',
    startDate: '2024-01-10',
    dueDate: '2024-01-31',
    progress: 100,
    assignedTo: 'Sarah Wilson',
  },
  {
    id: 'int-003',
    employeeName: 'Carol Williams',
    type: 'Performance Improvement Plan',
    status: 'active',
    startDate: '2024-01-20',
    dueDate: '2024-03-20',
    progress: 40,
    assignedTo: 'Michael Brown',
  },
  {
    id: 'int-004',
    employeeName: 'David Brown',
    type: 'Skill Development Program',
    status: 'pending',
    startDate: '2024-01-25',
    dueDate: '2024-02-25',
    progress: 0,
    assignedTo: 'Lisa Anderson',
  },
  {
    id: 'int-005',
    employeeName: 'Emma Davis',
    type: 'Leadership Program',
    status: 'active',
    startDate: '2024-02-01',
    dueDate: '2024-04-01',
    progress: 28,
    assignedTo: 'Tom Garcia',
  },
];

export default function Interventions() {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'success';
      case 'active':
        return 'processing';
      case 'pending':
        return 'error';
      default:
        return 'default';
    }
  };

  const columns = [
    {
      title: 'Employee',
      dataIndex: 'employeeName',
      key: 'employeeName',
      width: '18%',
    },
    {
      title: 'Intervention Type',
      dataIndex: 'type',
      key: 'type',
      width: '20%',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: '12%',
      render: (status: string) => (
        <Tag color={getStatusColor(status)}>
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </Tag>
      ),
    },
    {
      title: 'Assigned To',
      dataIndex: 'assignedTo',
      key: 'assignedTo',
      width: '18%',
    },
    {
      title: 'Progress',
      dataIndex: 'progress',
      key: 'progress',
      width: '10%',
      align: 'center' as const,
      render: (progress: number) => `${progress}%`,
    },
    {
      title: 'Actions',
      key: 'actions',
      width: '12%',
      align: 'center' as const,
      render: () => (
        <Space>
          <Button type="text" size="small">
            Edit
          </Button>
          <Button type="text" size="small" danger>
            Close
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <MainLayout>
      <div className="interventions-container">
        <Card className="page-title-card">
          <h1>Interventions Management</h1>
          <p>Monitor and manage all active employee interventions and support programs.</p>
        </Card>

        <Row gutter={[24, 24]} style={{ marginBottom: '24px' }}>
          <Col xs={24} sm={12} md={6}>
            <Card className="stat-card">
              <div className="stat-number">87</div>
              <div className="stat-label">Total Interventions</div>
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card className="stat-card">
              <div className="stat-number" style={{ color: '#faad14' }}>
                45
              </div>
              <div className="stat-label">In Progress</div>
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card className="stat-card">
              <div className="stat-number" style={{ color: '#2c9c69' }}>
                28
              </div>
              <div className="stat-label">Completed</div>
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card className="stat-card">
              <div className="stat-number" style={{ color: '#ff7875' }}>
                14
              </div>
              <div className="stat-label">Pending</div>
            </Card>
          </Col>
        </Row>

        <Card className="interventions-card" title="Active Interventions" bordered={false}>
          <Space direction="vertical" style={{ width: '100%', marginBottom: '16px' }}>
            <Space>
              <span>Filter by Status:</span>
              <Select
                style={{ width: '150px' }}
                defaultValue="all"
                options={[
                  { label: 'All', value: 'all' },
                  { label: 'Pending', value: 'pending' },
                  { label: 'Active', value: 'active' },
                  { label: 'Completed', value: 'completed' },
                ]}
              />
            </Space>
            <Button type="primary">+ Create Intervention</Button>
          </Space>
          <Table
            columns={columns}
            dataSource={mockInterventions}
            rowKey="id"
            pagination={{ pageSize: 10 }}
            scroll={{ x: 800 }}
          />
        </Card>
      </div>
    </MainLayout>
  );
}
