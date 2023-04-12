import { useSelector } from '../selector';

export const useUserTestingGroupNameSelector = () => useSelector(({ abTesting }) => abTesting.groupName);
