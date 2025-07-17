import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Observable } from 'rxjs';
import { TodoService } from '../services/todo.service';
import { Task } from '../models/task.model';
import { Category } from '../models/category.model';
import { ToastController, ModalController } from '@ionic/angular';
import { CategoryModalComponent } from '../components/category-modal/category-modal.component';
import { ConfirmModalComponent } from '../components/confirm-modal/confirm-modal.component';

/**
 * Componente principal de la To-Do List.
 * Controla tareas, categorías, paginación, UI y notificaciones.
 */
@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  standalone: false,
  styleUrls: ['./home.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomePage {
 /** Observable de todas las tareas */
  tasks$: Observable<Task[]>;
  /** Observable de todas las categorías */
  categories$: Observable<Category[]>;

  /** Título de la nueva tarea */
  newTaskTitle = '';
  /** ID de la categoría seleccionada en el input */
  newTaskCategoryId: number | null = null;
  /** ID de la categoría actualmente filtrada */
  selectedCategoryId: number | null = null;
  /** Indica si el listado de tareas completadas está expandido */
  showCompleted = false;

  // --- Paginación para tareas pendientes ---
  /** Tareas pendientes visibles (paginadas) */
  pagedPendingTasks: Task[] = [];
  /** Página actual de paginación */
  pendingPage = 1;
  /** Tamaño de página (cantidad por carga) */
  pendingPageSize = 50;

  constructor(
    private todoService: TodoService,
    private toastController: ToastController,
    private modalController: ModalController
  ) {
    this.tasks$ = this.todoService.tasks$;
    this.categories$ = this.todoService.categories$;

    // Reinicia la paginación al cambiar la lista de tareas
    this.tasks$.subscribe(() => this.resetPendingPagination());
  }

  // ======================
  // === Categorías ===
  // ======================

  /**
   * Abre el modal para agregar una nueva categoría.
   */
  async addCategory() {
    const modal = await this.modalController.create({
      component: CategoryModalComponent,
      componentProps: { category: { id: 0, name: '', color: '#6666ff' }, isEdit: false }
    });
    await modal.present();
    const { data } = await modal.onWillDismiss();
    if (data) {
      this.todoService.addCategory(data);
      this.showToast('🟢 Categoría agregada', 'success');
    }
  }

    /**
   * Abre el modal para editar una categoría existente.
   * @param cat Categoría a editar
   */
  async editCategory(cat: Category) {
    const modal = await this.modalController.create({
      component: CategoryModalComponent,
      componentProps: { category: { ...cat }, isEdit: true }
    });
    await modal.present();
    const { data } = await modal.onWillDismiss();
    if (data) {
      this.todoService.updateCategory(data);
      this.showToast('✏️ Categoría actualizada', 'primary');
    }
  }

    /**
   * Abre el modal de confirmación para eliminar una categoría.
   * @param cat Categoría a eliminar
   */
  async deleteCategory(cat: Category) {
    const modal = await this.modalController.create({
      component: ConfirmModalComponent,
      componentProps: {
        title: 'Eliminar categoría',
        message: `¿Eliminar la categoría <b>${cat.name}</b>?<br>Las tareas asociadas quedarán sin categoría.`
      }
    });
    await modal.present();
    const { data } = await modal.onWillDismiss();
    if (data) {
      this.todoService.deleteCategory(cat.id);
      this.showToast('🗑️ Categoría eliminada', 'danger');
    }
  }

  getCategory(catId: number | null | undefined, categories: Category[]) {
    return categories.find(c => c.id === catId);
  }

    /**
   * Selecciona una categoría para filtrar las tareas y reinicia paginación.
   * @param categoryId ID de la categoría o null (todas)
   */
  onSelectCategory(categoryId: number | null) {
    this.selectedCategoryId = categoryId;
    this.resetPendingPagination();
  }

  // ======================
  // === Tareas ===
  // ======================

  /**
   * Agrega una nueva tarea (si el título no está vacío).
   */
  addTask() {
    if (this.newTaskTitle.trim().length === 0) {
      this.showToast('⚠️ Escribe algo para tu tarea', 'warning');
      return;
    }
    const newTask: Task = {
      id: 0,
      title: this.newTaskTitle.trim(),
      completed: false,
      categoryId: this.newTaskCategoryId || null,
    };
    this.todoService.addTask(newTask);
    this.newTaskTitle = '';
    this.newTaskCategoryId = null;
    this.showToast('✅ ¡Tarea agregada!', 'success');
    this.resetPendingPagination();
  }

    /**
   * Cambia el estado (pendiente/completada) de una tarea.
   * @param task Tarea a actualizar
   */
  toggleTask(task: Task) {
    this.todoService.updateTask({ ...task, completed: !task.completed });
    this.showToast(
      !task.completed ? '🎉 ¡Completaste una tarea!' : '🔄 Tarea marcada como pendiente',
      !task.completed ? 'success' : 'medium'
    );
    this.resetPendingPagination();
  }

    /**
   * Elimina una tarea y permite deshacer la acción.
   * @param task Tarea a eliminar
   */
  deleteTask(task: Task) {
    this.todoService.deleteTask(task.id);
    this.showToastWithUndo('🗑️ Tarea eliminada', 'danger', task);
    this.resetPendingPagination();
  }

  // ======================
  // === Filtros y helpers ===
  // ======================

  /**
   * Filtra tareas según la categoría seleccionada.
   * @param tasks Todas las tareas
   */
  filteredTasks(tasks: Task[]) {
    return this.selectedCategoryId
      ? tasks.filter(task => task.categoryId === this.selectedCategoryId)
      : tasks;
  }
  pendingTasks(tasks: Task[]) {
    return this.filteredTasks(tasks).filter(t => !t.completed);
  }
  completedTasks(tasks: Task[]) {
    return this.filteredTasks(tasks).filter(t => t.completed);
  }

  // Paginación para pendientes
  resetPendingPagination() {
    this.pendingPage = 1;
    this.tasks$.subscribe(tasks => {
      const pending = this.pendingTasks(tasks);
      this.pagedPendingTasks = this.todoService.getPagedTasks(pending, this.pendingPage, this.pendingPageSize);
    }).unsubscribe();
  }

  loadMorePending(event: any) {
    this.tasks$.subscribe(tasks => {
      this.pendingPage++;
      const pending = this.pendingTasks(tasks);
      const more = this.todoService.getPagedTasks(pending, this.pendingPage, this.pendingPageSize);
      this.pagedPendingTasks = [...this.pagedPendingTasks, ...more];
      if (this.pagedPendingTasks.length >= pending.length) {
        event.target.disabled = true;
      }
      event.target.complete();
    }).unsubscribe();
  }

  getProgress(tasks: Task[]) {
    if (!tasks || tasks.length === 0) return 0;
    return tasks.filter(t => t.completed).length / tasks.length;
  }

  // ======================
  // === Toasts (notificaciones) ===
  // ======================

  /**
   * Muestra un toast simple con mensaje y color.
   * @param message Mensaje a mostrar
   * @param color Color del toast (success, warning, etc.)
   */
  async showToast(message: string, color: string = 'primary') {
    const toast = await this.toastController.create({
      message,
      duration: 1700,
      color,
      position: 'bottom',
      mode: 'ios',
      animated: true,
      cssClass: 'custom-toast'
    });
    toast.present();
  }

  async showToastWithUndo(message: string, color: string, deletedTask: Task) {
    const toast = await this.toastController.create({
      message,
      duration: 3000,
      color,
      position: 'bottom',
      mode: 'ios',
      animated: true,
      cssClass: 'custom-toast',
      buttons: [
        {
          text: 'Deshacer',
          handler: () => {
            this.todoService.addTask(deletedTask);
            this.showToast('🔄 ¡Tarea restaurada!', 'success');
            this.resetPendingPagination();
          }
        }
      ]
    });
    toast.present();
  }
  
  /**
   * trackBy para mejorar el rendimiento de *ngFor en listas de tareas.
   * @param index Índice del elemento
   * @param task Tarea
   */
  trackById(index: number, task: Task) { return task.id; }

}
