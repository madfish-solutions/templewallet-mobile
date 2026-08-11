import { getSdkError } from '@walletconnect/utils';
import { useEffect } from 'react';
import { EmitterSubscription, Linking } from 'react-native';

import { ConfirmationTypeEnum } from '../interfaces/confirm-payload/confirmation-type.enum';
import { ModalsEnum } from '../navigator/enums/modals.enum';
import { useNavigateToModal, useNavigation } from '../navigator/hooks/use-navigation.hook';
import { dispatch } from '../store';
import { loadConnectionsActions } from '../store/d-apps/d-apps-actions';
import { showErrorToast } from '../toast/error-toast.utils';
import { isDefined } from '../utils/is-defined';
import { getUrlQueryParams } from '../utils/url.utils';

import { isSupportedWcMethod } from './constants';
import { getSessionProposalRejectReason } from './validate-session-proposal';
import { isWcUri, WcHandler } from './wc-handler';

export const wcDeepLinkHandler = async (url: string | null, onValidDataCallback: EmptyFn, onError: SyncFn<string>) => {
  try {
    if (isWcUri(url)) {
      onValidDataCallback();
      await WcHandler.pair(url).catch(error => {
        onError(error.toString());
      });
    } else if (url?.startsWith('temple://wc')) {
      const searchParams = getUrlQueryParams(url);
      const uri = searchParams.get('uri');

      if (isDefined(uri)) {
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
        const rejectReason = getSessionProposalRejectReason(proposal);

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
        const { method } = request.params.request;

        if (!isSupportedWcMethod(method)) {
          void WcHandler.respond({
            topic: request.topic,
            response: {
              id: request.id,
              jsonrpc: '2.0',
              error: getSdkError('WC_METHOD_UNSUPPORTED')
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
