import RNCloudFs from 'react-native-cloud-fs';

console.log(1, Object.keys(RNCloudFs));

RNCloudFs.loginIfNeeded().then((res: unknown) => {
  console.log('RNCloudFs.loginIfNeeded returned', res);
});

export {};
