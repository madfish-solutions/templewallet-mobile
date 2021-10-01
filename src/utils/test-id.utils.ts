import { isAndroid } from '../config/system';
import { TestIdProps } from '../interfaces/test-id.props';

export const setTestID = (testID?: TestIdProps['testID']) =>
  isAndroid ? { accessibilityLabel: testID, testID } : { testID };
