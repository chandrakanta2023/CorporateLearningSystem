/**
 * Mock Data Service
 * Provides realistic sample data for dashboard and components
 * This will be replaced with actual API calls in production
 */

export interface DashboardMetrics {
  totalEmployees: number;
  atRiskCount: number;
  activeInterventions: number;
  complianceRate: number;
}

export interface ProgressData {
  month: string;
  completionRate: number;
}

export interface AtRiskEmployee {
  id: string;
  name: string;
  email: string;
  risk: 'high' | 'medium' | 'low';
  interventionType: string;
  enrolledCourses: number;
}

/**
 * Generate random integer between min and max (inclusive)
 */
function getRandomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Mock Data Service - static methods for data generation
 */
export const mockData = {
  /**
   * Get dashboard metrics summary
   */
  getDashboardMetrics(): DashboardMetrics {
    return {
      totalEmployees: 1248,
      atRiskCount: getRandomInt(45, 65),
      activeInterventions: getRandomInt(30, 50),
      complianceRate: getRandomInt(78, 92),
    };
  },

  /**
   * Get 6-month completion rate trend data
   */
  getProgressData(): ProgressData[] {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    return months.map((month, index) => ({
      month,
      completionRate: Math.min(100, getRandomInt(45 + index * 10, 85 + index * 5)),
    }));
  },

  /**
   * Get list of at-risk employees needing intervention
   */
  getAtRiskEmployees(): AtRiskEmployee[] {
    const names = [
      'Alice Johnson',
      'Bob Smith',
      'Carol Williams',
      'David Brown',
      'Emma Davis',
      'Frank Miller',
      'Grace Lee',
      'Henry Wilson',
    ];

    const interventionTypes = [
      'Mandatory Training',
      'Personalized Coaching',
      'Performance Improvement Plan',
      'Skill Development Program',
      'Leadership Program',
    ];

    const riskLevels: Array<'high' | 'medium' | 'low'> = ['high', 'medium', 'low'];

    return names.slice(0, getRandomInt(4, 6)).map((name, index) => ({
      id: `emp-${1000 + index}`,
      name,
      email: `${name.toLowerCase().replace(' ', '.')}@company.com`,
      risk: riskLevels[getRandomInt(0, 1)],
      interventionType:
        interventionTypes[getRandomInt(0, interventionTypes.length - 1)],
      enrolledCourses: getRandomInt(1, 5),
    }));
  },

  /**
   * Get statistics for different risk categories
   */
  getRiskStatistics() {
    return {
      high: getRandomInt(20, 35),
      medium: getRandomInt(35, 50),
      low: getRandomInt(40, 60),
    };
  },

  /**
   * Get course enrollment data
   */
  getCourseEnrollments() {
    return {
      total: getRandomInt(800, 1200),
      inProgress: getRandomInt(300, 500),
      completed: getRandomInt(300, 500),
      notStarted: getRandomInt(100, 300),
    };
  },

  /**
   * Get recent interventions
   */
  getRecentInterventions() {
    const interventions = [
      {
        id: 'int-001',
        employeeId: 'emp-1000',
        employeeName: 'Alice Johnson',
        type: 'Mandatory Training',
        startDate: '2024-01-15',
        status: 'active' as const,
        progress: 65,
      },
      {
        id: 'int-002',
        employeeId: 'emp-1001',
        employeeName: 'Bob Smith',
        type: 'Personalized Coaching',
        startDate: '2024-01-10',
        status: 'completed' as const,
        progress: 100,
      },
      {
        id: 'int-003',
        employeeId: 'emp-1002',
        employeeName: 'Carol Williams',
        type: 'Performance Improvement Plan',
        startDate: '2024-01-20',
        status: 'active' as const,
        progress: 40,
      },
    ];

    return interventions;
  },

  /**
   * Get department-wise statistics
   */
  getDepartmentStats() {
    return [
      { name: 'Engineering', employees: 245, atRisk: 18, compliance: 87 },
      { name: 'Sales', employees: 320, atRisk: 28, compliance: 82 },
      { name: 'HR', employees: 85, atRisk: 5, compliance: 95 },
      { name: 'Finance', employees: 140, atRisk: 8, compliance: 92 },
      { name: 'Marketing', employees: 188, atRisk: 14, compliance: 88 },
      { name: 'Operations', employees: 270, atRisk: 22, compliance: 85 },
    ];
  },
};
