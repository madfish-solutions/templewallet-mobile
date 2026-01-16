if [ "$(expr substr $(uname -s) 1 5)" != "Linux" ]; then
  sed_mac_arg=true
fi

find node_modules -type f -name 'build.gradle' -exec sed -i ${sed_mac_arg:+""} 's/jcenter()/mavenCentral()/g' {} +

search_string="compile 'com.facebook.react:react-native:+'"
replace_string="implementation 'com.facebook.react:react-native:+'"
sed -i ${sed_mac_arg:+""} "s/$search_string/$replace_string/" node_modules/react-native-scrypt/android/build.gradle