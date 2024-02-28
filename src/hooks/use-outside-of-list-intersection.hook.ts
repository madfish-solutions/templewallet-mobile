import { noop } from 'lodash-es';
import { useCallback, useRef, useState } from 'react';
import { Dimensions, LayoutRectangle } from 'react-native';

import { IntersectionHookRef } from 'src/types/intersection-hook-ref';
import { ParentSize, getIntersectionRatio } from 'src/utils/get-intersection-ratio';

const DEFAULT_INTERSECTION_THRESHOLD = 0.5;

/**
 * A hook for observing the intersection of a component with its parent or app window.
 * @param parentRef If specified, intersection with the element, which is available by this ref, is observed;
 * otherwise, intersection with app window is observed
 * @param elementRef Reference to the element
 * @param onIntersectChange A callback to be called when the intersection state changes
 * @param threshold The part of the child element area that should be visible for the intersection to be considered
 * @returns Callbacks for elements and current intersection state
 */
export const useOutsideOfListIntersection = (
  parentRef: IntersectionHookRef | undefined,
  elementRef: IntersectionHookRef,
  onIntersectChange: (value: boolean) => void = noop,
  threshold = DEFAULT_INTERSECTION_THRESHOLD
) => {
  const [isIntersected, setIsIntersected] = useState(false);
  const firstTimeRef = useRef(true);

  const onUnmount = useCallback(() => {
    firstTimeRef.current = true;
    setIsIntersected(false);
  }, []);

  const onElementOrParentLayout = useCallback(() => {
    const element = elementRef.current;
    const parent = parentRef?.current;

    const handleNewDimensions = (parentSize: ParentSize, elementRect: LayoutRectangle) => {
      const newIsIntersected = getIntersectionRatio(parentSize, elementRect) >= threshold;
      if (isIntersected !== newIsIntersected || firstTimeRef.current) {
        firstTimeRef.current = false;
        setIsIntersected(newIsIntersected);
        onIntersectChange(newIsIntersected);
      }
    };

    if (element && !parentRef) {
      element.measureInWindow((x, y, width, height) => {
        handleNewDimensions(Dimensions.get('window'), { x, y, width, height });
      });

      return;
    }

    if (!element || !parent) {
      return;
    }

    element.measureLayout(
      parent,
      (x, y, width, height) => {
        parent.measure((_, _2, parentWidth, parentHeight) => {
          handleNewDimensions({ width: parentWidth, height: parentHeight }, { x, y, width, height });
        });
      },
      () => {
        console.error('Failed to measure layout of the ad element relatively to the parent');
      }
    );
  }, [isIntersected, onIntersectChange, elementRef, parentRef, threshold]);

  return { isIntersected, onElementOrParentLayout, onUnmount };
};
