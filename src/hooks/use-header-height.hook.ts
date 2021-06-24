import HeaderHeightContext from '@react-navigation/stack/src/utils/HeaderHeightContext';
import { useContext } from 'react';

export const useHeaderHeight = () => useContext(HeaderHeightContext) ?? 0;
