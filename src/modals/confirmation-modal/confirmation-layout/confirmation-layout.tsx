import React, { FC, ReactNode } from 'react';
import { Text, View } from 'react-native';

import { AccountCard } from 'src/components/account-card/account-card';
import { ButtonLargePrimary } from 'src/components/button/button-large/button-large-primary/button-large-primary';
import { ButtonLargeSecondary } from 'src/components/button/button-large/button-large-secondary/button-large-secondary';
import { Divider } from 'src/components/divider/divider';
import { LoadingPlaceholder } from 'src/components/loading-placeholder/loading-placeholder';
import { ScreenContainer } from 'src/components/screen-container/screen-container';
import { TempleChainKind } from 'src/enums/temple-chain-kind.enum';
import { Account } from 'src/interfaces/account.interfaces';
import { TestIdProps } from 'src/interfaces/test-id.props';
import { ModalButtonsFloatingContainer } from 'src/layouts/modal-buttons-floating-container';
import { formatSize } from 'src/styles/format-size';

import { useConfirmationLayoutStyles } from './confirmation-layout.styles';

interface ConfirmationAction extends TestIdProps {
  disabled?: boolean;
  isLoading?: boolean;
  onPress: EmptyFn;
  title?: string;
}

interface Props {
  account?: Account;
  accountChainKind: TempleChainKind;
  isShieldedTez?: boolean;
  preview: ReactNode;
  details?: ReactNode;
  headerContent?: ReactNode;
  beforeAccount?: ReactNode;
  afterPreview?: ReactNode;
  bottomContent?: ReactNode;
  isContentLoading?: boolean;
  loadingText?: string;
  backAction: ConfirmationAction;
  confirmAction: ConfirmationAction;
}

export const ConfirmationLayout: FC<Props> = ({
  account,
  accountChainKind,
  isShieldedTez = false,
  preview,
  details,
  headerContent,
  beforeAccount,
  afterPreview,
  bottomContent,
  isContentLoading = false,
  loadingText = 'Operation is loading...',
  backAction,
  confirmAction
}) => {
  const styles = useConfirmationLayoutStyles();

  return (
    <>
      <ScreenContainer>
        {headerContent}
        {isContentLoading ? (
          <LoadingPlaceholder text={loadingText} />
        ) : (
          <>
            {beforeAccount}

            <Text style={styles.sectionTitle}>Account</Text>
            <Divider />
            {account ? (
              <AccountCard account={account} chainKind={accountChainKind} isShieldedTez={isShieldedTez} />
            ) : null}
            <Divider size={formatSize(24)} />

            <Text style={styles.sectionTitle}>Preview</Text>
            <Divider size={formatSize(12)} />
            <View style={styles.divider} />
            <Divider size={formatSize(8)} />

            {preview}
            {afterPreview}
            {details}
          </>
        )}
        {bottomContent}
      </ScreenContainer>

      <ModalButtonsFloatingContainer variant="bordered">
        <ButtonLargeSecondary title="Back" {...backAction} />
        <ButtonLargePrimary {...confirmAction} title={confirmAction.title ?? 'Confirm'} />
      </ModalButtonsFloatingContainer>
    </>
  );
};
