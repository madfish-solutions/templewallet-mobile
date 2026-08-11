import { IWalletKit, WalletKitTypes } from '@reown/walletkit';
import { PairingTypes, SessionTypes } from '@walletconnect/types';
import { getSdkError } from '@walletconnect/utils';

import { assert } from 'src/utils/assert.utils';
import { isDefined } from 'src/utils/is-defined';

import { walletKitPromise } from './walletkit';

const WALLET_KIT_ERROR = 'WalletKit not defined!';

type ApproveSessionParams = Parameters<IWalletKit['approveSession']>[0];
type RejectSessionParams = Parameters<IWalletKit['rejectSession']>[0];
type RespondSessionRequestParams = Parameters<IWalletKit['respondSessionRequest']>[0];

export class WcHandler {
  private static _walletKit: IWalletKit | undefined;
  private static _onSessionProposal: SyncFn<WalletKitTypes.SessionProposal> | undefined;
  private static _onSessionRequest: SyncFn<WalletKitTypes.SessionRequest> | undefined;
  private static _isListening = false;

  static async init(
    onSessionProposal: SyncFn<WalletKitTypes.SessionProposal>,
    onSessionRequest: SyncFn<WalletKitTypes.SessionRequest>,
    onSessionDelete: SyncFn<WalletKitTypes.SessionDelete>
  ) {
    if (!isDefined(WcHandler._walletKit)) {
      WcHandler._walletKit = await walletKitPromise;
    }

    WcHandler._onSessionProposal = onSessionProposal;
    WcHandler._onSessionRequest = onSessionRequest;

    if (!WcHandler._isListening) {
      WcHandler._isListening = true;

      WcHandler._walletKit.on('session_proposal', (proposal: WalletKitTypes.SessionProposal) =>
        WcHandler._onSessionProposal?.(proposal)
      );

      WcHandler._walletKit.on('session_request', (request: WalletKitTypes.SessionRequest) =>
        WcHandler._onSessionRequest?.(request)
      );

      WcHandler._walletKit.on('session_delete', args => onSessionDelete(args));
    }
  }

  public static readonly pair = async (uri: string) => {
    if (isDefined(WcHandler._walletKit)) {
      await WcHandler._walletKit.pair({ uri });
    }
  };

  public static readonly approveSession = (params: ApproveSessionParams) => {
    assert(WcHandler._walletKit, WALLET_KIT_ERROR);

    return WcHandler._walletKit.approveSession(params);
  };

  public static readonly rejectSession = (params: RejectSessionParams) => {
    assert(WcHandler._walletKit, WALLET_KIT_ERROR);

    return WcHandler._walletKit.rejectSession(params);
  };

  public static readonly respond = (params: RespondSessionRequestParams) => {
    assert(WcHandler._walletKit, WALLET_KIT_ERROR);

    return WcHandler._walletKit.respondSessionRequest(params);
  };

  public static readonly getActiveSessions = (): Promise<Record<string, SessionTypes.Struct>> => {
    assert(WcHandler._walletKit, WALLET_KIT_ERROR);

    return Promise.resolve(WcHandler._walletKit.getActiveSessions());
  };

  public static readonly getPairings = (): Promise<PairingTypes.Struct[]> => {
    assert(WcHandler._walletKit, WALLET_KIT_ERROR);

    return Promise.resolve(WcHandler._walletKit.core.pairing.getPairings());
  };

  public static readonly disconnectSession = (topic: string) => {
    assert(WcHandler._walletKit, WALLET_KIT_ERROR);

    return WcHandler._walletKit.disconnectSession({
      topic,
      reason: getSdkError('USER_DISCONNECTED')
    });
  };

  public static readonly disconnectAllSessions = () => {
    if (isDefined(WcHandler._walletKit)) {
      const sessions = Object.values(WcHandler._walletKit.getActiveSessions());

      return Promise.all(sessions.map((session: SessionTypes.Struct) => WcHandler.disconnectSession(session.topic)));
    }
  };

  public static readonly disconnectPairing = (topic: string) => {
    assert(WcHandler._walletKit, WALLET_KIT_ERROR);

    return WcHandler._walletKit.core.pairing.disconnect({ topic });
  };

  public static readonly disconnectAllPairings = () => {
    assert(WcHandler._walletKit, WALLET_KIT_ERROR);
    const pairings = WcHandler._walletKit.core.pairing.getPairings();

    return Promise.all(pairings.map((pairing: PairingTypes.Struct) => WcHandler.disconnectPairing(pairing.topic)));
  };
}

export const isWcUri = (uri: unknown): uri is `wc:${string}` => typeof uri === 'string' && uri.startsWith('wc:');
