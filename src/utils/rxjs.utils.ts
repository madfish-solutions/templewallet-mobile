import { throwError } from 'rxjs';

export const throwError$ = (message?: string) => throwError(() => new Error(message));
