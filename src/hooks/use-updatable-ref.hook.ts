import { useRef } from 'react';

export const useUpdatableRef = <T>(value: T) => {
  const ref = useRef<T>(value);
  ref.current = value;

  return ref;
};
