import React, { FC, isValidElement, memo, useMemo } from 'react';
import { Text, View } from 'react-native';

import { LinkWithIcon } from 'src/components/link-with-icon/link-with-icon';
import { isDefined } from 'src/utils/is-defined';

import { useCollectiblePropertiesStyles, useCollectiblePropertyStyles } from './styles';
import { getRoyalties } from './utils/get-royalties.util';
import { getTzktContractLink } from './utils/get-tzkt-contract-link.util';

interface Props {
  editions: number;
  owned: string;
  minted: string;
  royalties: {
    decimals: number;
    amount: number;
  }[];
  contract: string;
  metadata: string;
  tokenId: number;
}

export const CollectibleProperties = memo<Props>(
  ({ contract, editions, metadata, minted, owned, royalties, tokenId }) => {
    const styles = useCollectiblePropertiesStyles();

    const properties = useMemo(() => {
      const date = isDefined(minted) && minted !== '' ? new Date(minted) : undefined;

      const formattedDate = new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      }).format(date);

      const hash = isDefined(metadata) && metadata.trim() !== '' ? metadata.split('/')[2] : null;
      const formattedMetadataLink = `https://ipfs.io/ipfs/${hash}`;

      return [
        {
          name: 'Editions',
          value: editions ?? null
        },
        {
          name: 'Owned',
          value: owned ?? null
        },
        {
          name: 'Minted',
          value: formattedDate
        },
        {
          name: 'Royalties',
          value: getRoyalties(royalties)
        },
        {
          name: 'Contract',
          value: <LinkWithIcon text={contract} link={getTzktContractLink(contract)} valueToClipboard={contract} />
        },
        {
          name: 'Metadata',
          value: <LinkWithIcon text="IPFS" link={formattedMetadataLink} />
        },
        {
          name: 'Token ID',
          value: tokenId
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
  }
);

interface CollectiblePropertyProps {
  name: string;
  value: JSX.Element | number | string | null;
}

const CollectibleProperty: FC<CollectiblePropertyProps> = ({ name, value }) => {
  const styles = useCollectiblePropertyStyles();

  return (
    <View style={styles.root}>
      <Text style={styles.name}>{name}</Text>
      {isValidElement(value) ? value : <Text style={styles.value}>{value}</Text>}
    </View>
  );
};
