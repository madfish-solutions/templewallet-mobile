import { HeaderHeightContext } from '@react-navigation/elements';
import { useContext } from 'react';

export const useHeaderHeight = () => useContext(HeaderHeightContext) ?? 0;
