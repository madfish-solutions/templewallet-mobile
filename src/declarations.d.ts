type nullish = null | undefined;

declare module '*.svg' {
  import React from 'react';
  import { SvgProps } from 'react-native-svg';
  const content: React.FC<SvgProps>;
  export default content;
}

declare module 'node-forge';

declare module '@temple-wallet/wallet-address-validator' {
  export function validate(address: string, currency: string): boolean;
}
