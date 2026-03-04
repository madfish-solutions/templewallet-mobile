import { useCallback, useMemo, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';

import { ImageTypeEnum } from 'src/enums/image-type.enum';
import { addKnownSvg, removeKnownSvg } from 'src/store/tokens-metadata/tokens-metadata-actions';
import { useIsKnownSvgSelector } from 'src/store/tokens-metadata/tokens-metadata-selectors';
import { formatImgUri, isImgUriDataUri, isImgUriSvg } from 'src/utils/image.utils';
import { isString } from 'src/utils/is-string';

const ENDS_WITH_EXTENSION_REGEX = /\.[a-z0-9]+$/i;

export const useImageType = (imgUri: string) => {
  const dispatch = useDispatch();
  const mayBeUnknownSvg = !ENDS_WITH_EXTENSION_REGEX.test(imgUri);
  const isKnownSvg = useIsKnownSvgSelector(imgUri);

  const lastImgUri = useRef(imgUri);

  const [svgFailed, setSvgFailed] = useState(false);
  const [rasterFailed, setRasterFailed] = useState(false);
  if (imgUri !== lastImgUri.current) {
    lastImgUri.current = imgUri;
    setSvgFailed(false);
    setRasterFailed(false);
  }

  const onRasterRenderError = useCallback(() => {
    setRasterFailed(true);
    if (mayBeUnknownSvg && !svgFailed) {
      dispatch(addKnownSvg(imgUri));
    }
  }, [mayBeUnknownSvg, imgUri, svgFailed, dispatch]);

  const onSvgRenderError = useCallback(() => {
    if (mayBeUnknownSvg) {
      setSvgFailed(true);
      dispatch(removeKnownSvg(imgUri));
    }
  }, [imgUri, mayBeUnknownSvg, dispatch]);

  const imageType = useMemo(() => {
    if ((!isImgUriSvg(imgUri) && (!isKnownSvg || !rasterFailed)) || !isString(formatImgUri(imgUri))) {
      return ImageTypeEnum.RemoteRaster;
    }

    return isImgUriDataUri(imgUri) ? ImageTypeEnum.DataUri : ImageTypeEnum.RemoteSvg;
  }, [imgUri, isKnownSvg, rasterFailed]);

  return { imageType, svgFailed, rasterFailed, onRasterRenderError, onSvgRenderError };
};
