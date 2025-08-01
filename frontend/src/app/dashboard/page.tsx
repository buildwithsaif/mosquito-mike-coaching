'use client';

import { useState, useEffect } from 'react';
import { callsApi, healthCheck } from '@/lib/api';
import { Call } from '@/types/call';

export default function DashboardPage() {
  const [calls, setCalls] = useState<Call[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [backendStatus, setBackendStatus] = useState<'healthy' | 'error' | 'checking'>('checking');

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Check backend health first
        await healthCheck();
        setBackendStatus('healthy');

        // Fetch calls
        const response = await callsApi.getAllCalls();
        
        // Handle different response formats and ensure we have an array
        let callsData: Call[] = [];
        if (response && response.data) {
          if (Array.isArray(response.data)) {
            callsData = response.data;
          } else if (typeof response.data === 'object' && response.data.calls && Array.isArray(response.data.calls)) {
            callsData = response.data.calls;
          } else {
            console.warn('Unexpected response format:', response.data);
          }
        }
        
        setCalls(callsData);
      } catch (err: any) {
        console.error('Failed to fetch data:', err);
        setError(err.response?.data?.detail || err.message || 'Failed to fetch data');
        setBackendStatus('error');
        setCalls([]); // Ensure calls is always an array
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Mosquito Mike Coaching Dashboard</h1>
          <p className="mt-2 text-gray-600">Track and analyze your coaching calls</p>
          
          {/* Backend Status */}
          <div className="mt-4 flex items-center">
            <div className={`h-3 w-3 rounded-full mr-2 ${
              backendStatus === 'healthy' ? 'bg-green-400' : 
              backendStatus === 'error' ? 'bg-red-400' : 'bg-yellow-400'
            }`}></div>
            <span className="text-sm text-gray-600">
              Backend: {backendStatus === 'healthy' ? 'Connected' : 
                       backendStatus === 'error' ? 'Disconnected' : 'Checking...'}
            </span>
          </div>
        </div>

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
            <div className="flex">
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Connection Error</h3>
                <div className="mt-2 text-sm text-red-700">
                  <p>{error}</p>
                  <p className="mt-1">Make sure the backend server is running at http://172.27.230.130:8000</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-blue-500 rounded-md flex items-center justify-center">
                    <span className="text-white text-sm font-medium">📞</span>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Total Calls</dt>
                    <dd className="text-lg font-medium text-gray-900">{calls.length}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-green-500 rounded-md flex items-center justify-center">
                    <span className="text-white text-sm font-medium">⏱️</span>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Total Duration</dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {(calls || []).reduce((sum, call) => sum + (call?.duration || 0), 0).toFixed(1)} min
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-yellow-500 rounded-md flex items-center justify-center">
                    <span className="text-white text-sm font-medium">🎯</span>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Analyses</dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {(calls || []).reduce((sum, call) => sum + (call?.analyses?.length || 0), 0)}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-red-500 rounded-md flex items-center justify-center">
                    <span className="text-white text-sm font-medium">⚠️</span>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Objections</dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {(calls || []).reduce((sum, call) => sum + (call?.objections?.length || 0), 0)}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Calls List */}
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Recent Calls</h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              {(calls || []).length === 0 ? 'No calls found. The backend is connected but no call data is available.' : 
               `Showing ${(calls || []).length} calls`}
            </p>
          </div>
          
          {(calls || []).length === 0 ? (
            <div className="px-4 py-12 text-center">
              <div className="text-gray-400 text-lg mb-2">📞</div>
              <p className="text-gray-500">No calls to display yet</p>
              <p className="text-sm text-gray-400 mt-1">Calls will appear here once they are created via the API</p>
            </div>
          ) : (
            <ul className="divide-y divide-gray-200">
              {(calls || []).map((call) => (
                <li key={call?.id || Math.random()} className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h4 className="text-lg font-medium text-gray-900">{call?.title || 'Untitled Call'}</h4>
                      {call?.description && (
                        <p className="mt-1 text-sm text-gray-600">{call.description}</p>
                      )}
                      <div className="mt-2 flex items-center text-sm text-gray-500">
                        <span>Duration: {call?.duration || 0} min</span>
                        <span className="mx-2">•</span>
                        <span>Created: {call?.created_at ? new Date(call.created_at).toLocaleDateString() : 'Unknown'}</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      {call?.analyses && Array.isArray(call.analyses) && call.analyses.length > 0 && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {call.analyses.length} analyses
                        </span>
                      )}
                      {call?.objections && Array.isArray(call.objections) && call.objections.length > 0 && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                          {call.objections.length} objections
                        </span>
                      )}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}