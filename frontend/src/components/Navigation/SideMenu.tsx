import { Menu, type MenuProps } from 'antd';
import {
  DashboardOutlined,
  FileTextOutlined,
  BellOutlined,
  CheckCircleOutlined,
  BarChartOutlined,
} from '@ant-design/icons';
import { useState } from 'react';

interface SideMenuProps {
  collapsed?: boolean;
}

type MenuItem = Required<MenuProps>['items'][number];

function SideMenu(_props: SideMenuProps) {
  const [selectedKey, setSelectedKey] = useState('dashboard');

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
  ];

  const handleMenuClick: MenuProps['onClick'] = (e) => {
    setSelectedKey(e.key);
    // Future: navigate to page based on e.key
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
