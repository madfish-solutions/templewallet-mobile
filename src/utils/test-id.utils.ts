import { isAndroid } from '../config/system';
import { TestIdProps } from '../interfaces/test-id.props';

export const setTestID = (testID?: TestIdProps['testID']) => {
  if (testID === undefined) {
    return {};
  }

  return isAndroid ? { accessibilityLabel: testID, testID } : { testID };
};
