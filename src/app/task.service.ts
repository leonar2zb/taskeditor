import { Injectable } from '@angular/core';
import { HighlightTag } from 'angular-text-input-highlight';
import { BehaviorSubject, Observable } from 'rxjs';

export interface Task {
  id?: number;
  text: string;
  tags: HighlightTag[];
  isDone?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  tasks: Observable<Task[]>;
  private _tasks: BehaviorSubject<Task[]> = new BehaviorSubject<Task[]>([]);

  constructor() {
    this.tasks = this._tasks.asObservable();
  }

  addTask(task: Task): void {
    this._tasks.next([...this._tasks.value, { ...task, id: task.id ?? new Date().getTime() }]);
  }

  updateTask(task: Task) {
    const tasks = [...this._tasks.value];
    const idx = tasks.findIndex(t => t.id === task.id);
    tasks.splice(idx, 1, task);
    this._tasks.next(tasks);
  }
}
