/** @type {import('@capacitor/cli').CapacitorConfig} */
const config = {
  appId: "com.zibvh.frankx",
  appName: "Frank X",
  webDir: "dist",
  android: {
    buildOptions: {
      releaseType: "APK",
    },
  },
  server: {
    androidScheme: "https",
  },
};

module.exports = config;
