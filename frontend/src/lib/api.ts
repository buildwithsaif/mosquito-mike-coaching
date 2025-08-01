import axios from 'axios';

const API_BASE_URL = 'http://172.27.230.130:8000';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

api.interceptors.request.use(
  (config) => {
    console.log(`Making ${config.method?.toUpperCase()} request to ${config.url}`);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    console.log(`Response from ${response.config.url}:`, response.status);
    return response;
  },
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export const callsApi = {
  getAllCalls: () => api.get('/api/calls'),
  getCall: (id: number) => api.get(`/api/calls/${id}`),
  createCall: (data: any) => api.post('/api/calls', data),
};

export const webhooksApi = {
  callCompleted: (data: any) => api.post('/api/webhooks/call-completed', data),
  analysisReady: (data: any) => api.post('/api/webhooks/analysis-ready', data),
};

export const healthCheck = () => api.get('/health');

export default api;