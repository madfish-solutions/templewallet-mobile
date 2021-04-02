import { ReactElement, Component } from 'react';

// Copy-pasted from @hookform/strictly-typed
export type FormControlRender<T> =
  | ((props: {
      onChange: (...event: any[]) => void;
      onBlur: () => void;
      value: T;
    }) => ReactElement<
      any,
      | string
      | ((props: any) => ReactElement<any, string | any | (new (props: any) => Component<any, any, any>)> | null)
      | (new (props: any) => Component<any, any, any>)
    >)
  | undefined;
