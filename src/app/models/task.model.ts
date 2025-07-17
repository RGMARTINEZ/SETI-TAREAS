export interface Task {
  id: number;
  title: string;
  completed: boolean;
  categoryId?: number | null; // Opcional
}
