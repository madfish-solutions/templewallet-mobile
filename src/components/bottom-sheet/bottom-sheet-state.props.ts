import { EmptyFn } from '../../config/general';

export interface BottomSheetStateProps {
  title: string;
  isOpen: boolean;
  onClose: EmptyFn;
}
