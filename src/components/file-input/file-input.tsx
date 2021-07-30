import React, { FC } from 'react';
import { Text, TouchableOpacity } from 'react-native';
import DocumentPicker, { DocumentPickerOptions, DocumentPickerResponse } from 'react-native-document-picker';

import { EventFn } from '../../config/general';
import { isAndroid } from '../../config/system';
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
  mimeTypes?: string[];
  utisTypes?: string[];
}

export const FileInput: FC<FileInputProps> = ({
  value,
  onChange,
  mimeTypes = ['*/*'],
  utisTypes = ['public.item']
}) => {
  const styles = useFileInputStyles();
  const colors = useColors();

  const cleanInput = () => {
    onChange({ fileName: '', uri: '' });
  };

  const selectFile = async () => {
    try {
      let pickResult: DocumentPickerResponse;
      if (isAndroid) {
        pickResult = await DocumentPicker.pick<'android'>({
          type: mimeTypes
        } as DocumentPickerOptions<'android'>);
      } else {
        pickResult = await DocumentPicker.pick<'ios'>({
          type: utisTypes
        } as DocumentPickerOptions<'ios'>);
      }
      onChange({ fileName: pickResult.name, uri: pickResult.uri });
    } catch (e) {
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
