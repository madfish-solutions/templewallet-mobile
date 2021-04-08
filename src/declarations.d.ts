declare module '*.svg' {
  import { SvgProps } from 'react-native-svg';
  const content: React.StatelessComponent<SvgProps>;
  export default content;
}

declare const crypto: {
  readonly getRandomValues: <T>(arr: T) => T;
};

declare function btoa(input: string): string;
