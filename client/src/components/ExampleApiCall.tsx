import { useEffect, useState } from 'react';
import api from '../lib/api';

interface HealthCheckResponse {
  status: string;
}

export default function ExampleApiCall() {
  const [healthStatus, setHealthStatus] = useState<string>('');

  useEffect(() => {
    const checkHealth = async () => {
      try {
        const response = await api.get<HealthCheckResponse>('/health');
        setHealthStatus(response.data.status);
      } catch (error) {
        console.error('Failed to check health:', error);
        setHealthStatus('error');
      }
    };

    checkHealth();
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-2">Server Health Check</h2>
      <p>Status: {healthStatus || 'checking...'}</p>
    </div>
  );
} 