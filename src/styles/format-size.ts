import { step } from '../config/styles';

export const formatSize = (size: number): number => (size / step) * step;
