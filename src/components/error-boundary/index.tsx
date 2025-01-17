import * as Sentry from '@sentry/react-native';
import React, { Component, PropsWithChildren, ErrorInfo, FC } from 'react';
import { StyleProp, ViewStyle } from 'react-native';

import { ErrorBoundaryContent } from './content';

// TODO: export when it becomes necessary
class BoundaryError extends Error {
  constructor(public readonly message: string, public readonly beforeTryAgain: EmptyFn) {
    super(message);
  }
}

type Props = PropsWithChildren<{
  Fallback?: FC<object>;
  style?: StyleProp<ViewStyle>;
  whileMessage?: string;
}>;

interface ErrorBoundaryState {
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, ErrorBoundaryState> {
  state: ErrorBoundaryState = { error: null };

  static getDerivedStateFromError(error: Error) {
    return { error: error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    Sentry.captureException(error);
    console.error(error.message, errorInfo.componentStack);
  }

  tryAgainIfNecessary = () => {
    if (this.state.error) {
      this.tryAgain();
    }
  };

  tryAgain = () => {
    const { error } = this.state;
    if (error instanceof BoundaryError) {
      error.beforeTryAgain();
    }
    this.setState({ error: null });
  };

  render() {
    const { style, children, Fallback, whileMessage } = this.props;
    const { error } = this.state;

    if (error) {
      return Fallback ? (
        <Fallback />
      ) : (
        <ErrorBoundaryContent error={error} whileMessage={whileMessage} onTryAgainClick={this.tryAgain} style={style} />
      );
    }

    return children;
  }
}
