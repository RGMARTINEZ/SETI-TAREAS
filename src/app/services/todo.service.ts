import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Task } from '../models/task.model';
import { Category } from '../models/category.model';

// Claves para almacenamiento local
const TASKS_KEY = 'todoApp.tasks';
const CATEGORIES_KEY = 'todoApp.categories';

/**
 * Servicio para la gestión de tareas y categorías.
 * Incluye almacenamiento local, reactividad y utilidades de paginación.
 */
@Injectable({ providedIn: 'root' })
export class TodoService {
  // ==== Observables internos ====

  /** Fuente reactiva de tareas */
  private _tasks$ = new BehaviorSubject<Task[]>([]);
  /** Fuente reactiva de categorías */
  private _categories$ = new BehaviorSubject<Category[]>([]);
  /** Fuente reactiva para paginación de pendientes */
  private _pagedPending$ = new BehaviorSubject<Task[]>([]);

  // ==== Observables públicos ====

  /** Observable público de tareas */
  tasks$ = this._tasks$.asObservable();
  /** Observable público de categorías */
  categories$ = this._categories$.asObservable();
  /** Observable público de lote paginado de pendientes */
  pagedPending$ = this._pagedPending$.asObservable();

  // ==== Estado interno (cache in-memory) ====

  /** Array en memoria de tareas */
  private tasks: Task[] = [];
  /** Array en memoria de categorías */
  private categories: Category[] = [];

  constructor() {
    this.loadCategories();
    this.loadTasks();
  }

  // ======================
  // === Categorías ===
  // ======================

  /**
   * Carga categorías desde localStorage o inicializa las por defecto.
   * Notifica a todos los observadores.
   */
  loadCategories() {
    const data = localStorage.getItem(CATEGORIES_KEY);
    this.categories = data
      ? JSON.parse(data)
      : [
          { id: 1, name: 'Personal', color: '#3dc2ff' },
          { id: 2, name: 'Trabajo', color: '#ffce00' }
        ];
    this.saveCategories();
    this._categories$.next(this.categories);
  }

  /**
   * Guarda las categorías en localStorage.
   */
  saveCategories() {
    localStorage.setItem(CATEGORIES_KEY, JSON.stringify(this.categories));
  }

  /**
   * Agrega una nueva categoría.
   * @param cat Categoría a agregar
   */
  addCategory(cat: Category) {
    cat.id = Date.now();
    this.categories.push(cat);
    this.saveCategories();
    this._categories$.next(this.categories);
  }

  /**
   * Actualiza una categoría existente.
   * @param cat Categoría actualizada
   */
  updateCategory(cat: Category) {
    const idx = this.categories.findIndex(c => c.id === cat.id);
    if (idx > -1) {
      this.categories[idx] = cat;
      this.saveCategories();
      this._categories$.next(this.categories);
    }
  }

  /**
   * Elimina una categoría y desasocia sus tareas.
   * @param id ID de la categoría a eliminar
   */
  deleteCategory(id: number) {
    this.categories = this.categories.filter(c => c.id !== id);
    // Quita la categoría de todas las tareas asociadas
    this.tasks = this.tasks.map(t =>
      t.categoryId === id ? { ...t, categoryId: null } : t
    );
    this.saveCategories();
    this.saveTasks();
    this._categories$.next(this.categories);
    this._tasks$.next(this.tasks);
  }

  /**
   * Obtiene una categoría por ID.
   * @param catId ID de la categoría
   */
  getCategory(catId: number | null | undefined): Category | undefined {
    return this.categories.find(c => c.id === catId);
  }

  // ======================
  // === Tareas ===
  // ======================

  /**
   * Carga las tareas desde localStorage.
   * Notifica a todos los observadores.
   */
  loadTasks() {
    const data = localStorage.getItem(TASKS_KEY);
    this.tasks = data ? JSON.parse(data) : [];
    this._tasks$.next(this.tasks);
  }

  /**
   * Guarda las tareas en localStorage.
   */
  saveTasks() {
    localStorage.setItem(TASKS_KEY, JSON.stringify(this.tasks));
  }

  /**
   * Agrega una nueva tarea.
   * @param task Tarea a agregar
   */
  addTask(task: Task) {
    task.id = Date.now();
    this.tasks.push(task);
    this.saveTasks();
    this._tasks$.next(this.tasks);
  }

  /**
   * Actualiza una tarea existente.
   * @param task Tarea actualizada
   */
  updateTask(task: Task) {
    const idx = this.tasks.findIndex(t => t.id === task.id);
    if (idx > -1) {
      this.tasks[idx] = task;
      this.saveTasks();
      this._tasks$.next(this.tasks);
    }
  }

  /**
   * Elimina una tarea por ID.
   * @param id ID de la tarea a eliminar
   */
  deleteTask(id: number) {
    this.tasks = this.tasks.filter(t => t.id !== id);
    this.saveTasks();
    this._tasks$.next(this.tasks);
  }

  // ======================
  // === Paginación ===
  // ======================

  /**
   * Devuelve un lote paginado de tareas.
   * @param allTasks Lista completa de tareas a paginar
   * @param page Número de página (1-based)
   * @param pageSize Tamaño de página (cuántos elementos por página)
   * @returns Array de tareas en la página indicada
   */
  getPagedTasks(allTasks: Task[], page: number, pageSize: number): Task[] {
    const start = (page - 1) * pageSize;
    const slice = allTasks.slice(start, start + pageSize);
    this._pagedPending$.next(slice); // Notifica sólo el lote actual (por si alguien lo usa)
    return slice;
  }
}
