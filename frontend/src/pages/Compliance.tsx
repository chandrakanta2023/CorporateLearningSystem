import { Card, Row, Col, Table, Tag, Button, Progress, Space } from 'antd';
import MainLayout from '../components/Layout/MainLayout';
import './Compliance.css';

interface Department {
  id: string;
  name: string;
  employeeCount: number;
  completionRate: number;
  status: 'compliant' | 'warning' | 'non-compliant';
  deadline: string;
}

const mockDepartments: Department[] = [
  {
    id: 'dept-001',
    name: 'Engineering',
    employeeCount: 245,
    completionRate: 92,
    status: 'compliant',
    deadline: '2024-12-31',
  },
  {
    id: 'dept-002',
    name: 'Sales',
    employeeCount: 320,
    completionRate: 78,
    status: 'warning',
    deadline: '2024-12-31',
  },
  {
    id: 'dept-003',
    name: 'HR',
    employeeCount: 85,
    completionRate: 100,
    status: 'compliant',
    deadline: '2024-12-31',
  },
  {
    id: 'dept-004',
    name: 'Finance',
    employeeCount: 140,
    completionRate: 88,
    status: 'compliant',
    deadline: '2024-12-31',
  },
  {
    id: 'dept-005',
    name: 'Marketing',
    employeeCount: 188,
    completionRate: 65,
    status: 'non-compliant',
    deadline: '2024-12-31',
  },
];

export default function Compliance() {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'compliant':
        return 'success';
      case 'warning':
        return 'warning';
      case 'non-compliant':
        return 'error';
      default:
        return 'default';
    }
  };

  const getProgressColor = (rate: number) => {
    if (rate >= 85) return '#2c9c69';
    if (rate >= 70) return '#faad14';
    return '#ff7875';
  };

  const columns = [
    {
      title: 'Department',
      dataIndex: 'name',
      key: 'name',
      width: '20%',
    },
    {
      title: 'Employees',
      dataIndex: 'employeeCount',
      key: 'employeeCount',
      width: '15%',
      align: 'center' as const,
    },
    {
      title: 'Completion Rate',
      dataIndex: 'completionRate',
      key: 'completionRate',
      width: '30%',
      render: (rate: number) => (
        <div>
          <Progress
            percent={rate}
            strokeColor={getProgressColor(rate)}
            size="small"
            format={(percent) => `${percent}%`}
          />
        </div>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: '15%',
      render: (status: string) => (
        <Tag color={getStatusColor(status)}>
          {status.split('-').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
        </Tag>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      width: '15%',
      align: 'center' as const,
      render: () => (
        <Space>
          <Button type="text" size="small">
            View
          </Button>
          <Button type="text" size="small">
            Report
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <MainLayout>
      <div className="compliance-container">
        <Card className="page-title-card">
          <h1>Compliance Dashboard</h1>
          <p>Track organizational compliance with mandatory training requirements and regulations.</p>
        </Card>

        <Row gutter={[24, 24]} style={{ marginBottom: '24px' }}>
          <Col xs={24} sm={12} md={6}>
            <Card className="stat-card">
              <div className="stat-number">87%</div>
              <div className="stat-label">Overall Compliance</div>
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card className="stat-card">
              <div className="stat-number" style={{ color: '#2c9c69' }}>
                3
              </div>
              <div className="stat-label">Compliant Departments</div>
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card className="stat-card">
              <div className="stat-number" style={{ color: '#faad14' }}>
                1
              </div>
              <div className="stat-label">Warning</div>
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card className="stat-card">
              <div className="stat-number" style={{ color: '#ff7875' }}>
                1
              </div>
              <div className="stat-label">Non-Compliant</div>
            </Card>
          </Col>
        </Row>

        <Card className="compliance-card" title="Department Compliance Status" bordered={false}>
          <Space direction="vertical" style={{ width: '100%', marginBottom: '16px' }}>
            <Button type="primary">📥 Export Report</Button>
          </Space>
          <Table
            columns={columns}
            dataSource={mockDepartments}
            rowKey="id"
            pagination={{ pageSize: 10 }}
            scroll={{ x: 600 }}
          />
        </Card>
      </div>
    </MainLayout>
  );
}
