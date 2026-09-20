import type { CapacitorConfig } from '@capacitor/cli';

const demoServerUrl = process.env.CAPACITOR_SERVER_URL?.trim();

const config: CapacitorConfig = {
  appId: 'com.yatrax.nepal',
  appName: 'YatraX',
  webDir: 'dist',
  backgroundColor: '#F4F8F6',
  android: {
    allowMixedContent: Boolean(demoServerUrl),
    backgroundColor: '#F4F8F6',
  },
  plugins: {
    // Native HTTP avoids Android WebView cross-origin restrictions when the
    // installed demo app reaches the laptop's LAN SOS server over HTTP.
    CapacitorHttp: {
      enabled: true,
    },
    SplashScreen: {
      launchShowDuration: 1400,
      backgroundColor: '#0D3027',
      showSpinner: false,
    },
    Geolocation: {
      enableHighAccuracy: true,
    },
    StatusBar: {
      style: 'DARK',
      backgroundColor: '#0D3027',
      overlaysWebView: false,
    },
  },
  ...(demoServerUrl ? {
    server: {
      url: demoServerUrl,
      cleartext: demoServerUrl.startsWith('http://'),
      allowNavigation: [new URL(demoServerUrl).hostname],
    },
  } : {}),
};

export default config;
