import React, { FC, ReactElement } from 'react';

import { FormattedAmount, FormattedAmountProps } from './formatted-amount';

interface Props extends FormattedAmountProps {
  isLoading?: boolean;
  renderLoader: () => ReactElement;
}

export const FormattedAmountWithLoader: FC<Props> = ({ isLoading = false, renderLoader, ...restProps }) =>
  isLoading ? renderLoader() : <FormattedAmount {...restProps} />;
