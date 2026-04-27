import { useEffect, useState } from 'react';
import { Alert, Card, Descriptions, Skeleton, Typography } from 'antd';
import MainLayout from '../components/Layout/MainLayout';
import { authApi } from '../services/api';

interface ProfileData {
  id: string;
  email: string;
  role: string;
  firstName: string;
  lastName: string;
  department?: string;
}

export default function Profile() {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = (await authApi.profile()) as ProfileData;
        setProfile(data);
      } catch {
        setError('Unable to load profile details.');
      } finally {
        setLoading(false);
      }
    };
    loadProfile();
  }, []);

  return (
    <MainLayout>
      <Card>
        <Typography.Title level={2} style={{ marginBottom: 4 }}>
          My Profile
        </Typography.Title>
        <Typography.Paragraph type="secondary">
          View your account details and assigned role.
        </Typography.Paragraph>

        {error && <Alert type="error" message={error} style={{ marginBottom: 16 }} />}

        {loading ? (
          <Skeleton active paragraph={{ rows: 6 }} />
        ) : (
          <Descriptions bordered column={1} size="middle">
            <Descriptions.Item label="Full Name">
              {profile?.firstName} {profile?.lastName}
            </Descriptions.Item>
            <Descriptions.Item label="Email">{profile?.email}</Descriptions.Item>
            <Descriptions.Item label="Role">{profile?.role}</Descriptions.Item>
            <Descriptions.Item label="Department">
              {profile?.department || 'Not assigned'}
            </Descriptions.Item>
            <Descriptions.Item label="User ID">{profile?.id}</Descriptions.Item>
          </Descriptions>
        )}
      </Card>
    </MainLayout>
  );
}
