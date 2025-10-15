# change the api!!!!

eas build --platform android --profile preview
eas build --platform ios --profile production
eas submit --platform ios --latest
