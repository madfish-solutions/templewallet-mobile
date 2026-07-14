import React, { useEffect, useMemo, useState } from 'react';
import { View } from 'react-native';

import { useBottomSheetController } from 'src/components/bottom-sheet/use-bottom-sheet-controller';
import { CryptoLogoNameEnum } from 'src/components/crypto-logo/logo-name.enum';
import { ScreenContainer } from 'src/components/screen-container/screen-container';
import { ModalsEnum } from 'src/navigator/enums/modals.enum';
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
  warningText: 'Send only Tezos tokens to this address'
});

const makeEtherlinkComponentsProps = (evmAddress: string) => ({
  title: 'Etherlink',
  address: evmAddress,
  cryptoLogoName: CryptoLogoNameEnum.Etherlink,
  warningText: 'Send only Etherlink tokens to this address'
});

const makeTezosSaplingComponentsProps = (saplingAddress: string) => ({
  title: 'Shielded Tezos',
  address: saplingAddress,
  cryptoLogoName: CryptoLogoNameEnum.ShieldedTezos,
  warningText: 'Send only TEZ tokens to this address',
  showWarningOnCard: true
});

const cardKeyExtractor = ({ address, title }: AddressCardProps) => `${title}-${address}`;

export const ReceiveModal = () => {
  const qrCodeBottomSheetController = useBottomSheetController();
  const selectedAccount = useAccount();
  const tezosAddress = getAccountAddressForTezos(selectedAccount);
  const evmAddress = getAccountAddressForEvm(selectedAccount);
  const styles = useReceiveModalStyles();
  const saplingAddress = useSaplingAddressSelector();

  const [shouldOpenQrCode, setShouldOpenQrCode] = useState(false);
  useEffect(() => {
    if (shouldOpenQrCode) {
      qrCodeBottomSheetController.open();
      setShouldOpenQrCode(false);
    }
  }, [shouldOpenQrCode, qrCodeBottomSheetController]);

  const cardsContentProps = useMemo(() => {
    const componentsProps: AddressCardProps[] = [];

    if (isString(tezosAddress)) {
      componentsProps.push(makeTezosComponentsProps(tezosAddress));
    }

    if (isString(tezosAddress) && isString(saplingAddress)) {
      componentsProps.push(makeTezosSaplingComponentsProps(saplingAddress));
    }

    if (isString(evmAddress)) {
      componentsProps.push(makeEtherlinkComponentsProps(evmAddress));
    }

    return componentsProps;
  }, [evmAddress, saplingAddress, tezosAddress]);

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
