import axios from 'axios';

const backendBaseUrl =
  import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, '') || 'http://localhost:3000';

const api = axios.create({
  baseURL: `${backendBaseUrl}/api/v1`,
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export interface HealthResponse {
  status: string;
  timestamp: number;
  uptime: number;
  environment: string;
  version: string;
  database?: {
    status: string;
    type: string;
    message: string;
  };
}

export interface DashboardSummaryResponse {
  metrics: {
    totalEmployees: number;
    atRiskCount: number;
    activeInterventions: number;
    complianceRate: number;
  };
  progressData: Array<{ month: string; completionRate: number }>;
  atRiskEmployees: Array<{
    id: string;
    name: string;
    email: string;
    risk: 'high' | 'medium' | 'low';
    interventionType: string;
    enrolledCourses: number;
  }>;
  recentInterventions: Array<{
    id: string;
    employeeId: string;
    employeeName: string;
    type: string;
    startDate: string;
    status: 'pending' | 'active' | 'completed' | 'cancelled' | 'failed';
    progress: number;
  }>;
  generatedAt: string;
}

export interface RiskRuleResponse {
  id: string;
  name: string;
  description: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  definition: Record<string, unknown>;
  version: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface InterventionResponse {
  id: string;
  enrollmentId: string;
  userId: string;
  courseId: string;
  type: string;
  status: 'pending' | 'active' | 'completed' | 'cancelled' | 'failed';
  message: string;
  recipientEmail?: string;
  assignedBy?: string;
  dueDate?: string;
  progress: number;
  sentAt?: string;
  completedAt?: string;
  outcomeNotes?: string;
  preInterventionScore?: number;
  postInterventionScore?: number;
  errorMessage?: string;
  createdAt: string;
}

export interface InterventionSummaryResponse {
  total: number;
  pending: number;
  active: number;
  completed: number;
  failed: number;
  successRate: number;
  avgImprovement: number;
}

export interface ComplianceReportResponse {
  id: string;
  reportType: string;
  status: string;
  totalEmployees: number;
  compliantEmployees: number;
  complianceRate: number;
  activeInterventions: number;
  generatedAt: string;
}

export interface RiskEvaluationRunResponse {
  evaluatedUsers: number;
  activeRules: number;
  critical: number;
  high: number;
  medium: number;
  low: number;
  none: number;
  evaluatedAt: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  department?: string;
}

export interface LoginResponse {
  access_token: string;
  user: {
    id: string;
    email: string;
    role: string;
    firstName: string;
    lastName: string;
    department?: string;
  };
}

export const healthApi = {
  check: async (): Promise<HealthResponse> => {
    const response = await axios.get<HealthResponse>(`${backendBaseUrl}/health`, {
      timeout: 5000,
    });
    return response.data;
  },
};

export const authApi = {
  login: async (payload: LoginRequest): Promise<LoginResponse> => {
    const response = await api.post<LoginResponse>('/auth/login', payload);
    return response.data;
  },
  register: async (payload: RegisterRequest): Promise<LoginResponse> => {
    const response = await api.post<LoginResponse>('/auth/register', payload);
    return response.data;
  },
  profile: async () => {
    const response = await api.get('/auth/profile');
    return response.data;
  },
};

export const dashboardApi = {
  summary: async (): Promise<DashboardSummaryResponse> => {
    const response = await api.get<DashboardSummaryResponse>('/dashboard/summary');
    return response.data;
  },
};

export const rulesApi = {
  list: async (): Promise<RiskRuleResponse[]> => {
    const response = await api.get<RiskRuleResponse[]>('/rules');
    return response.data;
  },
};

export const interventionsApi = {
  list: async (status?: string): Promise<InterventionResponse[]> => {
    const response = await api.get<InterventionResponse[]>('/interventions', {
      params: status ? { status } : undefined,
    });
    return response.data;
  },
  summary: async (): Promise<InterventionSummaryResponse> => {
    const response = await api.get<InterventionSummaryResponse>('/interventions/summary');
    return response.data;
  },
};

export const complianceApi = {
  generate: async (type = 'monthly'): Promise<ComplianceReportResponse> => {
    const response = await api.post<ComplianceReportResponse>(`/compliance/reports/generate?type=${type}`);
    return response.data;
  },
  list: async (): Promise<ComplianceReportResponse[]> => {
    const response = await api.get<ComplianceReportResponse[]>('/compliance/reports');
    return response.data;
  },
  exportLatestCsvUrl: `${backendBaseUrl}/api/v1/compliance/reports/latest-csv`,
};

export const riskEvaluationsApi = {
  run: async (): Promise<RiskEvaluationRunResponse> => {
    const response = await api.post<RiskEvaluationRunResponse>('/risk-evaluations/run');
    return response.data;
  },
};

export default api;
