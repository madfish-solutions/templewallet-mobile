import React, { useCallback } from 'react';
import { StyleSheet, TextInput, TextInputProps } from 'react-native';

import { isAndroid } from 'src/config/system';

/** Original implementation: https://github.com/facebook/react-native/issues/50137 */
export const PatchedTextInput: FCWithRef<TextInput, TextInputProps> = ({ style, ref, ...restProps }) => {
  const setRef = useCallback(
    (node: TextInput | null) => {
      if (node) {
        if (typeof ref === 'function') {
          ref(node);
        } else if (ref) {
          ref.current = node;
        }

        // Workaround for Android to apply style before setting placeholder
        // to apply font family correctly
        if (isAndroid) {
          node.setNativeProps({
            style: StyleSheet.flatten([style ?? {}])
          });
        }
      }
    },
    [ref, style]
  );

  return <TextInput ref={setRef} style={style} {...restProps} />;
};
