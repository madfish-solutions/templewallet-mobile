import { NavigationContainerRef } from '@react-navigation/native';
import { createRef } from 'react';

import type { RootStackParamList } from './root-stack';

export const globalNavigationRef = createRef<NavigationContainerRef<RootStackParamList>>();
