export interface LoadableEntityState<T> {
  data: T;
  error?: string;
  isLoading: boolean;
}

export interface SendInterface {
  from: string;
  amount: string;
  to: string;
}
