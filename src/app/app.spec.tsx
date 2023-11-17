import 'react-native';
import React from 'react';
// Note: react-test-renderer must be required after react-native.
import { create } from 'react-test-renderer';

import { App } from './app';

describe('App', () => {
  // eslint-disable-next-line jest/expect-expect
  it('renders correctly', () => {
    create(<App />);
  });
});
