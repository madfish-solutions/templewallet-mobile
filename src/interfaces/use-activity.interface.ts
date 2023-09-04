import { ActivityGroup } from './activity.interface';

export interface UseActivityInterface {
  handleUpdate: () => void;
  handleRefresh: () => void;
  activities: ActivityGroup[];
  isInitialLoading: boolean;
  isAdditionalLoading: boolean;
}
