import { Component, type ErrorInfo, type ReactNode } from 'react';

type ApiErrorBoundaryProps = {
  children: ReactNode;
};

type ApiErrorBoundaryState = {
  hasError: boolean;
  message: string;
};

class ApiErrorBoundary extends Component<ApiErrorBoundaryProps, ApiErrorBoundaryState> {
  constructor(props: ApiErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      message: '',
    };
  }

  static getDerivedStateFromError(error: Error): ApiErrorBoundaryState {
    return {
      hasError: true,
      message: error.message || 'An unexpected client error occurred.',
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Keep a browser log for debugging in local development.
    console.error('API error boundary captured an error:', error, errorInfo);
  }

  handleRetry = (): void => {
    this.setState({ hasError: false, message: '' });
  };

  render(): ReactNode {
    if (this.state.hasError) {
      return (
        <div style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', padding: '2rem' }}>
          <div
            style={{
              maxWidth: '640px',
              width: '100%',
              border: '1px solid #f5c2c7',
              background: '#fff5f6',
              color: '#7a1b1b',
              borderRadius: '12px',
              padding: '1.5rem',
              boxShadow: '0 10px 30px rgba(0, 0, 0, 0.06)',
            }}
          >
            <h2 style={{ marginTop: 0 }}>Something went wrong</h2>
            <p style={{ marginBottom: '0.75rem' }}>
              A frontend error interrupted the API workflow. Please retry or refresh the page.
            </p>
            {this.state.message ? <p style={{ marginTop: 0 }}>Details: {this.state.message}</p> : null}
            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem' }}>
              <button
                type="button"
                onClick={this.handleRetry}
                style={{
                  background: '#7a1b1b',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '0.6rem 1rem',
                  cursor: 'pointer',
                }}
              >
                Retry
              </button>
              <button
                type="button"
                onClick={() => window.location.reload()}
                style={{
                  background: '#fff',
                  color: '#7a1b1b',
                  border: '1px solid #7a1b1b',
                  borderRadius: '8px',
                  padding: '0.6rem 1rem',
                  cursor: 'pointer',
                }}
              >
                Refresh Page
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ApiErrorBoundary;
