import { clamp } from 'lodash-es';
import { LayoutRectangle } from 'react-native';

interface ParentSize {
  width: number;
  height: number;
}

/**
 * @param parentSize Size of the parent element
 * @param elementRect Layout rectangle of the element relatively to the parent
 * @returns Ratio of intersection area to the element area; for 0*0 elements, 1 if the element is inside the parent and
 * 0 otherwise; for x*0 and 0*x elements, returns the ratio of the intersection non-zero dimension to the respective
 * element dimension
 */
export const getIntersectionRatio = (parentSize: ParentSize, elementRect: LayoutRectangle) => {
  const { width: elementWidth, height: elementHeight, x: elementLeft, y: elementTop } = elementRect;
  const { width: parentWidth, height: parentHeight } = parentSize;
  const elementArea = elementWidth * elementHeight;

  if (elementWidth === 0 && elementHeight === 0) {
    const elementIsInside =
      elementLeft < parentWidth && elementLeft >= 0 && elementTop < parentHeight && elementTop >= 0;

    return elementIsInside ? 1 : 0;
  }

  const elementRight = elementLeft + elementWidth;
  const elementBottom = elementTop + elementHeight;
  const intersectionTop = clamp(elementTop, 0, parentHeight);
  const intersectionBottom = clamp(elementBottom, 0, parentHeight);
  const intersectionLeft = clamp(elementLeft, 0, parentWidth);
  const intersectionRight = clamp(elementRight, 0, parentWidth);
  const intersectionWidth = intersectionRight - intersectionLeft;
  const intersectionHeight = intersectionBottom - intersectionTop;

  if (elementArea === 0) {
    return elementWidth === 0 ? intersectionHeight / elementHeight : intersectionWidth / elementWidth;
  }

  const intersectionArea = intersectionHeight * intersectionWidth;

  return intersectionArea / elementArea;
};
