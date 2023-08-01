import React, { Component } from 'react';

//todo remove any type
class ErrorBoundary extends Component {
    state = {
        hasError: false
      };
  

  static getDerivedStateFromError(error: any) {
    return {
        hasError: true
    }
  }

  componentDidCatch(error: any, errorInfo: any) {
    this.setState({
      hasError: true
    });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div>
          <h1>Something went wrong.</h1>
        </div>
      );
    }

    // If no error occurred, render the children as usual
    return this.props.children;
  }
}

export default ErrorBoundary;
