import { useEffect, useState } from 'react';
import { Button } from 'antd';
import '../App.css';
import { healthApi, type HealthResponse } from '../services/api';

function Home() {
  const [healthStatus, setHealthStatus] = useState<HealthResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkHealth = async () => {
      try {
        setIsLoading(true);
        const health = await healthApi.check();
        setHealthStatus(health);
        setError(null);
      } catch (err) {
        setError(
          'Failed to connect to backend. Make sure the backend server is running on http://localhost:3000.',
        );
        console.error('Health check failed:', err);
      } finally {
        setIsLoading(false);
      }
    };

    checkHealth();
    const interval = setInterval(checkHealth, 30000);
    return () => clearInterval(interval);
  }, []);

  const formatUptime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}m ${secs}s`;
  };

  const formatTimestamp = (timestamp: number): string => {
    return new Date(timestamp).toLocaleString();
  };

  return (
    <div className="app">
      <header className="header">
        <h1>Corporate Learning System - Phase 1 POC</h1>
        <p className="subtitle">Progress, Intervention and Compliance Tracking</p>
        <div className="version-badge">Version 1.0.0 | Build: 2026-04-26</div>
        <div style={{ marginTop: '1rem' }}>
          <Button type="primary" size="large">
            Dashboard Preview
          </Button>
        </div>
      </header>

      <main className="main-content page-container">
        <section className="status-section">
          <h2>System Status</h2>

          {isLoading && (
            <div className="status-card loading">
              <p>Checking backend connection...</p>
            </div>
          )}

          {error && (
            <div className="status-card error">
              <h3>Backend Offline</h3>
              <p>{error}</p>
            </div>
          )}

          {healthStatus && (
            <div className="status-card success">
              <h3>Backend Connected</h3>
              <div className="status-grid">
                <div className="status-item">
                  <span className="label">Status:</span>
                  <span className="value status-ok">{healthStatus.status.toUpperCase()}</span>
                </div>
                <div className="status-item">
                  <span className="label">Environment:</span>
                  <span className="value">{healthStatus.environment}</span>
                </div>
                <div className="status-item">
                  <span className="label">Version:</span>
                  <span className="value">v{healthStatus.version}</span>
                </div>
                <div className="status-item">
                  <span className="label">Uptime:</span>
                  <span className="value">{formatUptime(healthStatus.uptime)}</span>
                </div>
                {healthStatus.database && (
                  <div className="status-item">
                    <span className="label">Database:</span>
                    <span
                      className={`value ${healthStatus.database.status === 'connected' ? 'status-ok' : 'status-error'}`}
                    >
                      {healthStatus.database.status === 'connected' ? 'Connected' : 'Unavailable'} -{' '}
                      {healthStatus.database.message}
                    </span>
                  </div>
                )}
                <div className="status-item full-width">
                  <span className="label">Last Check:</span>
                  <span className="value">{formatTimestamp(healthStatus.timestamp)}</span>
                </div>
              </div>
            </div>
          )}
        </section>

        <section className="info-section">
          <h2>Phase 1 Features</h2>
          <div className="features-grid">
            <div className="feature-card">
              <h3>Progress Tracking</h3>
              <p>Real-time monitoring of employee learning progress and course completion rates.</p>
            </div>
            <div className="feature-card">
              <h3>Intervention Automation</h3>
              <p>Automated reminders and interventions for employees falling behind on mandatory training.</p>
            </div>
            <div className="feature-card">
              <h3>Compliance Reporting</h3>
              <p>Compliance dashboards and reports for leadership visibility and audit support.</p>
            </div>
            <div className="feature-card">
              <h3>User Management</h3>
              <p>Role-based access capabilities for administrators, managers, and employees.</p>
            </div>
          </div>
        </section>

        <section className="tech-stack-section">
          <h2>Technology Stack</h2>
          <div className="tech-grid">
            <div className="tech-item">
              <strong>Frontend:</strong>
              <span>React + TypeScript + Vite</span>
            </div>
            <div className="tech-item">
              <strong>Backend:</strong>
              <span>NestJS + Node.js</span>
            </div>
            <div className="tech-item">
              <strong>Database:</strong>
              <span>PostgreSQL</span>
            </div>
            <div className="tech-item">
              <strong>API:</strong>
              <span>REST API with modular endpoints</span>
            </div>
          </div>
        </section>
      </main>

      <footer className="footer">
        <p>Corporate Learning System - Phase 1 Local POC</p>
        <p>Built with open source technologies</p>
      </footer>
    </div>
  );
}

export default Home;