import React, { FC } from 'react';

import { isAndroid } from 'src/config/system';
import { formatSize } from 'src/styles/format-size';

import { Disclaimer } from '../disclaimer/disclaimer';
import { Divider } from '../divider/divider';

export const AndroidKeyboardDisclaimer: FC = () =>
  isAndroid ? (
    <>
      <Divider size={formatSize(16)} />
      <Disclaimer
        title="Attention!"
        texts={['Be aware that some third-party keyboards may capture your input data.']}
      />
    </>
  ) : null;
