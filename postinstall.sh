#!/bin/bash

search_string="compile 'com.facebook.react:react-native:+'"
replace_string="implementation 'com.facebook.react:react-native:+'"

sed -i "" "s/$search_string/$replace_string/" node_modules/react-native-os/android/build.gradle
sed -i "" "s/$search_string/$replace_string/" node_modules/react-native-scrypt/android/build.gradle

deprecated_types_replace_string="} from 'react-native'\nimport { ViewPropTypes } from 'deprecated-react-native-prop-types'"

sed -i "" "s/  ViewPropTypes,//" node_modules/react-native-camera/src/RNCamera.js
sed -i "" "s/} from 'react-native';/$deprecated_types_replace_string/" node_modules/react-native-camera/src/RNCamera.js
