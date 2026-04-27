import { Card } from 'antd';
import { ArrowUpOutlined } from '@ant-design/icons';
import './SummaryCard.css';

interface SummaryCardProps {
  title: string;
  value: string | number;
  prefix?: string;
  color?: string;
  trend?: number;
}

export default function SummaryCard({
  title,
  value,
  prefix = '',
  color = '#0f4c81',
  trend,
}: SummaryCardProps) {
  return (
    <Card className="summary-card" style={{ borderTop: `4px solid ${color}` }}>
      <div className="summary-card-content">
        <div className="summary-card-header">
          <span className="summary-card-title">{title}</span>
          {prefix && <span className="summary-card-prefix">{prefix}</span>}
        </div>
        <div className="summary-card-value" style={{ color }}>
          {value}
        </div>
        {trend !== undefined && (
          <div className="summary-card-trend">
            <ArrowUpOutlined
              style={{
                color: trend >= 0 ? '#2c9c69' : '#ff7875',
                marginRight: '4px',
              }}
            />
            <span style={{ color: trend >= 0 ? '#2c9c69' : '#ff7875' }}>
              {Math.abs(trend)}% vs last month
            </span>
          </div>
        )}
      </div>
    </Card>
  );
}
