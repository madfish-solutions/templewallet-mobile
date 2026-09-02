import { FormikProps } from 'formik/dist/types';
import React from 'react';

import { AccountCard } from 'src/components/account-card';
import { DisclaimerV2 } from 'src/components/disclaimer/disclaimer';
import { Divider } from 'src/components/divider/divider';
import { InsetSubstitute } from 'src/components/inset-substitute/inset-substitute';
import { Label } from 'src/components/label/label';
import { ModalStatusBar } from 'src/components/modal-status-bar/modal-status-bar';
import { ScreenContainer } from 'src/components/screen-container/screen-container';
import { AccountTypeEnum } from 'src/enums/account-type.enum';
import { formatSize } from 'src/styles/format-size';
import { getAccountAddressForEvm, getAccountAddressForTezos } from 'src/utils/account.utils';
import { isDefined } from 'src/utils/is-defined';
import { getEvmDerivationPath, getTezosDerivationPath } from 'src/utils/keys.utils';

import { RevealSeedPhraseModalFormValues } from '../reveal-seed-phrase-modal.form';
import { RevealSeedPharaseSelectors } from '../reveal-seed-phrase.selectors';

import { CopyableDerivationPath } from './copyable-derivation-path';
import { RevealSeedPhraseView } from './reveal-seed-phrase-view/reveal-seed-phrase-view';

export const RevealSeedPhraseFormContent: SyncFC<FormikProps<RevealSeedPhraseModalFormValues>> = ({ values }) => {
  const tezosAddress = getAccountAddressForTezos(values.account);
  const evmAddress = getAccountAddressForEvm(values.account);
  const supportsBothChains = Boolean(tezosAddress && evmAddress);
  const accountIndex = values.account.type === AccountTypeEnum.HD ? values.account.hdIndex : 0;

  return (
    <>
      <ScreenContainer>
        <ModalStatusBar />
        <Divider size={formatSize(8)} />
        <Label label="Account" description="Reveal a seed phrase from your HD account" />
        <AccountCard account={values.account} showAllAddresses />
        <Divider size={formatSize(24)} />
        {isDefined(tezosAddress) && (
          <>
            <Label
              label={supportsBothChains ? 'Tezos derivation path' : 'Derivation path'}
              description="This is your HD wallet key hierarchy blueprint to regenerate your account from seed phrase."
            />
            <CopyableDerivationPath
              value={getTezosDerivationPath(accountIndex)}
              testID={RevealSeedPharaseSelectors.tezosDerivationPath}
            />
            <Divider size={formatSize(16)} />
          </>
        )}
        {isDefined(evmAddress) && (
          <>
            <Label
              label={supportsBothChains ? 'EVM derivation path' : 'Derivation path'}
              description={
                tezosAddress
                  ? undefined
                  : 'This is your HD wallet key hierarchy blueprint to regenerate your account from seed phrase.'
              }
            />
            <CopyableDerivationPath
              value={getEvmDerivationPath(accountIndex)}
              testID={RevealSeedPharaseSelectors.evmDerivationPath}
            />
            <Divider size={formatSize(16)} />
          </>
        )}
        <Label
          label="Seed phrase"
          description="Master key for all your accounts to access wallet if you switch browser or device. Keep it in secret."
        />
        <RevealSeedPhraseView publicKeyHash={tezosAddress ?? evmAddress ?? ''} />
        <Divider size={formatSize(16)} />
        <DisclaimerV2
          title="Attention!"
          texts={['DO NOT share this set of chars with anyone!', 'It can be used to steal your current account.']}
        />
      </ScreenContainer>
      <InsetSubstitute type="bottom" />
    </>
  );
};
