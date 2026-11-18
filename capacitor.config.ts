import type { CapacitorConfig } from '@capacitor/cli';

/* Для сборки APK:
   1. npm run build
   2. npx cap add android      (один раз; требует Android Studio + SDK)
   3. npx cap sync android
   4. Открыть android/ в Android Studio → Build → Build APK(s) */
const config: CapacitorConfig = {
  appId: 'city.cybertarot.app',
  appName: 'CyberTarot',
  webDir: 'dist',
  backgroundColor: '#05070d',
  android: {
    allowMixedContent: false,
  },
};

export default config;
