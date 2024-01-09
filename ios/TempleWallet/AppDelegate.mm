#import <Firebase.h>
#import "AppDelegate.h"
#import "Orientation.h"
#import "RNBootSplash.h"

#import <UserNotifications/UserNotifications.h>
#import <RNCPushNotificationIOS.h>

#import "SDImageCodersManager.h"
#import <SDWebImageWebPCoder/SDImageWebPCoder.h>

#import <React/RCTBundleURLProvider.h>

#import <React/RCTLinkingManager.h>

#import <UIKit/UIKit.h>

@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  self.moduleName = @"TempleWallet";
  // You can add your custom initial props in the dictionary below.
  // They will be passed down to the ViewController used by React Native.
  self.initialProps = @{};

  [FIRApp configure];

  // Animated WEBP support. See: https://stackoverflow.com/a/70626476/9371122
  [SDImageCodersManager.sharedManager addCoder:SDImageWebPCoder.sharedCoder];

  UNUserNotificationCenter *center = [UNUserNotificationCenter currentNotificationCenter];
  center.delegate = self;

  // Initialize overlay view
  self.overlayView = [[UIView alloc] initWithFrame:[[UIScreen mainScreen] bounds]];
  self.overlayView.backgroundColor = [UIColor whiteColor];
  self.overlayView.hidden = NO; // Initially visible

  self.overlayWindow = [[UIWindow alloc] initWithFrame:[[UIScreen mainScreen] bounds]];
  self.overlayWindow.backgroundColor = [UIColor whiteColor];
  self.overlayWindow.hidden = NO; // Initially visible
  self.overlayWindow.windowLevel = UIWindowLevelStatusBar + 1;
  [self.overlayWindow addSubview:self.overlayView];

  // Set the root view controller for the main window
  UIViewController *rootViewController = [[UIViewController alloc] init];
  self.overlayWindow.rootViewController = rootViewController;

  [self.window makeKeyAndVisible]; // Ensure that the main window is visible

  return [super application:application didFinishLaunchingWithOptions:launchOptions];
}


- (NSURL *)sourceURLForBridge:(RCTBridge *)bridge
{
#if DEBUG
  return [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index"];
#else
  return [[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];
#endif
}

// See: https://github.com/zoontek/react-native-bootsplash/blob/5.0.2/README.md
- (UIView *)createRootViewWithBridge:(RCTBridge *)bridge
                          moduleName:(NSString *)moduleName
                           initProps:(NSDictionary *)initProps {
  UIView *rootView = [super createRootViewWithBridge:bridge
                                          moduleName:moduleName
                                           initProps:initProps];

  [RNBootSplash initWithStoryboard:@"BootSplash" rootView:rootView]; // ⬅️ initialize the splash screen

  return rootView;
}


- (UIInterfaceOrientationMask)application:(UIApplication *)application supportedInterfaceOrientationsForWindow:(UIWindow *)window {
  return [Orientation getOrientation];
}

- (BOOL)application:(UIApplication *)application
   openURL:(NSURL *)url
   options:(NSDictionary<UIApplicationOpenURLOptionsKey,id> *)options
{
  return [RCTLinkingManager application:application openURL:url options:options];
}

// Required for the register event.
- (void)application:(UIApplication *)application didRegisterForRemoteNotificationsWithDeviceToken:(NSData *)deviceToken
{
 [RNCPushNotificationIOS didRegisterForRemoteNotificationsWithDeviceToken:deviceToken];
}
// Required for the notification event. You must call the completion handler after handling the remote notification.
- (void)application:(UIApplication *)application didReceiveRemoteNotification:(NSDictionary *)userInfo
fetchCompletionHandler:(void (^)(UIBackgroundFetchResult))completionHandler
{
  [RNCPushNotificationIOS didReceiveRemoteNotification:userInfo fetchCompletionHandler:completionHandler];
}
// Required for the registrationError event.
- (void)application:(UIApplication *)application didFailToRegisterForRemoteNotificationsWithError:(NSError *)error
{
 [RNCPushNotificationIOS didFailToRegisterForRemoteNotificationsWithError:error];
}
// Required for localNotification event
- (void)userNotificationCenter:(UNUserNotificationCenter *)center
didReceiveNotificationResponse:(UNNotificationResponse *)response
         withCompletionHandler:(void (^)(void))completionHandler
{
  [RNCPushNotificationIOS didReceiveNotificationResponse:response];
}

//Called when a notification is delivered to a foreground app.
-(void)userNotificationCenter:(UNUserNotificationCenter *)center willPresentNotification:(UNNotification *)notification withCompletionHandler:(void (^)(UNNotificationPresentationOptions options))completionHandler
{
  completionHandler(UNNotificationPresentationOptionSound | UNNotificationPresentationOptionAlert | UNNotificationPresentationOptionBadge);
}

- (void)applicationDidEnterBackground:(UIApplication *)application
{
  // Show the white overlay when the app becomes inactive
  self.overlayWindow.hidden = NO;
}

- (void)applicationWillResignActive:(UIApplication *)application
{
  // Show the white overlay when the app becomes inactive
  self.overlayWindow.hidden = NO;
}

- (void)applicationDidBecomeActive:(UIApplication *)application
{
  // Hide the white overlay when the app becomes active again
  self.overlayWindow.hidden = YES;
}

@end
