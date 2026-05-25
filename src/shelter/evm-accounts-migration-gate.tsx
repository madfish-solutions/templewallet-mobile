import React, { memo, useCallback, useEffect, useRef, useState } from 'react';
import { ActivityIndicator, BackHandler, Modal, Text, View } from 'react-native';
import { useDispatch } from 'react-redux';

import { ButtonLargePrimary } from 'src/components/button/button-large/button-large-primary/button-large-primary';
import { ButtonLargeSecondary } from 'src/components/button/button-large/button-large-secondary/button-large-secondary';
import { ButtonsContainer } from 'src/components/button/buttons-container/buttons-container';
import { Divider } from 'src/components/divider/divider';
import { InsetSubstitute } from 'src/components/inset-substitute/inset-substitute';
import { ModalStatusBar } from 'src/components/modal-status-bar/modal-status-bar';
import { persistor } from 'src/store';
import { useSelector } from 'src/store/selector';
import { useIsAuthorisedSelector } from 'src/store/wallet/wallet-selectors';
import { formatSize } from 'src/styles/format-size';
import { useColors } from 'src/styles/use-colors';

import { useAppLock } from './app-lock/app-lock';
import {
  getEvmAccountsMigrationErrorMessage,
  isEvmAccountsMigrationComplete,
  runEvmAccountsMigration,
  walletNeedsEvmAccountsMigration
} from './evm-accounts-migration';
import { useEvmAccountsMigrationGateStyles } from './evm-accounts-migration-gate.styles';

type MigrationStatus = 'idle' | 'checking' | 'migrating' | 'failed';

export const EvmAccountsMigrationGate: FCWithChildren = memo(({ children }) => {
  const dispatch = useDispatch();
  const wallet = useSelector(({ wallet }) => wallet);
  const isAuthorised = useIsAuthorisedSelector();
  const { isLocked, lock } = useAppLock();
  const colors = useColors();
  const styles = useEvmAccountsMigrationGateStyles();
  const migrationInProgressRef = useRef(false);
  const completedCheckRef = useRef(false);
  const [status, setStatus] = useState<MigrationStatus>('idle');
  const [errorMessage, setErrorMessage] = useState<string>();

  const startMigration = useCallback(async () => {
    if (migrationInProgressRef.current || !isAuthorised || isLocked || wallet.accounts.length === 0) {
      return;
    }

    const needsRuntimeMigration = walletNeedsEvmAccountsMigration(wallet);

    if (completedCheckRef.current && !needsRuntimeMigration) {
      return;
    }

    migrationInProgressRef.current = true;
    setStatus('checking');
    setErrorMessage(undefined);

    try {
      const markerComplete = await isEvmAccountsMigrationComplete();

      if (markerComplete && !needsRuntimeMigration) {
        completedCheckRef.current = true;
        setStatus('idle');

        return;
      }

      setStatus('migrating');
      await runEvmAccountsMigration({
        wallet,
        dispatch,
        flushPersistor: () => persistor.flush()
      });
      completedCheckRef.current = true;
      setStatus('idle');
    } catch (error) {
      console.error('[EVM account migration] Failed', error);
      setErrorMessage(getEvmAccountsMigrationErrorMessage(error));
      setStatus('failed');
    } finally {
      migrationInProgressRef.current = false;
    }
  }, [dispatch, isAuthorised, isLocked, wallet]);

  useEffect(() => {
    void startMigration();
  }, [startMigration]);

  useEffect(() => {
    if (status === 'idle') {
      return;
    }

    const subscription = BackHandler.addEventListener('hardwareBackPress', () => true);

    return () => subscription.remove();
  }, [status]);

  const handleLockPress = useCallback(() => {
    setStatus('idle');
    lock();
  }, [lock]);

  const isBlocking = status !== 'idle';
  const isFailed = status === 'failed';

  return (
    <>
      {children}
      <Modal visible={isBlocking} animationType="fade" transparent={false}>
        <ModalStatusBar />
        <View style={styles.overlay}>
          <View style={styles.content}>
            {!isFailed ? (
              <>
                <ActivityIndicator size="large" color={colors.orange} style={styles.loader} />
                <Divider size={formatSize(24)} />
              </>
            ) : null}
            <Text style={styles.title}>Updating wallet accounts</Text>
            <Divider size={formatSize(12)} />
            <Text style={[styles.body, isFailed && styles.error]}>
              {isFailed
                ? errorMessage
                : 'Temple Wallet is preparing your accounts for EVM support. This usually takes a few seconds.'}
            </Text>
          </View>
          {isFailed ? (
            <>
              <Divider size={formatSize(32)} />
              <ButtonsContainer style={styles.buttons}>
                <ButtonLargePrimary title="Retry" onPress={startMigration} />
                <ButtonLargeSecondary title="Lock" onPress={handleLockPress} />
              </ButtonsContainer>
            </>
          ) : null}
          <InsetSubstitute type="bottom" />
        </View>
      </Modal>
    </>
  );
});
