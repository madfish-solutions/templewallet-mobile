import React, { FC } from 'react';
import { Text, TouchableOpacity } from 'react-native';
import { pickSingle } from 'react-native-document-picker';

import { EventFn } from '../../config/general';
import { isAndroid, isIOS } from '../../config/system';
import { formatSize } from '../../styles/format-size';
import { useColors } from '../../styles/use-colors';
import { showErrorToast } from '../../toast/toast.utils';
import { isString } from '../../utils/is-string';
import { ButtonLargePrimary } from '../button/button-large/button-large-primary/button-large-primary';
import { IconNameEnum } from '../icon/icon-name.enum';
import { TouchableIcon } from '../icon/touchable-icon/touchable-icon';
import { useFileInputStyles } from './file-input.styles';

export interface FileInputValue {
  fileName: string;
  uri: string;
}

export interface FileInputProps {
  value?: FileInputValue;
  onChange: EventFn<FileInputValue>;
}

const normalize = (path: string) => {
  if (isIOS || isAndroid) {
    const filePrefix = 'file://';

    if (path.startsWith(filePrefix)) {
      path = path.substring(filePrefix.length);
      try {
        path = decodeURI(path);
      } catch {}
    }
  }

  return path;
};

export const FileInput: FC<FileInputProps> = ({ value, onChange }) => {
  const styles = useFileInputStyles();
  const colors = useColors();

  const cleanInput = () => {
    onChange({ fileName: '', uri: '' });
  };

  const selectFile = async () => {
    try {
      const pickResult = await pickSingle({ copyTo: 'cachesDirectory' });

      console.log(normalize(pickResult.uri));

      onChange({ fileName: pickResult.name, uri: normalize(pickResult.uri) });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      if (e.message !== 'User canceled document picker') {
        showErrorToast(e.message);
      }
    }
  };

  return isString(value?.uri) ? (
    <TouchableOpacity style={styles.filledInput} onPress={selectFile}>
      <Text style={styles.fileName}>{value?.fileName}</Text>
      <TouchableIcon name={IconNameEnum.Trash} size={formatSize(24)} color={colors.destructive} onPress={cleanInput} />
    </TouchableOpacity>
  ) : (
    <ButtonLargePrimary title="Select file" onPress={selectFile} />
  );
};
