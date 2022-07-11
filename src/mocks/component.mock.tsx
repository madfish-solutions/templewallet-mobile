import React from 'react';

export function mockComponent(componentName: string) {
  return {
    [componentName]: ({ ...props }) => (
      // @ts-ignore
      <mocked originalComponent={componentName} {...props}>
        {props.children}
        {/*// @ts-ignore*/}
      </mocked>
    )
  };
}
