import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'ai.offshift.memberapp',
  appName: 'memberApp',
  webDir: 'www',
  server: {
    androidScheme: 'https'
  },
  plugins: {
    LiveUpdates: {
      appId: 'a9f26d71',
      channel: 'Production',
      autoUpdateMethod: 'none',
      maxVersions: 3
    }
  }
};

export default config;
