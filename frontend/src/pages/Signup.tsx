import { useState } from 'react';
import { Alert, Button, Card, Form, Input, Typography } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { authApi } from '../services/api';
import { setSession } from '../services/auth';

interface SignupForm {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  department?: string;
}

export default function Signup() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const onFinish = async (values: SignupForm) => {
    try {
      setLoading(true);
      setError(null);
      const response = await authApi.register(values);
      const token = response.accessToken || response.access_token;
      setSession(token, response.user);
      navigate('/');
    } catch {
      setError('Sign up failed. Email may already exist.');
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
        background: 'linear-gradient(135deg, #f3f7ff 0%, #eef9f6 100%)',
        padding: '1rem',
      }}
    >
      <Card style={{ width: '100%', maxWidth: 520 }}>
        <Typography.Title level={3} style={{ marginBottom: 8 }}>
          Create Account
        </Typography.Title>
        <Typography.Paragraph type="secondary">
          Sign up to access the Corporate Learning System.
        </Typography.Paragraph>

        {error && <Alert type="error" message={error} style={{ marginBottom: 16 }} />}

        <Form layout="vertical" onFinish={onFinish}>
          <Form.Item label="First Name" name="firstName" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Last Name" name="lastName" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Department" name="department">
            <Input />
          </Form.Item>
          <Form.Item label="Email" name="email" rules={[{ required: true, type: 'email' }]}>
            <Input />
          </Form.Item>
          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, min: 6 }]}
          >
            <Input.Password />
          </Form.Item>
          <Button type="primary" htmlType="submit" loading={loading} block>
            Create Account
          </Button>
        </Form>

        <Typography.Paragraph style={{ marginTop: 16, marginBottom: 0 }}>
          Already have an account? <Link to="/login">Sign in</Link>
        </Typography.Paragraph>
      </Card>
    </div>
  );
}
