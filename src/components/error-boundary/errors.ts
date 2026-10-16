import { StacksEnum } from 'src/navigator/enums/stacks.enum';
import { globalNavigationRef } from 'src/navigator/global-nav-ref';

export class BoundaryError extends Error {
  constructor(public readonly message: string, public readonly beforeTryAgain: EmptyFn) {
    super(message);

    Object.setPrototypeOf(this, BoundaryError.prototype);
  }
}

export class DeadEndBoundaryError extends BoundaryError {
  constructor() {
    super('🚧 🛠️ 🔜 🏗️', () => globalNavigationRef.current?.resetRoot({ routes: [{ name: StacksEnum.MainStack }] }));

    Object.setPrototypeOf(this, DeadEndBoundaryError.prototype);
  }
}
