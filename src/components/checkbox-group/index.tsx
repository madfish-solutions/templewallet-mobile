import React, { Children, Fragment, memo } from 'react';
import { View, ViewProps } from 'react-native';

import { HorizontalBorder } from 'src/components/horizontal-border';

import { useCheckboxGroupStyles } from './styles';

interface CheckboxGroupProps extends ViewProps {
  isError?: boolean;
}

export const CheckboxGroup = memo<CheckboxGroupProps>(({ isError = false, children, style, ...restProps }) => {
  const styles = useCheckboxGroupStyles();

  return (
    <View style={[styles.root, isError && styles.error, style]} {...restProps}>
      {Children.map(children, (child, index) => (
        <Fragment key={index}>
          {child}
          {index < Children.count(children) - 1 && <HorizontalBorder style={styles.separator} />}
        </Fragment>
      ))}
    </View>
  );
});
