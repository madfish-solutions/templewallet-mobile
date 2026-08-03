import React, { FC } from 'react';
import { Text, View } from 'react-native';

import { AccountCard, AccountSummary } from 'src/components/account-card/account-card';
import { CryptoLogo } from 'src/components/crypto-logo';
import { CryptoLogoNameEnum } from 'src/components/crypto-logo/logo-name.enum';
import { TempleChainKind } from 'src/enums/temple-chain-kind.enum';
import { ContactReceiver, SendReceiver } from 'src/interfaces/send-receiver.interface';
import { formatSize } from 'src/styles/format-size';

import { useContactFormSectionDropdownStyles } from './contact-form-section-dropdown.styles';

interface Props {
  receiver: SendReceiver;
  chainKind: TempleChainKind;
  isShieldedTez: boolean;
  showDropdownDown?: boolean;
  withCard?: boolean;
}

export const ReceiverRow: FC<Props> = ({
  receiver,
  chainKind,
  isShieldedTez,
  showDropdownDown = false,
  withCard = false
}) => {
  if (receiver.kind === 'contact') {
    return <ContactReceiverRow receiver={receiver} logoName={getLogoName(chainKind, isShieldedTez)} />;
  }

  const accountProps = {
    account: receiver.account,
    chainKind,
    isShieldedTez,
    showDropdownDown
  };

  return withCard ? <AccountCard {...accountProps} /> : <AccountSummary {...accountProps} />;
};

interface ContactReceiverRowProps {
  receiver: ContactReceiver;
  logoName: CryptoLogoNameEnum;
}

const ContactReceiverRow: FC<ContactReceiverRowProps> = ({ receiver, logoName }) => {
  const styles = useContactFormSectionDropdownStyles();

  return (
    <View style={styles.contactContainer}>
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>{receiver.name.slice(0, 1).toUpperCase()}</Text>
      </View>
      <View style={styles.info}>
        <View style={styles.nameRow}>
          <Text numberOfLines={1} style={styles.name}>
            {receiver.name}
          </Text>
        </View>
        {!!receiver.address && (
          <View style={styles.addressRow}>
            <CryptoLogo name={logoName} size={formatSize(14)} internalSize={formatSize(14)} />
            <Text style={styles.address}>{truncateAddress(receiver.address)}</Text>
          </View>
        )}
      </View>
    </View>
  );
};

const getLogoName = (chainKind: TempleChainKind, isShieldedTez: boolean) =>
  isShieldedTez
    ? CryptoLogoNameEnum.ShieldedTezos
    : chainKind === TempleChainKind.Tezos
    ? CryptoLogoNameEnum.Tezos
    : CryptoLogoNameEnum.Etherlink;

const truncateAddress = (address: string) =>
  address.length > 12 ? `${address.slice(0, 6)}...${address.slice(-6)}` : address;
