import { useState, useEffect } from 'react';
import { Row, Col, Card, Spin } from 'antd';
import MainLayout from '../components/Layout/MainLayout';
import SummaryCard from '../components/Dashboard/SummaryCard';
import ProgressChart from '../components/Dashboard/ProgressChart';
import AtRiskTable from '../components/Dashboard/AtRiskTable';
import InterventionsList from '../components/Dashboard/InterventionsList';
import { dashboardApi } from '../services/api';
import { mockData } from '../services/mockData';
import './Dashboard.css';

interface DashboardMetrics {
  totalEmployees: number;
  atRiskCount: number;
  activeInterventions: number;
  complianceRate: number;
}

interface ProgressData {
  month: string;
  completionRate: number;
}

interface AtRiskEmployee {
  id: string;
  name: string;
  email: string;
  risk: 'high' | 'medium' | 'low';
  interventionType: string;
  enrolledCourses: number;
}

interface Intervention {
  id: string;
  employeeId: string;
  employeeName: string;
  type: string;
  startDate: string;
  status: 'pending' | 'active' | 'completed';
  progress: number;
}

export default function Dashboard() {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [progressData, setProgressData] = useState<ProgressData[]>([]);
  const [atRiskEmployees, setAtRiskEmployees] = useState<AtRiskEmployee[]>([]);
  const [recentInterventions, setRecentInterventions] = useState<Intervention[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true);
        const response = await dashboardApi.summary();
        setMetrics(response.metrics);
        setProgressData(response.progressData);
        setAtRiskEmployees(response.atRiskEmployees);
        setRecentInterventions(
          response.recentInterventions.map((item) => ({
            ...item,
            status: item.status === 'cancelled' || item.status === 'failed' ? 'pending' : item.status,
          })),
        );
      } catch (error) {
        console.error('Failed to load dashboard data:', error);
        // Fallback to local mock data so UI remains usable if backend is unavailable.
        setMetrics(mockData.getDashboardMetrics());
        setProgressData(mockData.getProgressData());
        setAtRiskEmployees(mockData.getAtRiskEmployees());
        setRecentInterventions(mockData.getRecentInterventions());
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  if (loading) {
    return (
      <MainLayout>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
          <Spin size="large" tip="Loading dashboard..." />
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="dashboard-container">
        {/* Dashboard Title */}
        <Card className="dashboard-title">
          <h1>Dashboard</h1>
          <p>Welcome back! Here's your corporate learning overview.</p>
        </Card>

        {/* Summary Cards Row */}
        {metrics && (
          <Row gutter={[24, 24]} style={{ marginBottom: '24px' }}>
            <Col xs={24} sm={12} lg={6}>
              <SummaryCard
                title="Total Employees"
                value={metrics.totalEmployees}
                prefix="👥"
                color="#0f4c81"
              />
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <SummaryCard
                title="At-Risk Learners"
                value={metrics.atRiskCount}
                prefix="⚠️"
                color="#ff7875"
              />
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <SummaryCard
                title="Active Interventions"
                value={metrics.activeInterventions}
                prefix="🎯"
                color="#faad14"
              />
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <SummaryCard
                title="Compliance Rate"
                value={`${metrics.complianceRate}%`}
                prefix="✓"
                color="#2c9c69"
              />
            </Col>
          </Row>
        )}

        {/* Charts and Tables Row */}
        <Row gutter={[24, 24]}>
          {/* Progress Chart */}
          <Col xs={24} lg={12}>
            <Card
              className="chart-card"
              title="Completion Rate Trend"
              bordered={false}
              style={{ height: '100%' }}
            >
              {progressData.length > 0 && (
                <ProgressChart data={progressData} />
              )}
            </Card>
          </Col>

          {/* At-Risk Employees Table */}
          <Col xs={24} lg={12}>
            <Card
              className="table-card"
              title="At-Risk Employees"
              bordered={false}
              style={{ height: '100%', overflow: 'hidden' }}
            >
              {atRiskEmployees.length > 0 && (
                <AtRiskTable data={atRiskEmployees} />
              )}
            </Card>
          </Col>
        </Row>

        {/* Recent Activity Section */}
        <Row gutter={[24, 24]} style={{ marginTop: '24px' }}>
          <Col xs={24}>
            <Card
              className="activity-card"
              title="Recent Interventions"
              bordered={false}
            >
              {recentInterventions.length > 0 && (
                <InterventionsList data={recentInterventions} />
              )}
            </Card>
          </Col>
        </Row>
      </div>
    </MainLayout>
  );
}
