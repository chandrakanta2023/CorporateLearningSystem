import { useState, type ReactNode } from 'react';
import { Layout, Button } from 'antd';
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';
import SideMenu from '../Navigation/SideMenu';
import './MainLayout.css';

interface MainLayoutProps {
  children: ReactNode;
}

const { Header, Sider, Content, Footer } = Layout;

function MainLayout({ children }: MainLayoutProps) {
  const [collapsed, setCollapsed] = useState(false);

  const toggleCollapse = () => {
    setCollapsed(!collapsed);
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        width={250}
        style={{
          background: '#0f4c81',
          position: 'fixed',
          left: 0,
          top: 0,
          bottom: 0,
          overflow: 'auto',
        }}
      >
        <div className="logo-placeholder">
          {!collapsed && <span style={{ color: '#fff', fontWeight: 'bold' }}>CLS</span>}
        </div>
        <nav className="sidebar-menu">
          <SideMenu collapsed={collapsed} />
        </nav>
      </Sider>

      <Layout
        style={{
          marginLeft: collapsed ? 80 : 250,
          transition: 'margin-left 0.2s',
        }}
      >
        <Header
          style={{
            background: '#fff',
            padding: '0 1.5rem',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.08)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={toggleCollapse}
            style={{ fontSize: '1.25rem' }}
          />
          <div style={{ fontSize: '1.125rem', fontWeight: 600, color: '#0f4c81' }}>
            Corporate Learning System
          </div>
          <div style={{ width: '40px' }} />
        </Header>

        <Content
          style={{
            margin: '1.5rem',
            padding: '1.5rem',
            background: '#f4f7fb',
            borderRadius: '8px',
            minHeight: 'calc(100vh - 200px)',
          }}
        >
          {children}
        </Content>

        <Footer
          style={{
            textAlign: 'center',
            color: '#666',
            borderTop: '1px solid #d6deea',
            padding: '1rem 1.5rem',
          }}
        >
          <p style={{ margin: '0.5rem 0' }}>Corporate Learning System - Phase 1 POC</p>
          <p style={{ margin: '0.5rem 0' }}>Built with React, NestJS, and PostgreSQL</p>
          <p style={{ margin: '0.5rem 0', fontSize: '0.875rem', color: '#999' }}>
            © 2026 All Rights Reserved
          </p>
        </Footer>
      </Layout>
    </Layout>
  );
}

export default MainLayout;
