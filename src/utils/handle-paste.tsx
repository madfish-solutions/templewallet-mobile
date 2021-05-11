import Clipboard from '@react-native-clipboard/clipboard';
import { from } from 'rxjs';

export const $getClipboardString = from(Clipboard.getString);
