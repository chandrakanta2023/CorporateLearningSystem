import axios from 'axios';

const backendBaseUrl =
  import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, '') || 'http://localhost:3000';

// Create axios instance with base configuration
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

// Health check interface
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

// API methods
export const healthApi = {
  check: async (): Promise<HealthResponse> => {
    const response = await axios.get<HealthResponse>(`${backendBaseUrl}/health`, {
      timeout: 5000,
    });
    return response.data;
  },
};

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

export interface DashboardMetricsResponse {
  totalEmployees: number;
  atRiskCount: number;
  activeInterventions: number;
  complianceRate: number;
}

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
  metrics: async (): Promise<DashboardMetricsResponse> => {
    const response = await api.get<DashboardMetricsResponse>('/dashboard/metrics');
    return response.data;
  },
};

export default api;
