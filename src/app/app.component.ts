import { Component, OnInit } from '@angular/core';
import { FirebaseRemoteConfigService } from './services/firebase-remote-config.service';

/**
 * Componente raíz de la aplicación Ionic/Angular.
 * Se encarga de activar o desactivar el modo oscuro según Remote Config de Firebase.
 */
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: false,
})
export class AppComponent implements OnInit {
  constructor(private remoteConfig: FirebaseRemoteConfigService) {}

  /**
   * Al inicializar el componente, consulta Remote Config y ajusta el modo oscuro.
   */
  ngOnInit() {
    this.remoteConfig.isDarkModeEnabled().then(enabled => {
      console.log('¿Modo oscuro activo desde Firebase?', enabled);
      this.setDarkMode(enabled);
    });
  }

  /**
   * Activa o desactiva la clase CSS "dark" en el body, 
   * lo que activa los estilos de modo oscuro de Ionic.
   * @param enable true para activar dark mode, false para desactivar
   */
  setDarkMode(enable: boolean) {
    document.body.classList.toggle('dark', enable);
  }
}
