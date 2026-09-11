import React, { useMemo } from 'react';
import { View } from 'react-native';

import { CryptoLogoNameEnum } from 'src/components/crypto-logo/logo-name.enum';
import { ScreenContainer } from 'src/components/screen-container/screen-container';
import { TempleChainKind } from 'src/enums/temple-chain-kind.enum';
import { ModalsEnum } from 'src/navigator/enums/modals.enum';
import { useModalParams } from 'src/navigator/hooks/use-navigation.hook';
import { useSaplingAddressSelector } from 'src/store/sapling';
import { useAccount } from 'src/store/wallet/wallet-selectors';
import { getAccountAddressForEvm, getAccountAddressForTezos } from 'src/utils/account.utils';
import { usePageAnalytic } from 'src/utils/analytics/use-analytics.hook';
import { isString } from 'src/utils/is-string';

import { AddressCard } from './address-card';
import { useReceiveModalStyles } from './receive-modal.styles';
import { AddressCardProps } from './types';

const makeTezosComponentsProps = (tezosAddress: string) => ({
  title: 'Tezos',
  address: tezosAddress,
  cryptoLogoName: CryptoLogoNameEnum.Tezos,
  warningText: 'Send only Tezos network tokens to this address'
});

const makeEtherlinkComponentsProps = (evmAddress: string) => ({
  title: 'Etherlink',
  address: evmAddress,
  cryptoLogoName: CryptoLogoNameEnum.Etherlink,
  warningText: 'Send only Etherlink network tokens to this address'
});

const makeTezosSaplingComponentsProps = (saplingAddress: string) => ({
  title: 'Shielded Tezos',
  address: saplingAddress,
  cryptoLogoName: CryptoLogoNameEnum.ShieldedTezos,
  warningText: 'Send only TEZ to this address',
  showWarningOnCard: true
});

const cardKeyExtractor = ({ address, title }: AddressCardProps) => `${title}-${address}`;

export const ReceiveModal = () => {
  const selectedAccount = useAccount();
  const tezosAddress = getAccountAddressForTezos(selectedAccount);
  const evmAddress = getAccountAddressForEvm(selectedAccount);
  const styles = useReceiveModalStyles();
  const saplingAddress = useSaplingAddressSelector();
  const { chainKind, withShielded = true } = useModalParams<ModalsEnum.Receive>();

  const cardsContentProps = useMemo(() => {
    const componentsProps: AddressCardProps[] = [];

    if (isString(tezosAddress) && chainKind !== TempleChainKind.EVM) {
      componentsProps.push(makeTezosComponentsProps(tezosAddress));
    }

    if (isString(tezosAddress) && isString(saplingAddress) && chainKind !== TempleChainKind.EVM && withShielded) {
      componentsProps.push(makeTezosSaplingComponentsProps(saplingAddress));
    }

    if (isString(evmAddress) && chainKind !== TempleChainKind.Tezos) {
      componentsProps.push(makeEtherlinkComponentsProps(evmAddress));
    }

    return componentsProps;
  }, [evmAddress, saplingAddress, tezosAddress, chainKind, withShielded]);

  usePageAnalytic(ModalsEnum.Receive);

  return (
    <ScreenContainer isFullScreenMode contentContainerStyle={styles.cardsListContainer}>
      <View style={styles.cardsList}>
        {cardsContentProps.map(props => (
          <AddressCard {...props} key={cardKeyExtractor(props)} />
        ))}
      </View>
    </ScreenContainer>
  );
};
