import { Component } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Task, TaskService } from './task.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  inputFocused$: Observable<boolean> = new Observable<boolean>();
  _inputFocused$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor(private taskService: TaskService) {
    this.inputFocused$ = this._inputFocused$.asObservable();
  }

  onInputFocus() {
    this._inputFocused$.next(true);
  }

  onAddTask(task: Task) {
    this.taskService.addTask(task);
  }
}
