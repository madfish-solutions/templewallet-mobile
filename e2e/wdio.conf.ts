const waitforTimeout = 30 * 60 * 1000;
const commandTimeout = 30 * 60 * 1000;
const newCommandTimeout = 30 * 60 * 1000;

const androidCapability = {
  waitforTimeout,
  commandTimeout,
  newCommandTimeout,
  platformName: 'Android',
  unicodeKeyboard: true,
  resetKeyboard: true,
  noReset: true,
  platformVersion: '11',
  automationName: 'UiAutomator2',
  deviceName: 'Pixel_4_API_30',
  app: './android/app/build/outputs/apk/debug/app-debug.apk',
  appActivity: 'com.templewallet.MainActivity',
  appPackage: 'com.templewallet'
};

const iosCapability = {
  waitforTimeout,
  commandTimeout,
  newCommandTimeout,
  browserName: 'iOS',
  platformName: 'iOS',
  unicodeKeyboard: true,
  resetKeyboard: true,
  noReset: true,
  nativeInstrumentsLib: true,
  isolateSimDevice: true,
  platformVersion: '14.5',
  deviceName: 'iPhone 11 Pro Max',
  app: './ios/build/Build/Products/Release-iphonesimulator/TempleWallet.app'
};

const getCapabilities = () => {
  if (process.env.ANDROID) {
    return [androidCapability];
  }

  if (process.env.IOS) {
    return [iosCapability];
  }

  return [iosCapability, iosCapability];
};

export const config: WebdriverIO.Config = {
  port: 4723,
  specs: ['./e2e/features/**/*.feature'],
  exclude: [],
  maxInstances: 10,
  capabilities: getCapabilities(),
  logLevel: 'info',
  bail: 0,
  baseUrl: 'http://localhost',
  waitforTimeout: 10000,
  connectionRetryTimeout: 120000,
  connectionRetryCount: 3,
  services: ['appium'],
  framework: 'cucumber',
  reporters: ['spec'],
  cucumberOpts: {
    require: ['./e2e/features/step-definitions/steps.ts'],
    backtrace: false,
    requireModule: [],
    dryRun: false,
    failFast: false,
    format: ['pretty'],
    snippets: true,
    source: true,
    profile: [],
    strict: false,
    tagExpression: '',
    timeout: 60000,
    ignoreUndefinedDefinitions: false
  }
};
