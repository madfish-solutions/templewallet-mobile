import { nanoid } from '@reduxjs/toolkit';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import WebView, { WebViewMessageEvent } from 'react-native-webview';
import { Subject } from 'rxjs';

import { showErrorToastByError } from 'src/toast/toast.utils';
import {
  clearSaplingFunctionsSupplement,
  setSaplingFunctionsSupplement
} from 'src/utils/sapling/sapling-functions-supplement';

export const useSetSaplingFunctionsSupplement = () => {
  const webViewRef = useRef<WebView>(null);
  const [isReady, setIsReady] = useState(false);
  const webViewMessageSubject = useMemo(() => new Subject<Record<string, unknown>>(), []);

  useEffect(() => {
    return () => clearSaplingFunctionsSupplement();
  }, []);

  const doSaplingProxyOperation = useCallback(
    (operation: Record<string, unknown>, errorTitle: string) =>
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      new Promise<any>((res, rej) => {
        const messageId = nanoid();
        const sub = webViewMessageSubject.subscribe(data => {
          if (data.id !== messageId) {
            return;
          }

          sub.unsubscribe();

          if ('error' in data) {
            const error = new Error(data.error as string);
            showErrorToastByError(error, errorTitle, true);
            rej(error);
          }

          res(data.result);
        });

        webViewRef.current!.postMessage(JSON.stringify({ ...operation, id: messageId }));
      }),
    [webViewMessageSubject]
  );

  const handleWebViewMessage = useCallback(
    (event: WebViewMessageEvent) => {
      try {
        const message = JSON.parse(event.nativeEvent.data);
        if (message.ready === undefined) {
          webViewMessageSubject.next(message);

          return;
        }

        setSaplingFunctionsSupplement({
          getProofAuthorizingKey: spendingKey =>
            doSaplingProxyOperation(
              { method: 'getProofAuthorizingKey', payload: { spendingKey } },
              'Failed to get proof authorizing key'
            ),
          prepareSpendDescriptionWithAuthorizingKey: (
            saplingContext,
            provingKey,
            address,
            randomCommitmentTrapdoor,
            publicKeyReRandomization,
            amount,
            root,
            witness
          ) =>
            doSaplingProxyOperation(
              {
                method: 'prepareSpendDescriptionWithAuthorizingKey',
                payload: {
                  saplingContext,
                  provingKey,
                  address,
                  randomCommitmentTrapdoor,
                  publicKeyReRandomization,
                  amount,
                  root,
                  witness
                }
              },
              'Failed to prepare spend description with authorizing key'
            ),
          deriveEpkFromEsk: (diversifier, esk) =>
            doSaplingProxyOperation(
              { method: 'deriveEpkFromEsk', payload: { diversifier, esk } },
              'Failed to derive ephemeral public key from esk'
            ),
          getOutgoingViewingKey: spendingKey =>
            doSaplingProxyOperation(
              { method: 'getOutgoingViewingKey', payload: { spendingKey } },
              'Failed to get outgoing viewing key'
            ),
          getRawPaymentAddress: (incomingViewingKey, diversifier) =>
            doSaplingProxyOperation(
              { method: 'getRawPaymentAddress', payload: { incomingViewingKey, diversifier } },
              'Failed to get raw payment address'
            ),
          keyAgreement: (p, sk) =>
            doSaplingProxyOperation({ method: 'keyAgreement', payload: { p, sk } }, 'Failed to perform key agreement'),
          getPkdFromRawPaymentAddress: address =>
            doSaplingProxyOperation(
              { method: 'getPkdFromRawPaymentAddress', payload: { address } },
              'Failed to get pkd from raw payment address'
            )
        });
        setIsReady(true);
      } catch (e) {
        console.error(e);
      }
    },
    [webViewMessageSubject, doSaplingProxyOperation]
  );

  return {
    isReady,
    webViewRef,
    handleWebViewMessage
  };
};
