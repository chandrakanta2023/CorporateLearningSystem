import { useState } from 'react';
import axios from 'axios';
import { Alert, Button, Card, Form, Input, Typography } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { authApi } from '../services/api';
import { setSession } from '../services/auth';

const { Title, Text } = Typography;

export default function Login() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const onFinish = async (values: { email: string; password: string }) => {
    setLoading(true);
    setError(null);
    try {
      const response = await authApi.login(values);
      const token = response.accessToken || response.access_token;
      setSession(token, response.user);
      navigate('/dashboard', { replace: true });
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
        display: 'grid',
        placeItems: 'center',
        background: 'linear-gradient(135deg, #f4f7fb 0%, #dce8f5 100%)',
        padding: 16,
      }}
    >
      <Card style={{ width: '100%', maxWidth: 420, boxShadow: '0 12px 36px rgba(15, 76, 129, 0.18)' }}>
        <Title level={3} style={{ marginBottom: 8 }}>
          Corporate Learning System
        </Title>
        <Text type="secondary">Sign in to continue</Text>

        <Form layout="vertical" style={{ marginTop: 20 }} onFinish={onFinish} autoComplete="off">
          <Form.Item
            label="Email"
            name="email"
            rules={[{ required: true, message: 'Please enter email' }, { type: 'email' }]}
          >
            <Input placeholder="admin@company.com" />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: 'Please enter password' }]}
          >
            <Input.Password placeholder="Enter password" />
          </Form.Item>

          {error && (
            <Form.Item>
              <Alert type="error" title={error} showIcon />
            </Form.Item>
          )}

          <Button htmlType="submit" type="primary" block loading={loading}>
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
