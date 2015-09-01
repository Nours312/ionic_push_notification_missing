# ionic_push_notification_missing
IONIC Hook to inject ```#define DISABLE_PUSH_NOTIFICATIONS true``` in ios AppDelegate.m file


* add hooks/after_prepare/030_ios-push-notification-fix.js file in your ionic project.
* add "disablePushNotifications":true in your ./ionic.project json file.

when you'll build for ios this script add or remove disabled_parameter in platforms/ios/<appName>/Classes/AppDelegate.m file...

