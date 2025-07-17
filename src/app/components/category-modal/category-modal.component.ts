import { Component, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Category } from '../../models/category.model';

/**
 * Modal para crear o editar una categoría.
 * Permite seleccionar color y nombre.
 * Devuelve la categoría al guardar, o null si se cancela.
 */
@Component({
  selector: 'app-category-modal',
  templateUrl: './category-modal.component.html',
  standalone: false,
  styleUrls: ['./category-modal.component.scss'],
})
export class CategoryModalComponent {
  /** Categoría a editar o nueva categoría si es alta */
  @Input() category: Category = { id: 0, name: '', color: '#ff3b30' }; // Rojo por defecto

  /** Indica si es modo edición (true) o creación (false) */
  @Input() isEdit: boolean = false;

  /** Lista de colores principales disponibles para selección */
  categoryColors: string[] = [
    '#ff3b30', // rojo
    '#ff9500', // naranja
    '#ffcc00', // amarillo
    '#34c759', // verde
    '#5ac8fa', // celeste
    '#007aff', // azul
    '#5856d6', // violeta
    '#af52de', // púrpura
    '#8e8e93', // gris
    '#ffd60a', // dorado
  ];

  constructor(private modalCtrl: ModalController) {}

  /**
   * Guarda la categoría y cierra el modal.
   * Solo si el nombre es válido. En alta, asigna id único.
   */
  save() {
    if (!this.category.name.trim()) return; // Evita guardar nombres vacíos
    if (!this.isEdit) this.category.id = Date.now();
    this.modalCtrl.dismiss(this.category);
  }

  /**
   * Cancela la edición/creación y cierra el modal sin cambios.
   */
  dismiss() {
    this.modalCtrl.dismiss(null);
  }
}
