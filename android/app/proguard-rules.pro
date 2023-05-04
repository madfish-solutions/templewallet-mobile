# Add project specific ProGuard rules here.
# By default, the flags in this file are appended to flags specified
# in /usr/local/Cellar/android-sdk/24.3.3/tools/proguard/proguard-android.txt
# You can edit the include path and order by changing the proguardFiles
# directive in build.gradle.
#
# For more details, see
#   http://developer.android.com/guide/developing/tools/proguard.html

# Add any project specific keep options here:

-keep public class com.horcrux.svg.** { *; }
-keep class com.swmansion.reanimated.** { *; }
-keep class com.facebook.react.turbomodule.** { *; }
# Hermes engine setup
-keep class com.facebook.hermes.unicode.** { *; }
-keep class com.facebook.jni.** { *; }
# react-native-config setup
-keep class com.templewallet.BuildConfig { *; }
# react-native-keychain setup
-keep class com.facebook.crypto.** { *; }
# react-native-cloud-fs setup
-keep class com.google.api.services.drive.** { *; }
