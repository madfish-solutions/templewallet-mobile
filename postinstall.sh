#!/bin/bash

search_string="compile 'com.facebook.react:react-native:+'"
replace_string="implementation 'com.facebook.react:react-native:+'"

if [ "$(expr substr $(uname -s) 1 5)" != "Linux" ]; then
  sed_mac_arg=true
fi

sed -i ${sed_mac_arg:+""} "s/$search_string/$replace_string/" node_modules/react-native-os/android/build.gradle
sed -i ${sed_mac_arg:+""} "s/$search_string/$replace_string/" node_modules/react-native-scrypt/android/build.gradle

deprecated_types_replace_string="} from 'react-native'\nimport { ViewPropTypes } from 'deprecated-react-native-prop-types'"

sed -i ${sed_mac_arg:+""} "s/  ViewPropTypes,//" node_modules/react-native-camera/src/RNCamera.js
sed -i ${sed_mac_arg:+""} "s/} from 'react-native';/$deprecated_types_replace_string/" node_modules/react-native-camera/src/RNCamera.js

# Patch for Jest. Preventing Jest from crashing tests when rejected Promise is not handled
# Altering code: https://github.com/jestjs/jest/blob/e821b83938e63c395c5544da23aed2b32775ad15/packages/jest-circus/src/globalErrorHandlers.ts#L11

search_string="parentProcess.on('unhandledRejection', uncaught);"
replace_string="parentProcess.on('unhandledRejection', reason => void console.warn('process.on.unhandledRejection:', reason?.stack || reason));"

sed -i ${sed_mac_arg:+""} "s/$search_string/$replace_string/" node_modules/jest-circus/build/globalErrorHandlers.js

# Patch for `@airgap/beacon-sdk`. Removing redundant sub-dependencies

search_string="__exportStar(require(\"@airgap/beacon-dapp\"), exports);"
replace_string=""

sed -i ${sed_mac_arg:+""} "s|$search_string|$replace_string|" node_modules/@airgap/beacon-sdk/dist/cjs/index.js

search_string="export \* from '@airgap/beacon-dapp';"

sed -i ${sed_mac_arg:+""} "s|$search_string|$replace_string|" node_modules/@airgap/beacon-sdk/dist/cjs/index.d.ts
