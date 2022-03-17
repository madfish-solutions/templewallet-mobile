declare module '*.svg' {
  import React from 'react';
  import { SvgProps } from 'react-native-svg';
  const content: React.FC<SvgProps>;
  export default content;
}

declare function atob(input: string): string;
declare function btoa(input: string): string;

declare module 'node-forge';
