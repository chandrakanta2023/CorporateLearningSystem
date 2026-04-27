import { Menu, type MenuProps } from 'antd';
import {
  DashboardOutlined,
  FileTextOutlined,
  BellOutlined,
  CheckCircleOutlined,
  BarChartOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

interface SideMenuProps {
  collapsed?: boolean;
}

type MenuItem = Required<MenuProps>['items'][number];

function SideMenu(_props: SideMenuProps) {
  const location = useLocation();
  const navigate = useNavigate();

  const items: MenuItem[] = [
    { key: 'dashboard', icon: <DashboardOutlined />, label: 'Dashboard', title: 'Dashboard' },
    { key: 'risk-rules', icon: <FileTextOutlined />, label: 'Risk Rules', title: 'Risk Rules' },
    { key: 'interventions', icon: <BellOutlined />, label: 'Interventions', title: 'Interventions' },
    { key: 'compliance', icon: <CheckCircleOutlined />, label: 'Compliance', title: 'Compliance' },
    { key: 'reports', icon: <BarChartOutlined />, label: 'Reports', title: 'Reports' },
    { key: 'profile', icon: <UserOutlined />, label: 'Profile', title: 'Profile' },
  ];

  const selectedKey = useMemo(() => {
    const pathname = location.pathname;
    if (pathname.startsWith('/risk-rules')) return 'risk-rules';
    if (pathname.startsWith('/interventions')) return 'interventions';
    if (pathname.startsWith('/compliance')) return 'compliance';
    if (pathname.startsWith('/reports')) return 'reports';
    if (pathname.startsWith('/profile')) return 'profile';
    return 'dashboard';
  }, [location.pathname]);

  const handleMenuClick: MenuProps['onClick'] = (e) => {
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
