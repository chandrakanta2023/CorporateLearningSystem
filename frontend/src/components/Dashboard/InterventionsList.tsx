import { List, Tag, Space, Button, Progress } from 'antd';
import { CheckCircleOutlined, ClockCircleOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import './InterventionsList.css';

interface Intervention {
  id: string;
  employeeId: string;
  employeeName: string;
  type: string;
  startDate: string;
  status: 'pending' | 'active' | 'completed';
  progress: number;
}

interface InterventionsListProps {
  data: Intervention[];
}

export default function InterventionsList({ data }: InterventionsListProps) {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircleOutlined style={{ color: '#2c9c69' }} />;
      case 'active':
        return <ClockCircleOutlined style={{ color: '#faad14' }} />;
      case 'pending':
        return <ExclamationCircleOutlined style={{ color: '#ff7875' }} />;
      default:
        return null;
    }
  };

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

  const getProgressColor = (status: string) => {
    switch (status) {
      case 'completed':
        return '#2c9c69';
      case 'active':
        return '#0f4c81';
      case 'pending':
        return '#999';
      default:
        return '#0f4c81';
    }
  };

  return (
    <List
      className="interventions-list"
      dataSource={data}
      renderItem={(item) => (
        <List.Item className="intervention-item">
          <List.Item.Meta
            avatar={getStatusIcon(item.status)}
            title={
              <div className="intervention-title">
                <span>{item.employeeName}</span>
                <Tag
                  icon={getStatusIcon(item.status)}
                  color={getStatusColor(item.status)}
                  style={{ marginLeft: '12px' }}
                >
                  {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                </Tag>
              </div>
            }
            description={
              <div className="intervention-description">
                <p className="intervention-type">{item.type}</p>
                <p className="intervention-date">
                  Started: {new Date(item.startDate).toLocaleDateString()}
                </p>
                <Progress
                  percent={item.progress}
                  strokeColor={getProgressColor(item.status)}
                  size="small"
                  style={{ marginTop: '8px', marginBottom: '0' }}
                />
              </div>
            }
          />
          <div className="intervention-actions">
            <Space>
              {item.status !== 'completed' && (
                <Button type="primary" size="small" ghost>
                  Update
                </Button>
              )}
              <Button type="text" size="small">
                Details
              </Button>
            </Space>
          </div>
        </List.Item>
      )}
    />
  );
}
