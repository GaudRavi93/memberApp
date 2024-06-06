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
      appId: '7cd26613',
      channel: 'Develop',
      autoUpdateMethod: 'background',
      maxVersions: 3
    }
  }
};

export default config;
