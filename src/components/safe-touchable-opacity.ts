import { TouchableOpacity } from 'react-native';
import { TouchableOpacity as GHTouchableOpacity } from 'react-native-gesture-handler';

import { isIOS } from 'src/config/system';

/** Try using this component to fix false clicks on iOS */
export const SafeTouchableOpacity = isIOS ? TouchableOpacity : GHTouchableOpacity;
