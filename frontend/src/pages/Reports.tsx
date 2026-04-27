import { Card, Row, Col, Button, List, Tag, Empty } from 'antd';
import { FileExcelOutlined, FilePdfOutlined, DownloadOutlined } from '@ant-design/icons';
import MainLayout from '../components/Layout/MainLayout';
import './Reports.css';

interface Report {
  id: string;
  name: string;
  description: string;
  type: 'excel' | 'pdf';
  generatedDate: string;
  size: string;
}

const mockReports: Report[] = [
  {
    id: 'rpt-001',
    name: 'Monthly Compliance Report',
    description: 'Compliance status and metrics for current month',
    type: 'pdf',
    generatedDate: '2024-02-28',
    size: '2.3 MB',
  },
  {
    id: 'rpt-002',
    name: 'Intervention Performance Summary',
    description: 'Summary of all active interventions and their outcomes',
    type: 'excel',
    generatedDate: '2024-02-27',
    size: '1.8 MB',
  },
  {
    id: 'rpt-003',
    name: 'Department Analytics',
    description: 'Detailed analytics by department and manager',
    type: 'excel',
    generatedDate: '2024-02-26',
    size: '3.1 MB',
  },
  {
    id: 'rpt-004',
    name: 'Risk Assessment Report',
    description: 'Identified at-risk employees and recommended interventions',
    type: 'pdf',
    generatedDate: '2024-02-25',
    size: '1.5 MB',
  },
];

export default function Reports() {
  const getFileIcon = (type: string) => {
    return type === 'pdf' ? <FilePdfOutlined /> : <FileExcelOutlined />;
  };

  const getTypeColor = (type: string) => {
    return type === 'pdf' ? 'red' : 'green';
  };

  return (
    <MainLayout>
      <div className="reports-container">
        <Card className="page-title-card">
          <h1>Reports & Analytics</h1>
          <p>Generate, view, and download comprehensive reports on learning progress and compliance.</p>
        </Card>

        <Row gutter={[24, 24]} style={{ marginBottom: '24px' }}>
          <Col xs={24} sm={12} md={6}>
            <Card className="action-card">
              <div className="action-icon">📊</div>
              <div className="action-label">Create Compliance Report</div>
              <Button type="primary" block style={{ marginTop: '12px' }}>
                Generate
              </Button>
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card className="action-card">
              <div className="action-icon">📈</div>
              <div className="action-label">Learning Analytics</div>
              <Button type="primary" block style={{ marginTop: '12px' }}>
                View
              </Button>
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card className="action-card">
              <div className="action-icon">⚠️</div>
              <div className="action-label">At-Risk Summary</div>
              <Button type="primary" block style={{ marginTop: '12px' }}>
                Export
              </Button>
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card className="action-card">
              <div className="action-icon">✓</div>
              <div className="action-label">Audit Trail</div>
              <Button type="primary" block style={{ marginTop: '12px' }}>
                View
              </Button>
            </Card>
          </Col>
        </Row>

        <Card className="reports-card" title="Recent Reports" bordered={false}>
          {mockReports.length > 0 ? (
            <List
              dataSource={mockReports}
              renderItem={(report) => (
                <List.Item
                  className="report-item"
                  extra={
                    <Button type="text" icon={<DownloadOutlined />}>
                      Download
                    </Button>
                  }
                >
                  <List.Item.Meta
                    avatar={
                      <div className="report-icon" style={{ color: getTypeColor(report.type) }}>
                        {getFileIcon(report.type)}
                      </div>
                    }
                    title={
                      <div>
                        <span>{report.name}</span>
                        <Tag
                          color={getTypeColor(report.type)}
                          style={{ marginLeft: '8px' }}
                        >
                          {report.type.toUpperCase()}
                        </Tag>
                      </div>
                    }
                    description={
                      <div>
                        <p>{report.description}</p>
                        <span className="report-meta">
                          Generated: {new Date(report.generatedDate).toLocaleDateString()} • Size: {report.size}
                        </span>
                      </div>
                    }
                  />
                </List.Item>
              )}
            />
          ) : (
            <Empty description="No reports available" />
          )}
        </Card>
      </div>
    </MainLayout>
  );
}
