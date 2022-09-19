#!/bin/bash

search_string="compile 'com.facebook.react:react-native:+'"
replace_string="implementation 'com.facebook.react:react-native:+'"

sed -i "" "s/$search_string/$replace_string/" node_modules/react-native-os/android/build.gradle
sed -i "" "s/$search_string/$replace_string/" node_modules/react-native-scrypt/android/build.gradle
