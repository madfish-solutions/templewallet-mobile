export interface ImportWalletCredentials {
  seedPhrase: string;
  password?: string;
}

export interface ImportWalletProps {
  onSubmit: (formValues: ImportWalletCredentials) => void;
}
