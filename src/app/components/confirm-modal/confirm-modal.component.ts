import { Component, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';

/**
 * Modal de confirmación reutilizable.
 * Muestra título, mensaje, ícono y botones de cancelar/confirmar.
 * Devuelve true si se confirma, o nada/null si se cancela.
 */
@Component({
  selector: 'app-confirm-modal',
  templateUrl: './confirm-modal.component.html',
  standalone: false,
  styleUrls: ['./confirm-modal.component.scss']
})
export class ConfirmModalComponent {
  /** Título principal del modal */
  @Input() title: string = 'Confirmar';

  /** Mensaje o descripción (puede tener HTML) */
  @Input() message: string = '¿Seguro que deseas continuar?';

  /** Nombre del ícono Ionic a mostrar */
  @Input() icon: string = 'alert-circle-outline';

  /** Color principal del ícono (ej: #ff3333 para "danger") */
  @Input() iconColor: string = '#ff3333';

  /** Texto del botón de confirmación */
  @Input() confirmText: string = 'Eliminar';

  /** Texto del botón de cancelar */
  @Input() cancelText: string = 'Cancelar';

  constructor(private modalCtrl: ModalController) {}

  /**
   * Cierra el modal sin confirmar (equivale a cancelar).
   */
  dismiss() {
    this.modalCtrl.dismiss();
  }

  /**
   * Cierra el modal y retorna true (acción confirmada).
   */
  confirm() {
    this.modalCtrl.dismiss(true);
  }
}
