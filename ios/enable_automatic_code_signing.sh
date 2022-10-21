#!/bin/sh

sed -i '' 's#"CODE_SIGN_IDENTITY\[sdk=iphoneos\*\]" = "iPhone Distribution";##g' TempleWallet.xcodeproj/project.pbxproj
sed -i '' 's#CODE_SIGN_STYLE = Manual;#CODE_SIGN_STYLE = Automatic;#g' TempleWallet.xcodeproj/project.pbxproj

sed -i '' 's#DEVELOPMENT_TEAM = "";#DEVELOPMENT_TEAM = D653UWS37K;#g' TempleWallet.xcodeproj/project.pbxproj
sed -i '' 's#"DEVELOPMENT_TEAM\[sdk=iphoneos\*\]" = D653UWS37K;##g' TempleWallet.xcodeproj/project.pbxproj

sed -i '' 's#"PROVISIONING_PROFILE_SPECIFIER\[sdk=iphoneos\*\]" = "match AppStore com.madfish.temple-wallet";##g' TempleWallet.xcodeproj/project.pbxproj
