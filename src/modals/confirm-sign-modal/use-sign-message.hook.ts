import { packDataBytes } from '@taquito/michel-codec';
import { useEffect, useMemo, useState } from 'react';
import { useDispatch } from 'react-redux';
import { EMPTY, Subject, catchError, from, map, switchMap, tap } from 'rxjs';

import {
  createStableDiffusionOrder,
  getStableDiffusionAccessToken,
  handleStableDiffusionError
} from 'src/apis/stable-diffusion';
import { ScreensEnum } from 'src/navigator/enums/screens.enum';
import { useNavigation } from 'src/navigator/hooks/use-navigation.hook';
import { CreateNftFormValues } from 'src/screens/text-to-nft/generate-art/tabs/create/create.form';
import { Shelter } from 'src/shelter/shelter';
import { setAccessTokenAction } from 'src/store/text-to-nft/text-to-nft-actions';
import { useSelectedAccountSelector } from 'src/store/wallet/wallet-selectors';
import { showErrorToast, showSuccessToast } from 'src/toast/toast.utils';
import { isDefined } from 'src/utils/is-defined';
import { isString } from 'src/utils/is-string';

const timestamp = new Date().toISOString();
const message = `Tezos Signed Message: To authenticate on Temple NFT service and verify that I am the owner of the connected wallet, I am signing this message ${timestamp}.`;
const messageBytes = packDataBytes({ string: message }).bytes;

export const useSignMessage = (formValues: CreateNftFormValues) => {
  const dispatch = useDispatch();
  const { navigate } = useNavigation();

  const [isLoading, setIsLoading] = useState(false);

  const account = useSelectedAccountSelector();

  const [signature, setSignature] = useState<string>();
  const confirmRequest$ = useMemo(() => new Subject<string>(), []);

  useEffect(() => {
    const subscription = confirmRequest$
      .pipe(
        tap(() => setIsLoading(true)),
        switchMap(message =>
          Shelter.getSigner$(account.publicKeyHash).pipe(
            switchMap(signer => signer.sign(message)),
            map(sign => {
              showSuccessToast({ description: 'Successfully signed!' });

              return sign;
            })
          )
        ),
        catchError(err => {
          setIsLoading(false);

          showErrorToast({ description: err.message });

          return EMPTY;
        })
      )
      .subscribe(({ prefixSig }) => {
        setSignature(prefixSig);
      });

    return () => subscription.unsubscribe();
  }, [confirmRequest$, account.publicKeyHash]);

  useEffect(() => {
    if (isString(signature)) {
      const subscription = from(getStableDiffusionAccessToken({ timestamp, pk: account.publicKey, sig: signature }))
        .pipe(
          switchMap(accessToken =>
            from(createStableDiffusionOrder(accessToken, formValues)).pipe(
              map(order => order),
              tap(() => {
                dispatch(setAccessTokenAction({ accountPkh: account.publicKeyHash, accessToken }));
                setIsLoading(false);
              })
            )
          ),
          catchError(e => {
            handleStableDiffusionError(e);

            return EMPTY;
          })
        )
        .subscribe(order => {
          if (isDefined(order)) {
            navigate(ScreensEnum.Preview, { orderId: order.id });
          }
        });

      return () => subscription.unsubscribe();
    }
  }, [signature]);

  const signMessage = () => confirmRequest$.next(messageBytes);

  return { messagePreview: message, messageBytes, isLoading, signMessage };
};
