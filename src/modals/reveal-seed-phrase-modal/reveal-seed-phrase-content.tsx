import React, { FC } from 'react';

import { AccountCard } from 'src/components/account-card';
import { CryptoLogoNameEnum } from 'src/components/crypto-logo/logo-name.enum';
import { DisclaimerV2 } from 'src/components/disclaimer/disclaimer';
import { Divider } from 'src/components/divider/divider';
import { Label } from 'src/components/label/label';
import { ModalStatusBar } from 'src/components/modal-status-bar/modal-status-bar';
import { ScreenContainer } from 'src/components/screen-container/screen-container';
import { HDAccount } from 'src/interfaces/account.interfaces';
import { formatSize } from 'src/styles/format-size';
import { getAccountAddressForEvm, getAccountAddressForTezos } from 'src/utils/account.utils';
import { isDefined } from 'src/utils/is-defined';
import { getEvmDerivationPath, getTezosDerivationPath } from 'src/utils/keys.utils';

import { CopyableDerivationPath } from './reveal-seed-phrase-form-content/copyable-derivation-path';
import { RevealSeedPhraseView } from './reveal-seed-phrase-form-content/reveal-seed-phrase-view/reveal-seed-phrase-view';
import { RevealSeedPharaseSelectors } from './reveal-seed-phrase.selectors';

interface Props {
  account: HDAccount;
}

export const RevealSeedPhraseContent: FC<Props> = ({ account }) => {
  const tezosAddress = getAccountAddressForTezos(account);
  const evmAddress = getAccountAddressForEvm(account);
  const hasDerivationPath = isDefined(tezosAddress) || isDefined(evmAddress);

  return (
    <ScreenContainer>
      <ModalStatusBar />
      <Divider size={formatSize(8)} />
      <Label label="Account" description="Reveal a seed phrase from your HD account" />
      <AccountCard account={account} showAllAddresses />
      <Divider size={formatSize(24)} />
      {hasDerivationPath && (
        <>
          <Label
            label="Derivation path"
            description="This is key hierarchy blueprint to regenerate account from seed phrase."
          />
          {isDefined(tezosAddress) && (
            <CopyableDerivationPath
              value={getTezosDerivationPath(account.hdIndex)}
              network={CryptoLogoNameEnum.Tezos}
              testID={RevealSeedPharaseSelectors.tezosDerivationPath}
            />
          )}
          {isDefined(tezosAddress) && isDefined(evmAddress) && <Divider size={formatSize(16)} />}
          {isDefined(evmAddress) && (
            <CopyableDerivationPath
              value={getEvmDerivationPath(account.hdIndex)}
              network={CryptoLogoNameEnum.Etherlink}
              testID={RevealSeedPharaseSelectors.evmDerivationPath}
            />
          )}
          <Divider size={formatSize(16)} />
        </>
      )}
      <DisclaimerV2
        title="Attention!"
        texts={['DO NOT share this set of chars with anyone!', 'It can be used to steal your current account.']}
      />
      <Divider size={formatSize(16)} />
      <Label
        label="Seed phrase"
        description="Master key for all your accounts to access wallet if you switch browser or device. Keep it in secret."
      />
      <RevealSeedPhraseView publicKeyHash={tezosAddress ?? evmAddress ?? ''} />
      <Divider size={formatSize(24)} />
    </ScreenContainer>
  );
};
