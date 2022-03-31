export interface SecurityState {
  passwordAttempt: number;
  passwordTimelock: number;
}

export const securityInitialState: SecurityState = {
  passwordAttempt: 1,
  passwordTimelock: 0
};

export interface SecurityRootState {
  security: SecurityState;
}
