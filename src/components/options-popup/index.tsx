import { memo, RefObject, useCallback, useImperativeHandle, useMemo, useState } from 'react';
import { NativeMethods, Text, TouchableOpacity } from 'react-native';
import Popover, { Rect, PopoverPlacement } from 'react-native-popover-view';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { isAndroid } from 'src/config/system';

import { popoverWidth, useOptionsPopupStyles } from './styles';

export interface OptionsPopupController {
  open: EmptyFn;
  close: EmptyFn;
}

type YPlacement = 'top' | 'center' | 'bottom';
type XPlacement = 'left' | 'center' | 'right';
type OptionContent<T> = React.ComponentType<{ option: T }>;

export interface OptionsPopupProps<T> {
  controlRef: RefObject<OptionsPopupController | null>;
  title: string;
  options: T[];
  keyFn: SyncFn<T, string>;
  /** The preferred placement of the popup. If it cannot be placed there, it may be placed at the opposite side of the trigger element. */
  placement: Exclude<`${YPlacement}-${XPlacement}`, 'center-center'>;
  onOptionPress: SyncFn<T, void>;
  /** Away from left/right edge if the placement is centered by Y axis; by X axis direction otherwise */
  xOffset?: number;
  /** By Y axis direction if the placement is centered by Y axis; away from top/bottom edge otherwise */
  yOffset?: number;
  triggerRef: RefObject<{ measureInWindow: NativeMethods['measureInWindow'] } | null>;
}

const noArrowSize = { width: 0, height: 0 };

export const OptionsPopupHOC = <T extends unknown>(OptionContent: OptionContent<T>) => {
  const Option = OptionHOC(OptionContent);

  const OptionsPopup = memo<OptionsPopupProps<T>>(
    ({ controlRef, title, options, keyFn, placement, onOptionPress, xOffset = 0, yOffset = 0, triggerRef }) => {
      const [yPlacement, xPlacement] = useMemo(() => placement.split('-') as [YPlacement, XPlacement], [placement]);
      const insets = useSafeAreaInsets();
      const yInsetOffset = isAndroid ? insets.top : 0;
      const [popoverFromRect, setPopoverFromRect] = useState(() => new Rect(insets.left, insets.top, popoverWidth, 0));
      const [isVisible, setIsVisible] = useState(false);

      const styles = useOptionsPopupStyles();

      const onClose = useCallback(() => setIsVisible(false), []);
      const open = useCallback(() => {
        triggerRef.current?.measureInWindow((x, y, width, height) => {
          switch (placement) {
            case 'top-left':
            case 'bottom-left':
              setPopoverFromRect(new Rect(x + xOffset, y - yOffset + yInsetOffset, popoverWidth, height + 2 * yOffset));
              break;
            case 'top-center':
            case 'bottom-center':
              setPopoverFromRect(new Rect(x + xOffset, y - yOffset + yInsetOffset, width, height + 2 * yOffset));
              break;
            case 'top-right':
            case 'bottom-right':
              setPopoverFromRect(
                new Rect(
                  x + width - popoverWidth + xOffset,
                  y - yOffset + yInsetOffset,
                  popoverWidth,
                  height + 2 * yOffset
                )
              );
              break;
            case 'center-left':
            case 'center-right':
              setPopoverFromRect(new Rect(x - xOffset, y + yOffset + yInsetOffset, width + 2 * xOffset, height));
              break;
          }
          setIsVisible(true);
        });
      }, [triggerRef, placement, xOffset, yOffset, yInsetOffset]);

      const popoverPlacement = useMemo(() => {
        switch (yPlacement) {
          case 'top':
            return [PopoverPlacement.TOP, PopoverPlacement.BOTTOM];
          case 'center':
            return xPlacement === 'left'
              ? [PopoverPlacement.LEFT, PopoverPlacement.RIGHT]
              : [PopoverPlacement.RIGHT, PopoverPlacement.LEFT];
          default:
            return [PopoverPlacement.BOTTOM, PopoverPlacement.TOP];
        }
      }, [yPlacement, xPlacement]);

      useImperativeHandle(controlRef, () => ({ open, close: onClose }), [onClose, open]);

      return (
        <Popover
          from={popoverFromRect}
          isVisible={isVisible}
          debug={__DEV__}
          onRequestClose={onClose}
          placement={popoverPlacement}
          arrowSize={noArrowSize}
          displayAreaInsets={insets}
          backgroundStyle={styles.popoverBackground}
          popoverStyle={styles.popover}
        >
          <Text style={styles.title}>{title}</Text>

          {options.map(option => (
            <Option option={option} key={keyFn(option)} onPress={onOptionPress} />
          ))}
        </Popover>
      );
    }
  );

  return OptionsPopup;
};

interface OptionProps<T> {
  option: T;
  onPress: SyncFn<T, void>;
}

const OptionHOC = <T extends unknown>(Content: OptionContent<T>) => {
  const Option = memo(({ option, onPress }: OptionProps<T>) => {
    const styles = useOptionsPopupStyles();
    const handleOptionPress = useCallback(() => onPress(option), [option, onPress]);

    return (
      <TouchableOpacity style={styles.option} onPress={handleOptionPress}>
        <Content option={option} />
      </TouchableOpacity>
    );
  });

  return Option;
};
