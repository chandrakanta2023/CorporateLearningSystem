import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ConfigProvider } from 'antd'
import 'antd/dist/reset.css'
import './styles/global.css'
import App from './App.tsx'
import ApiErrorBoundary from './components/ErrorBoundary/ApiErrorBoundary.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#0f4c81',
          colorSuccess: '#2c9c69',
          colorError: '#b42318',
          colorWarning: '#b76e00',
          borderRadius: 10,
        },
      }}
    >
      <ApiErrorBoundary>
        <App />
      </ApiErrorBoundary>
    </ConfigProvider>
  </StrictMode>,
)
