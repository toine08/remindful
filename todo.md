### To-Do List migration to FCM

1. **Set up Firebase Cloud Messaging (FCM)**
   - Follow the [Cloud Messaging setup guide](https://rnfirebase.io/messaging/usage) from React Native Firebase.
   - For iOS-specific setup, refer to [iOS Messaging Setup](https://rnfirebase.io/messaging/usage/ios-setup).

2. **Update `lib/notifications.ts`**
   - Replace expo-notifications with rn firebase messaging.
   - Update the functions for registering and handling notifications.
   - Make sure to handle FCM token registration and retrieval.

3. **Update `app/_layout.tsx`**
   - Replace expo-notifications usage with rn firebase messaging.
   - Ensure notifications are handled using Firebase messaging.

4. **Update `lib/utils.ts`**
   - Replace expo-notifications related code with rn firebase messaging.
   - Update functions such as `updatePushToken` and `getPushTokenFromSupabase` to work with FCM tokens.

5. **Update `app/(auth)/home.tsx`**
   - Replace expo-notifications usage with rn firebase messaging.
   - Ensure notification handling and token updates are performed using Firebase messaging.

6. **Update `app/about.tsx`**
   - Replace expo-notifications related code.
   - Ensure any references to notification tokens are updated to use Firebase messaging tokens.

7. **Update `package.json`**
   - Remove `expo-notifications` dependency.
   - Add `@react-native-firebase/messaging` dependency.

8. **Test the changes**
   - Thoroughly test the notification functionality to ensure everything works correctly with Firebase Cloud Messaging.

For more details on the code changes to be made, you can view the relevant files on GitHub:
- [lib/notifications.ts](https://github.com/toine08/remindful/blob/main/lib/notifications.ts)
- [app/_layout.tsx](https://github.com/toine08/remindful/blob/main/app/_layout.tsx)
- [lib/utils.ts](https://github.com/toine08/remindful/blob/main/lib/utils.ts)
- [app/(auth)/home.tsx](https://github.com/toine08/remindful/blob/main/app/(auth)/home.tsx)
- [app/about.tsx](https://github.com/toine08/remindful/blob/main/app/about.tsx)
- [package.json](https://github.com/toine08/remindful/blob/main/package.json)
