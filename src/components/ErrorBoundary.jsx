import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.log('Ad Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return null; // Or return a fallback UI
    }

    return this.props.children;
  }
}

export default ErrorBoundary; 