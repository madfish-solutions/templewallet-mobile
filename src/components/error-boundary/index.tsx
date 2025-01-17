import * as Sentry from '@sentry/react-native';
import React, { Component, PropsWithChildren, ErrorInfo, FC } from 'react';
import { StyleProp, ViewStyle } from 'react-native';

import { isString } from 'src/utils/is-string';

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

  getDefaultErrorMessage() {
    const { whileMessage } = this.props;

    return isString(whileMessage) ? `Something went wrong while ${whileMessage}` : 'Something went wrong';
  }

  render() {
    const { style, children, Fallback } = this.props;
    const { error } = this.state;

    const errorMessage = error instanceof BoundaryError ? error.message : this.getDefaultErrorMessage();

    if (error) {
      return Fallback ? (
        <Fallback />
      ) : (
        <ErrorBoundaryContent errorMessage={errorMessage} onTryAgainClick={this.tryAgain} style={style} />
      );
    }

    return children;
  }
}
