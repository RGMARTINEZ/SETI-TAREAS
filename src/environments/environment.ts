// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  firebase: {
    apiKey: 'AIzaSyC6h8GbhLTSLhdyl4QdZDY6cN227rYgL8M',
    authDomain: 'seti-tareas-fb.firebaseapp.com',
    projectId: 'seti-tareas-fb',
    storageBucket: 'seti-tareas-fb.firebasestorage.app',
    messagingSenderId: '437445920579',
    appId: '1:437445920579:web:9971006b88d45456c9d1f6',
    measurementId: 'G-V69WKD3K9L'
  },
  remoteConfig: {
    darkModeKey: 'dark_mode_enabled',
    fetchInterval: 60 * 1000,
    defaultDarkMode: false
  }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
