import { createUseStyles } from 'src/styles/create-use-styles';

export const useCreateWalletStyles = createUseStyles(({ typography }) => ({
  boldDescriptionPiece: {
    ...typography.caption13Semibold
  }
}));
