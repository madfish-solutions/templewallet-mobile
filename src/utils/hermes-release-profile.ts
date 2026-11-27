import { Linking } from 'react-native';
import { startProfiling, stopProfiling } from 'react-native-release-profiler';

import { isAndroid } from 'src/config/system';

const START_PATH = '/start';
const STOP_PATH = '/stop';

let started = false;
let stopped = false;

const profileCommand = (url: string): 'start' | 'stop' | null => {
  let parsed: URL;

  try {
    parsed = new URL(url);
  } catch {
    return null;
  }

  if (parsed.protocol !== 'temple:' || parsed.host !== 'hermes-profile') {
    return null;
  }

  const path = parsed.pathname.replace(/\/+$/, '');

  if (path === START_PATH) {
    return 'start';
  }

  if (path === STOP_PATH) {
    return 'stop';
  }

  return null;
};

const handleUrl = (url: string) => {
  const command = profileCommand(url);

  if (command === 'start') {
    // A flow that already stopped can start again in the same process. A second
    // start while sampling is still running leaves that session alone.
    if (started && !stopped) {
      return;
    }

    started = true;
    stopped = false;
    startProfiling();

    return;
  }

  if (command === 'stop' && started && !stopped) {
    stopped = true;
    void stopProfiling(isAndroid).catch(() => {
      stopped = false;
    });
  }
};

/** Listens for the Maestro profile links. A normal launch does not start sampling. */
export const installHermesReleaseProfileTrigger = (): (() => void) => {
  const subscription = Linking.addEventListener('url', ({ url }) => {
    handleUrl(url);
  });

  void Linking.getInitialURL().then(url => {
    if (url) {
      handleUrl(url);
    }
  });

  return () => subscription.remove();
};
