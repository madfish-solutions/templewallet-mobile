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
