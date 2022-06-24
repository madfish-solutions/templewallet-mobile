import { ActivityGroup } from './activity.interface';

export interface UseActivityInterface {
  handleUpdate: () => void;
  activities: ActivityGroup[];
  isAllLoaded: boolean;
}
