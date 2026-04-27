import { Menu, type MenuProps } from 'antd';
import {
  DashboardOutlined,
  FileTextOutlined,
  BellOutlined,
  CheckCircleOutlined,
  BarChartOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

interface SideMenuProps {
  collapsed?: boolean;
}

type MenuItem = Required<MenuProps>['items'][number];

function SideMenu(_props: SideMenuProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedKey, setSelectedKey] = useState(
    location.pathname === '/'
      ? 'dashboard'
      : location.pathname.replace('/', ''),
  );

  const items: MenuItem[] = [
    {
      key: 'dashboard',
      icon: <DashboardOutlined />,
      label: 'Dashboard',
      title: 'Dashboard',
    },
    {
      key: 'risk-rules',
      icon: <FileTextOutlined />,
      label: 'Risk Rules',
      title: 'Risk Rules',
    },
    {
      key: 'interventions',
      icon: <BellOutlined />,
      label: 'Interventions',
      title: 'Interventions',
    },
    {
      key: 'compliance',
      icon: <CheckCircleOutlined />,
      label: 'Compliance',
      title: 'Compliance',
    },
    {
      key: 'reports',
      icon: <BarChartOutlined />,
      label: 'Reports',
      title: 'Reports',
    },
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: 'Profile',
      title: 'Profile',
    },
  ];

  const handleMenuClick: MenuProps['onClick'] = (e) => {
    setSelectedKey(e.key);
    if (e.key === 'dashboard') {
      navigate('/');
      return;
    }
    navigate(`/${e.key}`);
  };

  return (
    <Menu
      theme="dark"
      mode="inline"
      selectedKeys={[selectedKey]}
      onClick={handleMenuClick}
      items={items}
      style={{
        background: '#0f4c81',
        border: 'none',
      }}
    />
  );
}

export default SideMenu;
