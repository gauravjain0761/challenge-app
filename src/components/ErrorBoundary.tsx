// src/components/ErrorBoundary/index.tsx
import React, { Component, ErrorInfo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors } from '@/constants/Colors';
import { getFontSize } from '@/utils/responsiveFn';

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log error to your error reporting service
    console.error('Error caught by boundary:', error, errorInfo);
  }

  handleRetry = () => {
    this.setState({
      hasError: false,
      error: null
    });
  };

  render() {
    if (this.state.hasError) {
      return (
        <View style={styles.container}>
          <Text style={styles.title}>Oops! Something went wrong</Text>
          <Text style={styles.message}>
            We apologize for the inconvenience. Please try again.
          </Text>
          <TouchableOpacity 
            style={styles.retryButton}
            onPress={this.handleRetry}
          >
            <Text style={styles.retryText}>Retry</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.dark.background,
    padding: getFontSize(2),
  },
  title: {
    color: Colors.white,
    fontSize: getFontSize(2.2),
    fontWeight: '600',
    marginBottom: getFontSize(1),
    textAlign: 'center',
  },
  message: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: getFontSize(1.8),
    textAlign: 'center',
    marginBottom: getFontSize(3),
  },
  retryButton: {
    backgroundColor: Colors.orange,
    paddingHorizontal: getFontSize(3),
    paddingVertical: getFontSize(1.2),
    borderRadius: getFontSize(0.8),
  },
  retryText: {
    color: Colors.black,
    fontSize: getFontSize(1.8),
    fontWeight: '500',
  },
});

export default ErrorBoundary;