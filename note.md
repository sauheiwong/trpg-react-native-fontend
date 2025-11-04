# change the api!!!!

## IOS

```
eas build --platform ios --profile production
eas submit --platform ios --latest
```

## Android

change the versionName!

```
# android/app/build.gradle
versionCode 2
versionName "1.0.3"
```

```
npx expo prebuild --platform android
cd android
./gradlew assembleRelease ==> apk
./gradlew bundleRelease ==> aab
cd build/outputs/apk
# OR
cd build/outputs/bundle/release
```
