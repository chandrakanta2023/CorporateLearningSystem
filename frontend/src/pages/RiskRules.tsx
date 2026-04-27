import { Card, Row, Col, Table, Tag, Button, Space } from 'antd';
import MainLayout from '../components/Layout/MainLayout';
import './RiskRules.css';

interface RiskRule {
  id: string;
  name: string;
  description: string;
  severity: 'high' | 'medium' | 'low';
  active: boolean;
  triggersCount: number;
}

const mockRiskRules: RiskRule[] = [
  {
    id: 'rule-001',
    name: 'No Activity 30 Days',
    description: 'Employee has had no login activity for 30+ days',
    severity: 'high',
    active: true,
    triggersCount: 34,
  },
  {
    id: 'rule-002',
    name: 'Failed Assessment',
    description: 'Employee failed final assessment exam',
    severity: 'medium',
    active: true,
    triggersCount: 12,
  },
  {
    id: 'rule-003',
    name: 'Incomplete Course',
    description: 'Course enrollment expired without completion',
    severity: 'medium',
    active: true,
    triggersCount: 28,
  },
  {
    id: 'rule-004',
    name: 'Compliance Deadline',
    description: 'Mandatory training deadline in 7 days',
    severity: 'high',
    active: true,
    triggersCount: 45,
  },
  {
    id: 'rule-005',
    name: 'Performance Below Target',
    description: 'Learning performance score below 60%',
    severity: 'medium',
    active: true,
    triggersCount: 8,
  },
];

export default function RiskRules() {
  const columns = [
    {
      title: 'Rule Name',
      dataIndex: 'name',
      key: 'name',
      width: '25%',
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      width: '40%',
    },
    {
      title: 'Severity',
      dataIndex: 'severity',
      key: 'severity',
      width: '15%',
      render: (severity: string) => {
        const color = severity === 'high' ? 'red' : severity === 'medium' ? 'orange' : 'green';
        return <Tag color={color}>{severity.toUpperCase()}</Tag>;
      },
    },
    {
      title: 'Status',
      dataIndex: 'active',
      key: 'active',
      width: '10%',
      render: (active: boolean) => (
        <Tag color={active ? 'green' : 'gray'}>{active ? 'Active' : 'Inactive'}</Tag>
      ),
    },
    {
      title: 'Triggers',
      dataIndex: 'triggersCount',
      key: 'triggersCount',
      width: '10%',
      align: 'center' as const,
    },
  ];

  return (
    <MainLayout>
      <div className="risk-rules-container">
        <Card className="page-title-card">
          <h1>Risk Rules Engine</h1>
          <p>Configure and manage risk detection rules for identifying at-risk employees.</p>
        </Card>

        <Row gutter={[24, 24]} style={{ marginBottom: '24px' }}>
          <Col xs={24} sm={12} md={6}>
            <Card className="stat-card">
              <div className="stat-number">15</div>
              <div className="stat-label">Total Rules</div>
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card className="stat-card">
              <div className="stat-number" style={{ color: '#2c9c69' }}>
                {mockRiskRules.filter((r) => r.active).length}
              </div>
              <div className="stat-label">Active</div>
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card className="stat-card">
              <div className="stat-number" style={{ color: '#ff7875' }}>
                {mockRiskRules.reduce((sum, r) => sum + r.triggersCount, 0)}
              </div>
              <div className="stat-label">Total Triggers</div>
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card className="stat-card">
              <div className="stat-number" style={{ color: '#faad14' }}>
                5
              </div>
              <div className="stat-label">High Severity</div>
            </Card>
          </Col>
        </Row>

        <Card className="rules-table-card" title="Risk Rules List" bordered={false}>
          <Space direction="vertical" style={{ width: '100%', marginBottom: '16px' }}>
            <Button type="primary">+ Create New Rule</Button>
          </Space>
          <Table
            columns={columns}
            dataSource={mockRiskRules}
            rowKey="id"
            pagination={{ pageSize: 10 }}
            scroll={{ x: 600 }}
          />
        </Card>
      </div>
    </MainLayout>
  );
}
