export type SignInParams = {
  pk: string;
  timestamp: string;
  sig: string;
};

export type SignInResponse = {
  accessToken: string;
};
