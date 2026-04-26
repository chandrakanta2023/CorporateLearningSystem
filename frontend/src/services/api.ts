import axios from 'axios';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: 'http://localhost:3000/api/v1',
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
  },
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
    const response = await api.get<HealthResponse>('/health');
    return response.data;
  },
};

export default api;
