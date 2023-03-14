import { Component, Input } from '@angular/core';
import { HighlightTag } from 'angular-text-input-highlight';
import { BehaviorSubject, Observable } from 'rxjs';
import { Task, TaskService } from '../task.service';

@Component({
  selector: 'task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.scss']
})
export class TaskComponent {
  @Input() text: string = '';
  @Input() tags: HighlightTag[] = [];
  @Input() id?: number;
  @Input() isDone?: boolean;
  inputFocused$: Observable<boolean> = new Observable<boolean>();
  _inputFocused$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  get value(): string {
    let result = this.text;
    const tagSorted = this.tags.sort((a, b) => b.indices.start - a.indices.start);
    for (const tag of tagSorted) {
      const span = this.getSpan(tag.cssClass, tag.data);
      const beginning = result.substring(0, tag.indices.start);
      const end = result.substring(tag.indices.end);
      result = `${beginning}${span}${end}`;
    }
    return result;
  }

  constructor(public taskService: TaskService) {
    this.inputFocused$ = this._inputFocused$.asObservable();
  }

  toggleStatus(): void {
    this.isDone = !this.isDone;
  }

  onInputFocus() {
    this._inputFocused$.next(true);
  }

  updateTask(task: Task) {
    this.taskService.updateTask({ ...task, id: this.id, isDone: this.isDone });
  }

  private getSpan(className: string | undefined, text: string): string {
    switch (className) {
      case 'email':
        return `<span class="budge ${className}"><div class="icon mail"></div> Mail</span>`;
      case 'hashtag':
        return `<span class="budge ${className}">${text}</span>`;
      case 'tag':
        return `<span class="budge ${className}"><div class="avatar"></div> ${text.replace('@', '')}</span>`;
      case 'url':
        return `<span class="budge ${className}"><div class="icon link"></div> Link</span>`;
      default:
        return '';
    }
  }
}
