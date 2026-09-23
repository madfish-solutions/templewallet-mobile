import { WalletKitTypes } from '@reown/walletkit';
import { ProposalTypes } from '@walletconnect/types';
import { getSdkError } from '@walletconnect/utils';
import { uniq } from 'lodash-es';

import { Account } from 'src/interfaces/account.interfaces';
import { isSupportedWcEvent, isSupportedWcMethod } from 'src/types/strict-wc-session-request';
import { toEvmCaipChainId } from 'src/utils/evm/caip.utils';
import { ETHERLINK_MAINNET_CHAIN_ID } from 'src/utils/rpc/rpc-list';

import { hasEvmAccount } from './wc-account.utils';

const SUPPORTED_WC_CHAINS = [toEvmCaipChainId(ETHERLINK_MAINNET_CHAIN_ID)];

export const isSupportedWcChain = (caipChainId: string) => SUPPORTED_WC_CHAINS.includes(caipChainId);

/** CAIP-10 chain-agnostic EOA id — dApps use this to accept any EVM chain the wallet offers. */
const EIP155_CHAIN_AGNOSTIC_ID = 'eip155:0';

const isEip155NamespaceKey = (namespaceKey: string) => namespaceKey === 'eip155' || namespaceKey.startsWith('eip155:');

const isEip155ChainAgnostic = (caipChainId: string) => caipChainId === EIP155_CHAIN_AGNOSTIC_ID;

const getChains = (namespaceKey: string, namespace: ProposalTypes.RequiredNamespace) => {
  if (namespace.chains && namespace.chains.length > 0) {
    return namespace.chains;
  }

  return namespaceKey.includes(':') ? [namespaceKey] : [];
};

const resolveConcreteWcChains = (chains: string[]) => {
  const concreteChains = chains.filter(chain => !isEip155ChainAgnostic(chain));

  if (concreteChains.length === 0 && chains.some(isEip155ChainAgnostic)) {
    return SUPPORTED_WC_CHAINS;
  }

  return concreteChains;
};

const normalizeNamespaceChains = (namespace: ProposalTypes.RequiredNamespace): ProposalTypes.RequiredNamespace => {
  if (!namespace.chains || namespace.chains.length === 0 || !namespace.chains.some(isEip155ChainAgnostic)) {
    return namespace;
  }

  return {
    ...namespace,
    chains: resolveConcreteWcChains(namespace.chains)
  };
};

const normalizeProposalNamespaces = (
  namespaces: ProposalTypes.RequiredNamespaces
): ProposalTypes.RequiredNamespaces => {
  const normalized: ProposalTypes.RequiredNamespaces = {};

  for (const [namespaceKey, namespace] of Object.entries(namespaces)) {
    if (isEip155ChainAgnostic(namespaceKey)) {
      const existing = normalized.eip155;
      const remapped = normalizeNamespaceChains({
        ...namespace,
        chains: resolveConcreteWcChains(namespace.chains ?? [namespaceKey])
      });

      normalized.eip155 = existing
        ? {
            ...existing,
            chains: uniq((existing.chains ?? []).concat(remapped.chains ?? [])),
            methods: uniq(existing.methods.concat(remapped.methods)),
            events: uniq(existing.events.concat(remapped.events))
          }
        : remapped;

      continue;
    }

    normalized[namespaceKey] = normalizeNamespaceChains(namespace);
  }

  return normalized;
};

/**
 * Replaces chain-agnostic `eip155:0` requests with our concrete supported chains so
 * `buildApprovedNamespaces` can approve a real session instead of an empty/non-conforming one.
 */
export const normalizeSessionProposalParams = (params: ProposalTypes.Struct): ProposalTypes.Struct => ({
  ...params,
  requiredNamespaces: normalizeProposalNamespaces(params.requiredNamespaces),
  optionalNamespaces: normalizeProposalNamespaces(params.optionalNamespaces ?? {})
});

export const getSessionProposalRejectReason = (proposal: WalletKitTypes.SessionProposal, accounts: Account[]) => {
  if (!hasEvmAccount(accounts)) {
    return getSdkError('UNSUPPORTED_ACCOUNTS');
  }

  const { requiredNamespaces, optionalNamespaces } = proposal.params;
  let allRequiredChains: string[] = [];
  let supportedOptionalChains: string[] = [];

  for (const [namespaceKey, namespace] of Object.entries(requiredNamespaces)) {
    if (!isEip155NamespaceKey(namespaceKey)) {
      return getSdkError('UNSUPPORTED_NAMESPACE_KEY');
    }

    const requiredChains = resolveConcreteWcChains(getChains(namespaceKey, namespace));
    allRequiredChains = allRequiredChains.concat(requiredChains);

    if (requiredChains.some(chain => !SUPPORTED_WC_CHAINS.includes(chain))) {
      return getSdkError('UNSUPPORTED_CHAINS');
    }

    if (namespace.methods.some(method => !isSupportedWcMethod(method))) {
      return getSdkError('UNSUPPORTED_METHODS');
    }

    if (namespace.events.some(event => !isSupportedWcEvent(event))) {
      return getSdkError('UNSUPPORTED_EVENTS');
    }
  }

  for (const [namespaceKey, namespace] of Object.entries(optionalNamespaces)) {
    if (!isEip155NamespaceKey(namespaceKey)) {
      continue;
    }

    const optionalChains = resolveConcreteWcChains(getChains(namespaceKey, namespace));
    supportedOptionalChains = supportedOptionalChains.concat(
      optionalChains.filter(chain => SUPPORTED_WC_CHAINS.includes(chain) && namespace.methods.some(isSupportedWcMethod))
    );
  }

  if (allRequiredChains.length === 0 && supportedOptionalChains.length === 0) {
    return getSdkError('UNSUPPORTED_CHAINS');
  }

  return undefined;
};
