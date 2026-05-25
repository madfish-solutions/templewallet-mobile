import React from 'react';

import { TempleChainKind } from 'src/enums/temple-chain-kind.enum';
import { FormRadioButtonsGroup } from 'src/form/form-radio-buttons-group';

const chainButtons = [
  { value: TempleChainKind.Tezos, label: 'Tezos' },
  { value: TempleChainKind.EVM, label: 'EVM' }
];

interface Props {
  onChange?: (chain: TempleChainKind) => void;
}

export const ImportAccountChainForm = ({ onChange }: Props) => (
  <FormRadioButtonsGroup name="chain" items={chainButtons} onChange={onChange} />
);
