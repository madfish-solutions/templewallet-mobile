import { act, renderHook } from '@testing-library/react-native';
import { useDispatch } from 'react-redux';

import { hideLoaderAction } from 'src/store/settings/settings-actions';

import { useResetWalletLoader } from './use-reset-wallet-loader.hook';

interface HookProps {
  isAuthorised: boolean;
  isShowLoader: boolean;
}

const mockDispatch = jest.fn();
const frames = new Map<number, FrameRequestCallback>();
let nextFrameId = 0;

const renderResetLoader = (isAuthorised = true, isShowLoader = false) =>
  renderHook(
    ({ isAuthorised: authorised, isShowLoader: showLoader }: HookProps) => useResetWalletLoader(authorised, showLoader),
    {
      initialProps: { isAuthorised, isShowLoader }
    }
  );

const runFrame = (): void => {
  const callbacks = [...frames.values()];
  frames.clear();
  act(() => callbacks.forEach(callback => callback(0)));
};

describe('useResetWalletLoader', () => {
  beforeEach(() => {
    mockDispatch.mockClear();
    frames.clear();
    nextFrameId = 0;
    jest.mocked(useDispatch).mockReturnValue(mockDispatch);
    jest.spyOn(global, 'requestAnimationFrame').mockImplementation(callback => {
      const id = ++nextFrameId;
      frames.set(id, callback);

      return id;
    });
    jest.spyOn(global, 'cancelAnimationFrame').mockImplementation(id => {
      if (typeof id === 'number') {
        frames.delete(id);
      }
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('keeps the loader until Welcome has a layout, its transition ends, and a display frame completes', () => {
    const { result, rerender } = renderResetLoader();

    rerender({ isAuthorised: true, isShowLoader: true });
    runFrame();
    expect(mockDispatch).not.toHaveBeenCalled();

    rerender({ isAuthorised: false, isShowLoader: true });
    runFrame();
    runFrame();
    expect(mockDispatch).not.toHaveBeenCalled();

    act(() => result.current.onLayout());
    runFrame();
    runFrame();
    expect(mockDispatch).not.toHaveBeenCalled();

    act(() => result.current.onTransitionEnd());
    runFrame();
    expect(mockDispatch).not.toHaveBeenCalled();

    runFrame();
    expect(mockDispatch).toHaveBeenCalledTimes(1);
    expect(mockDispatch).toHaveBeenCalledWith(hideLoaderAction());
  });

  it('leaves the loader unchanged on an initial Welcome screen', () => {
    const { result } = renderResetLoader(false, true);

    act(() => {
      result.current.onLayout();
      result.current.onTransitionEnd();
    });
    runFrame();
    runFrame();

    expect(mockDispatch).not.toHaveBeenCalled();
  });

  it('waits for the Welcome layout if its transition ends first', () => {
    const { result, rerender } = renderResetLoader(true, true);
    rerender({ isAuthorised: false, isShowLoader: true });

    act(() => result.current.onTransitionEnd());
    runFrame();
    runFrame();
    expect(mockDispatch).not.toHaveBeenCalled();

    act(() => result.current.onLayout());
    runFrame();
    runFrame();
    expect(mockDispatch).toHaveBeenCalledWith(hideLoaderAction());
  });

  it('leaves later Welcome operations unchanged after a reset', () => {
    const { result, rerender } = renderResetLoader(true, true);
    rerender({ isAuthorised: false, isShowLoader: true });
    act(() => {
      result.current.onLayout();
      result.current.onTransitionEnd();
    });
    runFrame();
    runFrame();
    mockDispatch.mockClear();

    rerender({ isAuthorised: false, isShowLoader: false });
    rerender({ isAuthorised: false, isShowLoader: true });
    act(() => {
      result.current.onLayout();
      result.current.onTransitionEnd();
    });
    runFrame();
    runFrame();

    expect(mockDispatch).not.toHaveBeenCalled();
  });

  it.each([0, 1])('cancels the callback on unmount after %i frames', frameCount => {
    const { result, rerender, unmount } = renderResetLoader(true, true);
    rerender({ isAuthorised: false, isShowLoader: true });
    act(() => {
      result.current.onLayout();
      result.current.onTransitionEnd();
    });
    if (frameCount === 1) {
      runFrame();
    }

    unmount();
    runFrame();
    runFrame();

    expect(frames.size).toBe(0);
    expect(mockDispatch).not.toHaveBeenCalled();
  });

  it('cancels the callback if the loader closes before the display frame', () => {
    const { result, rerender } = renderResetLoader(true, true);
    rerender({ isAuthorised: false, isShowLoader: true });
    act(() => {
      result.current.onLayout();
      result.current.onTransitionEnd();
    });
    runFrame();

    rerender({ isAuthorised: false, isShowLoader: false });
    runFrame();

    rerender({ isAuthorised: false, isShowLoader: true });
    act(() => {
      result.current.onLayout();
      result.current.onTransitionEnd();
    });
    runFrame();
    runFrame();

    expect(mockDispatch).not.toHaveBeenCalled();
  });

  it('waits for a new Welcome layout on each reset', () => {
    const { result, rerender } = renderResetLoader(true, true);
    rerender({ isAuthorised: false, isShowLoader: true });
    act(() => {
      result.current.onLayout();
      result.current.onTransitionEnd();
    });
    runFrame();
    runFrame();
    mockDispatch.mockClear();

    rerender({ isAuthorised: true, isShowLoader: false });
    rerender({ isAuthorised: false, isShowLoader: true });
    runFrame();
    runFrame();
    expect(mockDispatch).not.toHaveBeenCalled();

    act(() => {
      result.current.onLayout();
      result.current.onTransitionEnd();
    });
    runFrame();
    runFrame();
    expect(mockDispatch).toHaveBeenCalledWith(hideLoaderAction());
  });
});
