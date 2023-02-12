import { isEqual } from 'lodash-es';
import React, { memo } from 'react';
import { XmlProps, SvgXml } from 'react-native-svg';

import { isImgUriDataUri, getXmlFromSvgDataUriInUtf8Encoding } from 'src/utils/image.utils';

type Props = Omit<XmlProps, 'xml'> & { dataUri: string };

export const DataUriImage = memo<Props>(
  ({ dataUri, ...props }) => {
    if (!isImgUriDataUri(dataUri)) {
      throw new Error('URI format is unknown');
    }

    const xml = getXmlFromSvgDataUriInUtf8Encoding(dataUri);

    return <SvgXml {...props} xml={xml} />;
  },
  (prevProps, nextProps) => isEqual(prevProps, nextProps)
);
