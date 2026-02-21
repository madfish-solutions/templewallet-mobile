/* Changes to original `react-native-image-progress` are marked as `*CUSTOM*` */

/* eslint-disable @typescript-eslint/no-explicit-any */
import type React from 'react';
import type { StyleProp } from 'react-native';

// ts-prune-ignore-next
type ImageProgressComponent<P = object> = React.ComponentType<
  P & {
    errorContainerStyle?: StyleProp<any>;
    indicator?: React.ComponentType;
    indicatorContainerStyle?: StyleProp<any>;
    indicatorProps?: any;
    renderIndicator?: (progress: number, indeterminate: boolean) => React.ReactElement;
    renderError?: (error: Error) => React.ReactElement;
    style?: StyleProp<any>;
    imageStyle?: StyleProp<any>;
    threshold?: number;
  }
>;

export function createImageProgress<P = object>(ImageComponent: React.ComponentType<P>): ImageProgressComponent<P>;
