import 'react-native';
import { render } from '@testing-library/react-native';
import React from 'react';

import { App } from './app';

describe('App', () => {
  // eslint-disable-next-line jest/expect-expect
  it('renders correctly', () => {
    render(<App />);
  });
});
