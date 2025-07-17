import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

import { initializeApp, FirebaseApp } from 'firebase/app';
import { getRemoteConfig, RemoteConfig, fetchAndActivate, getValue } from 'firebase/remote-config';

/**
 * Servicio para consultar parámetros remotos desde Firebase Remote Config.
 * Permite leer, por ejemplo, si el modo oscuro debe activarse en la app.
 */
@Injectable({ providedIn: 'root' })
export class FirebaseRemoteConfigService {
  /** Instancia de la app Firebase */
  private app: FirebaseApp;
  /** Instancia de Remote Config asociada a la app */
  private remoteConfig: RemoteConfig;

  constructor() {
    // Inicializa la app de Firebase usando la configuración del entorno
    this.app = initializeApp(environment.firebase);
    this.remoteConfig = getRemoteConfig(this.app);

    // Configura los tiempos de actualización de Remote Config
    this.remoteConfig.settings = {
      minimumFetchIntervalMillis: environment.remoteConfig.fetchInterval,
      fetchTimeoutMillis: 10000 // 10 segundos de timeout (ajustable)
    };

    // Asigna valores por defecto (en caso de que no haya ninguno remoto aún)
    this.remoteConfig.defaultConfig = {
      [environment.remoteConfig.darkModeKey]: environment.remoteConfig.defaultDarkMode
    };
  }

  /**
   * Consulta si el modo oscuro está habilitado remotamente.
   * Hace una petición a Remote Config cada vez que se invoca.
   * @returns Promise<boolean> - true si debe estar activo, false si no.
   */
  async isDarkModeEnabled(): Promise<boolean> {
    try {
      // Intenta obtener y activar la configuración remota más reciente
      await fetchAndActivate(this.remoteConfig);
      const value = getValue(this.remoteConfig, environment.remoteConfig.darkModeKey);

      // Convierte a boolean de manera segura (acepta 'true' string o valor booleano)
      return value.asBoolean() || value.asString() === 'true';
    } catch (e) {
      // Si ocurre un error, retorna el valor por defecto configurado localmente
      return environment.remoteConfig.defaultDarkMode;
    }
  }
}
