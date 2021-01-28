import { env } from './.env';

export const environment = {
  production: false,
  firebase: {
    apiKey: 'AIzaSyApPlAy-2ZYaOWmpS8JrC3LAVoksnI3mZY',
    authDomain: 'catchup-12e58.firebaseapp.com',
    databaseURL: 'https://catchup-12e58.firebaseio.com',
    projectId: 'catchup-12e58',
    storageBucket: 'catchup-12e58.appspot.com',
    messagingSenderId: '357842985384',
    appId: '1:357842985384:web:dffdf0cf1ce0aa19'
  },
  twilio: {
    appKey: 'ACfb80f91523d8140ff3517b836d3ee63f',
    authToken: '5cdfe60d8f71c36f2906e89ee35d6dc8',
    serviceId: 'VA77c00967d1b36c14c3d3492a388081a1'
  },
  API_URL: 'https://bubble-dev.catchupcalendar.com',
  BASE_URL: 'https://bubble-dev.catchupcalendar.com',
  CHAT_SOCKET: 'https://bubble-dev.catchupcalendar.com',
  API_KEY: 'dGVzdDp0ZXN0',
  hmr: true,
  version: env.npm_package_version + '-dev',
  serverUrl: '/api',
  defaultLanguage: 'en-US',
  supportedLanguages: ['en-US', 'fr-FR']
};
