/* Changes to original `react-native-image-progress` are marked as `*CUSTOM*` */

import type React from 'react';
import type { StyleProp } from 'react-native';

// ts-prune-ignore-next
type ImageProgressComponent<
  // eslint-disable-next-line @typescript-eslint/ban-types
  P = {}
> = React.ComponentType<
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

// eslint-disable-next-line @typescript-eslint/ban-types
export function createImageProgress<P = {}>(ImageComponent: React.ComponentType<P>): ImageProgressComponent<P>;
