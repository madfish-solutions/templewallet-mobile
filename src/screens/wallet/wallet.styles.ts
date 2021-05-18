import { createUseStyles } from '../../styles/create-use-styles';

export const useWalletStyles = createUseStyles(() => ({
  accountContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  buttonsContainer: {
    flexDirection: 'row'
  }
}));
