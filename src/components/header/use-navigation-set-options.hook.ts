import { StackNavigationOptions } from '@react-navigation/stack';
import { DependencyList, useEffect } from 'react';

import { useNavigation } from '../../navigator/use-navigation.hook';

export const useNavigationSetOptions = (options: Partial<StackNavigationOptions>, deps?: DependencyList) => {
  const { setOptions } = useNavigation();

  useEffect(() => setOptions(options), deps);
};
