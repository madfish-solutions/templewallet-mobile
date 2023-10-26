import { NativeStackNavigationOptions } from '@react-navigation/native-stack';
import { DependencyList, useEffect } from 'react';

import { useNavigation } from 'src/navigator/hooks/use-navigation.hook';

export const useNavigationSetOptions = (options: Partial<NativeStackNavigationOptions>, deps: DependencyList) => {
  const { setOptions } = useNavigation();

  useEffect(() => setOptions(options), deps);
};
