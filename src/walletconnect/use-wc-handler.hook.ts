import { useEffect } from 'react';
import { EmitterSubscription, Linking } from 'react-native';

import { ConfirmationTypeEnum } from '../interfaces/confirm-payload/confirmation-type.enum';
import { ModalsEnum } from '../navigator/enums/modals.enum';
import { useNavigateToModal, useNavigation } from '../navigator/hooks/use-navigation.hook';
import { dispatch, store } from '../store';
import { loadConnectionsActions } from '../store/d-apps/d-apps-actions';
import { showErrorToast } from '../toast/error-toast.utils';
import { getSelectedAccountFromWallet } from '../utils/get-selected-account-from-wallet.util';
import { isDefined } from '../utils/is-defined';
import { isString } from '../utils/is-string';
import { getUrlQueryParams } from '../utils/url.utils';

import { getSessionProposalRejectReason } from './validate-session-proposal';
import { getSessionRequestRejectReason } from './validate-session-request';
import { isWcUniversalLink, isWcUri, WcHandler } from './wc-handler';

export const wcDeepLinkHandler = async (url: string | null, onValidDataCallback: EmptyFn, onError: SyncFn<string>) => {
  try {
    if (isWcUri(url)) {
      onValidDataCallback();
      await WcHandler.pair(url).catch(error => {
        onError(error.toString());
      });
    } else if (isString(url) && (url.startsWith('temple://wc') || isWcUniversalLink(url))) {
      const searchParams = getUrlQueryParams(url);
      const uri = searchParams.get('uri');

      if (isString(uri)) {
        onValidDataCallback();
        await WcHandler.pair(uri).catch(error => {
          onError(error.toString());
        });
      }
    }
  } catch {}
};

export const useWcHandler = () => {
  const navigateToModal = useNavigateToModal();
  const { goBack } = useNavigation();

  useEffect(() => {
    const listener = ({ url }: { url: string | null }) =>
      wcDeepLinkHandler(
        url ?? '',
        () => {
          // WC handler will do the rest
        },
        errorMessage => {
          goBack();
          showErrorToast({ description: errorMessage });
        }
      );

    let emitter: EmitterSubscription;

    WcHandler.init(
      proposal => {
        const rejectReason = getSessionProposalRejectReason(proposal, store.getState().wallet.accounts);

        if (isDefined(rejectReason)) {
          void WcHandler.rejectSession({
            id: proposal.id,
            reason: rejectReason
          }).catch(error => {
            console.error(error);
          });

          return;
        }

        navigateToModal(ModalsEnum.Confirmation, { type: ConfirmationTypeEnum.WcSessionProposal, proposal });
      },
      request => {
        console.log('request', request);
        const { wallet } = store.getState();
        const rejectReason = getSessionRequestRejectReason(
          request,
          wallet.accounts,
          getSelectedAccountFromWallet(wallet)
        );

        if (isDefined(rejectReason)) {
          void WcHandler.respond({
            topic: request.topic,
            response: {
              id: request.id,
              jsonrpc: '2.0',
              error: rejectReason
            }
          }).catch(error => {
            console.error(error);
          });

          return;
        }

        navigateToModal(ModalsEnum.Confirmation, { type: ConfirmationTypeEnum.WcSessionRequest, request });
      },
      () => dispatch(loadConnectionsActions.submit())
    )
      .then(() => {
        emitter = Linking.addEventListener('url', listener);
        Linking.getInitialURL().then(url => listener({ url }));
      })
      .catch(error => {
        console.error(error);
      });

    return () => (isDefined(emitter) ? emitter.remove() : undefined);
  }, []);
};
