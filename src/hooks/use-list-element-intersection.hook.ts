import { noop, throttle } from 'lodash-es';
import { useCallback, useMemo, useRef } from 'react';
import { LayoutChangeEvent, LayoutRectangle, NativeScrollEvent, NativeSyntheticEvent } from 'react-native';

import { IntersectionHookRef } from 'src/types/intersection-hook-ref';
import { getIntersectionRatio } from 'src/utils/get-intersection-ratio';
import { isDefined } from 'src/utils/is-defined';

const DEFAULT_INTERSECTION_THRESHOLD = 0.5;

interface IntersectionHookRefs {
  parent: IntersectionHookRef;
  element: IntersectionHookRef;
}

/**
 * A hook for observing the intersection of a component inside a list. `react-native-intersection-observer` exists
 * for similar purposes but it is incompatible with our components.
 * @param onIntersectChange A callback to be called when the intersection state changes
 * @param refs If specified, the measurement of the element will be relative to `parent`; otherwise, the data from
 * events will be used. Do without it whenever possible
 * @param threshold The part of the child element area that should be visible for the intersection to be considered
 * @returns Callbacks for the list and the element and current intersection state
 */
export const useListElementIntersection = (
  onIntersectChange: (value: boolean) => void = noop,
  refs?: IntersectionHookRefs,
  threshold = DEFAULT_INTERSECTION_THRESHOLD
) => {
  const lastLayoutRectangleRef = useRef<LayoutRectangle>();
  const lastNativeScrollConfigRef = useRef<Omit<NativeScrollEvent, 'contentSize' | 'zoomScale'>>();
  const isIntersectedRef = useRef<boolean>();

  const onUnmount = useCallback(() => {
    isIntersectedRef.current = false;
  }, []);

  const refreshIsIntersected = useCallback(() => {
    const layoutRectangleWithoutScroll = lastLayoutRectangleRef.current;
    const nativeScrollConfig = lastNativeScrollConfigRef.current;

    if (!isDefined(layoutRectangleWithoutScroll) || !isDefined(nativeScrollConfig)) {
      return;
    }

    const listLayoutMeasurement = nativeScrollConfig.layoutMeasurement;
    // TODO: add logic for contentInset
    const layoutRectangle = {
      x: layoutRectangleWithoutScroll.x - nativeScrollConfig.contentOffset.x,
      y: layoutRectangleWithoutScroll.y - nativeScrollConfig.contentOffset.y,
      width: layoutRectangleWithoutScroll.width,
      height: layoutRectangleWithoutScroll.height
    };
    const newIsIntersected = getIntersectionRatio(listLayoutMeasurement, layoutRectangle) >= threshold;
    if (isIntersectedRef.current !== newIsIntersected) {
      isIntersectedRef.current = newIsIntersected;
      onIntersectChange(newIsIntersected);
    }
  }, [onIntersectChange, threshold]);
  const refreshIsIntersectedWithMeasurements = useCallback(() => {
    if (!refs) {
      return;
    }

    const parent = refs.parent.current;
    const element = refs.element.current;

    if (!parent || !element) {
      return;
    }

    element.measureLayout(
      parent,
      (x, y, width, height) => {
        lastLayoutRectangleRef.current = { x, y, width, height };

        refreshIsIntersected();
      },
      () => console.error('Failed to measure element layout relatively to the parent')
    );
  }, [refreshIsIntersected, refs]);

  const handleNativeScrollEvent = useMemo(
    () =>
      throttle(
        (e: NativeScrollEvent | null) => {
          if (!isDefined(e)) {
            return;
          }

          lastNativeScrollConfigRef.current = e;
          if (refs) {
            refreshIsIntersectedWithMeasurements();
          } else {
            refreshIsIntersected();
          }
        },
        10,
        { leading: false, trailing: true }
      ),
    [refreshIsIntersected, refreshIsIntersectedWithMeasurements, refs]
  );

  const onListScroll = useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      e.persist();
      handleNativeScrollEvent(e.nativeEvent);
    },
    [handleNativeScrollEvent]
  );

  const onElementLayoutChange = useCallback(
    (e: LayoutChangeEvent) => {
      e.persist();
      if (refs) {
        refreshIsIntersectedWithMeasurements();
      } else {
        lastLayoutRectangleRef.current = e.nativeEvent.layout;
        refreshIsIntersected();
      }
    },
    [refreshIsIntersected, refreshIsIntersectedWithMeasurements, refs]
  );

  const onListLayoutChange = useCallback(
    (e: LayoutChangeEvent) => {
      e.persist();

      if (isDefined(lastNativeScrollConfigRef.current)) {
        lastNativeScrollConfigRef.current.layoutMeasurement = e.nativeEvent.layout;
      } else {
        lastNativeScrollConfigRef.current = {
          layoutMeasurement: e.nativeEvent.layout,
          contentOffset: { x: 0, y: 0 },
          contentInset: { top: 0, left: 0, bottom: 0, right: 0 }
        };
      }

      if (refs) {
        refreshIsIntersectedWithMeasurements();
      } else {
        refreshIsIntersected();
      }
    },
    [refreshIsIntersected, refreshIsIntersectedWithMeasurements, refs]
  );

  return {
    onListScroll,
    onElementLayoutChange,
    onListLayoutChange,
    onUnmount
  };
};
