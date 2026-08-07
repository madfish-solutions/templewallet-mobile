import React, { FC, isValidElement, memo, ReactElement, useMemo } from 'react';
import { Text, View } from 'react-native';

import { CryptoLogoNameEnum } from 'src/components/crypto-logo/logo-name.enum';
import { LinkWithIcon } from 'src/components/link-with-icon/link-with-icon';
import { NetworkIcon } from 'src/components/network-icon';
import { CollectibleDetailsInterface } from 'src/token/interfaces/collectible-interfaces.interface';
import { isDefined } from 'src/utils/is-defined';

import { useCollectiblePropertiesStyles, useCollectiblePropertyStyles } from './styles';
import { getTzktContractLink } from './utils/get-tzkt-contract-link.util';
import { reduceRoyalties } from './utils/royalties';

interface Props {
  contract: string;
  tokenId: number;
  details: CollectibleDetailsInterface | nullish;
  owned: string;
}

export const CollectibleProperties = memo<Props>(({ contract, tokenId, details, owned }) => {
  const styles = useCollectiblePropertiesStyles();

  const { metadata, editions, royalties, timestamp: minted } = details || {};

  const properties = useMemo(() => {
    const date = isDefined(minted) && minted !== '' ? new Date(minted) : undefined;

    const formattedDate = date
      ? new Intl.DateTimeFormat('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        }).format(date)
      : null;

    const hash = isDefined(metadata) && metadata.trim() !== '' ? metadata.split('/')[2] : null;
    const formattedMetadataLink = `https://ipfs.io/ipfs/${hash}`;

    return [
      {
        name: 'Chain',
        value: <ChainValue />
      },
      {
        name: 'Token standard',
        value: 'FA2'
      },
      {
        name: 'Token ID',
        value: tokenId
      },
      {
        name: 'Token contract',
        value: <LinkWithIcon text={contract} link={getTzktContractLink(contract)} valueToClipboard={contract} />
      },
      {
        name: 'Minted',
        value: formattedDate
      },
      {
        name: 'Royalties',
        value: royalties ? reduceRoyalties(royalties) : null
      },
      {
        name: 'Metadata',
        value: <LinkWithIcon text="IPFS" link={formattedMetadataLink} />
      },
      {
        name: 'Owned',
        value: owned ?? null
      },
      {
        name: 'Editions',
        value: editions ?? null
      }
    ].filter(isDefined);
  }, [editions, owned, minted, royalties, contract, metadata, tokenId]);

  return (
    <View style={styles.root}>
      {properties.map(({ name, value }) => (
        <CollectibleProperty key={name} name={name} value={value} />
      ))}
    </View>
  );
});

const ChainValue = memo(() => {
  const styles = useCollectiblePropertyStyles();

  return (
    <View style={styles.chainValue}>
      <Text style={styles.chainName}>Tezos</Text>
      <NetworkIcon name={CryptoLogoNameEnum.Tezos} variant="nftBadge" />
    </View>
  );
});

interface CollectiblePropertyProps {
  name: string;
  value: ReactElement | number | string | null;
}

const CollectibleProperty: FC<CollectiblePropertyProps> = ({ name, value }) => {
  const styles = useCollectiblePropertyStyles();

  return (
    <View style={styles.root}>
      <Text style={styles.name}>{name}</Text>
      {/* TODO: Tune type system to forbid falsy nodes */}
      {isValidElement(value) ? value : <Text style={styles.value}>{value}</Text>}
    </View>
  );
};
