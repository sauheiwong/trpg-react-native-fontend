# change the api!!!!

## IOS

```
eas build --platform ios --profile production
eas submit --platform ios --latest
```

## Android

```
npx expo prebuild --platform android
cd android
./gradlew assembleRelease
```
