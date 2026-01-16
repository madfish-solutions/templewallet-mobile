import { keepLocalCopy, pick } from '@react-native-documents/picker';
import React, { FC } from 'react';
import { Text, TouchableOpacity } from 'react-native';

import { ButtonLargePrimary } from 'src/components/button/button-large/button-large-primary/button-large-primary';
import { IconNameEnum } from 'src/components/icon/icon-name.enum';
import { TouchableIcon } from 'src/components/icon/touchable-icon/touchable-icon';
import { formatSize } from 'src/styles/format-size';
import { useColors } from 'src/styles/use-colors';
import { showErrorToast } from 'src/toast/toast.utils';
import { normalizeFileUri } from 'src/utils/file.utils';
import { isString } from 'src/utils/is-string';

import { useFileInputStyles } from './file-input.styles';

export interface FileInputValue {
  fileName: string;
  uri: string;
}

export interface FileInputProps {
  value?: FileInputValue;
  onChange: SyncFn<FileInputValue>;
}

export const FileInput: FC<FileInputProps> = ({ value, onChange }) => {
  const styles = useFileInputStyles();
  const colors = useColors();

  const cleanInput = () => {
    onChange({ fileName: '', uri: '' });
  };

  const selectFile = async () => {
    try {
      // copyTo: 'cachesDirectory'
      const [file] = await pick({});

      const [localCopy] = await keepLocalCopy({
        files: [
          {
            uri: file.uri,
            fileName: file.name ?? 'fallbackName'
          }
        ],
        destination: 'cachesDirectory'
      });

      onChange({ fileName: file.name ?? '', uri: normalizeFileUri(localCopy.sourceUri) });
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
