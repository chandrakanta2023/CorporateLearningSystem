import { Table, Tag } from 'antd';
import { FileTextOutlined, MailOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import './AtRiskTable.css';

interface AtRiskEmployee {
  id: string;
  name: string;
  email: string;
  risk: 'high' | 'medium' | 'low';
  interventionType: string;
  enrolledCourses: number;
}

interface AtRiskTableProps {
  data: AtRiskEmployee[];
}

export default function AtRiskTable({ data }: AtRiskTableProps) {
  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'high':
        return 'red';
      case 'medium':
        return 'orange';
      case 'low':
        return 'green';
      default:
        return 'blue';
    }
  };

  const columns: ColumnsType<AtRiskEmployee> = [
    {
      title: 'Employee',
      dataIndex: 'name',
      key: 'name',
      width: '20%',
      render: (text: string) => (
        <span style={{ fontWeight: 500, color: '#333' }}>{text}</span>
      ),
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      width: '25%',
      render: (text: string) => (
        <span style={{ fontSize: '12px', color: '#999' }}>
          <MailOutlined style={{ marginRight: '4px' }} />
          {text}
        </span>
      ),
    },
    {
      title: 'Risk Level',
      dataIndex: 'risk',
      key: 'risk',
      width: '15%',
      render: (risk: string) => (
        <Tag color={getRiskColor(risk)} style={{ textTransform: 'capitalize' }}>
          {risk}
        </Tag>
      ),
    },
    {
      title: 'Intervention',
      dataIndex: 'interventionType',
      key: 'interventionType',
      width: '25%',
      render: (text: string) => (
        <span style={{ fontSize: '12px' }}>
          <FileTextOutlined style={{ marginRight: '4px', color: '#0f4c81' }} />
          {text}
        </span>
      ),
    },
    {
      title: 'Courses',
      dataIndex: 'enrolledCourses',
      key: 'enrolledCourses',
      width: '15%',
      align: 'center' as const,
      render: (count: number) => (
        <span style={{ fontWeight: 600, color: '#2c9c69' }}>{count}</span>
      ),
    },
  ];

  return (
    <Table
      className="at-risk-table"
      columns={columns}
      dataSource={data}
      rowKey="id"
      pagination={{
        pageSize: 5,
        showSizeChanger: false,
        showQuickJumper: false,
      }}
      size="small"
      bordered={false}
      scroll={{ x: 600 }}
    />
  );
}
