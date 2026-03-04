if [ "$(expr substr $(uname -s) 1 5)" != "Linux" ]; then
  sed_mac_arg=true
fi

find node_modules -type f -name 'build.gradle' -exec sed -i ${sed_mac_arg:+""} 's/jcenter()/mavenCentral()/g' {} +

search_string="compile 'com.facebook.react:react-native:+'"
replace_string="implementation 'com.facebook.react:react-native:+'"
sed -i ${sed_mac_arg:+""} "s/$search_string/$replace_string/" node_modules/react-native-scrypt/android/build.gradle

# Fix RNExitApp new-arch build: use quoted include so Podfile header search path finds the spec
# See: https://github.com/wumke/react-native-exit-app/issues/71
rnexitapp_h="node_modules/react-native-exit-app/ios/RNExitApp/RNExitApp.h"
if [ -f "$rnexitapp_h" ]; then
  sed -i ${sed_mac_arg:+""} 's|#import <React-Codegen/RNExitAppSpec/RNExitAppSpec.h>|#import "RNExitAppSpec/RNExitAppSpec.h"|' "$rnexitapp_h"
  sed -i ${sed_mac_arg:+""} 's|#import <RNExitAppSpec/RNExitAppSpec.h>|#import "RNExitAppSpec/RNExitAppSpec.h"|' "$rnexitapp_h"
  sed -i ${sed_mac_arg:+""} 's|#import <React_Codegen/RNExitAppSpec/RNExitAppSpec.h>|#import "RNExitAppSpec/RNExitAppSpec.h"|' "$rnexitapp_h"
fi
