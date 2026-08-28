if [ "$(uname -s)" != "Linux" ]; then
  sed_mac_arg=true
fi

# Metro caches its file map in $TMPDIR and keys it only on config, not on
# node_modules contents. After a clean install or branch switch Watchman clocks
# and that cache go stale, so packages that exist on disk (es6-symbol, date-fns
# internals, …) fail with "Unable to resolve module". Drop both so the next
# bundler start recrawls from disk.
if [ -x "$(command -v watchman)" ]; then
  watchman watch-del-all >/dev/null 2>&1 || true
fi
find "${TMPDIR:-/tmp}" -maxdepth 1 \( -name 'haste-map-*' -o -name 'metro-*' -o -name 'react-*' \) -exec rm -rf {} + 2>/dev/null || true

find node_modules -type f -name 'build.gradle' -exec sed -i ${sed_mac_arg:+""} 's/jcenter()/mavenCentral()/g' {} +

# https://github.com/facebook/react-native/issues/56287
# Gradle 9 removed JvmVendorSpec.IBM_SEMERU. React Native 0.85.3 ships Foojay
# resolver 0.5.0, which still references it and crashes during Android builds.
rn_gradle_plugin_settings="node_modules/@react-native/gradle-plugin/settings.gradle.kts"
if [ -f "$rn_gradle_plugin_settings" ]; then
  sed -i ${sed_mac_arg:+""} 's/org.gradle.toolchains.foojay-resolver-convention").version("0.5.0")/org.gradle.toolchains.foojay-resolver-convention").version("1.0.0")/' "$rn_gradle_plugin_settings"
fi

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

# Fix react-native-orientation-locker iOS reload redbox on RN 0.85.
# The native module manually mutates RCTEventEmitter listener accounting during
# init/dealloc, which can remove listeners after React Native already reset them.
orientation_locker_m="node_modules/react-native-orientation-locker/iOS/RCTOrientation/Orientation.m"
if [ -f "$orientation_locker_m" ]; then
  sed -i ${sed_mac_arg:+""} '/\[self addListener:@"orientationDidChange"\];/d' "$orientation_locker_m"
  sed -i ${sed_mac_arg:+""} '/\[self removeListeners:1\];/d' "$orientation_locker_m"
fi
