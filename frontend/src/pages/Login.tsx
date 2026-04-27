import { useState } from 'react';
import axios from 'axios';
import { Alert, Button, Card, Form, Input, Typography } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { authApi } from '../services/api';

export default function Login() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const onFinish = async (values: { email: string; password: string }) => {
    try {
      setLoading(true);
      setError(null);
      const response = await authApi.login(values);
      localStorage.setItem('auth_token', response.access_token);
      localStorage.setItem('auth_user', JSON.stringify(response.user));
      navigate('/');
    } catch (loginError) {
      if (axios.isAxiosError(loginError) && !loginError.response) {
        setError('Unable to connect to the server. Please check that the backend is running.');
      } else {
        setError('Invalid email or password.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        background: 'linear-gradient(135deg, #e8f0fb 0%, #f7fbff 100%)',
        padding: '1rem',
      }}
    >
      <Card style={{ width: '100%', maxWidth: 440 }}>
        <Typography.Title level={3} style={{ marginBottom: 8 }}>
          Corporate Learning Login
        </Typography.Title>
        <Typography.Paragraph type="secondary">
          Sign in to access dashboard and interventions.
        </Typography.Paragraph>

        {error && <Alert type="error" title={error} style={{ marginBottom: 16 }} />}

        <Form layout="vertical" onFinish={onFinish}>
          <Form.Item
            label="Email"
            name="email"
            rules={[{ required: true, type: 'email' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true }]}
          >
            <Input.Password />
          </Form.Item>
          <Button type="primary" htmlType="submit" loading={loading} block>
            Sign In
          </Button>
        </Form>
        <Typography.Paragraph style={{ marginTop: 16, marginBottom: 0 }}>
          New user? <Link to="/signup">Create account</Link>
        </Typography.Paragraph>
      </Card>
    </div>
  );
}
