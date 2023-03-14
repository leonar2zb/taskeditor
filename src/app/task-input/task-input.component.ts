import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';
import { HighlightTag } from 'angular-text-input-highlight';
import { filter, Observable, Subject, takeUntil } from 'rxjs';
import { Task } from '../task.service';

const isEmail = /([\w-\.]+@([\w-]+\.)+[\w-]{2,4}) ?/g;
const isHashtag = /(#\w+) ?/g;
const isTag = /(?<!\w)(@\w+) ?/g;
const isUrl = /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,}) ?/g;

@Component({
  selector: 'task-input',
  templateUrl: './task-input.component.html',
  styleUrls: ['./task-input.component.scss'],
})
export class TaskInputComponent implements OnInit, OnDestroy {
  tags: HighlightTag[] = [];
  isInputFocused = false;
  @Input() text = '';
  @Input() inputFocused: Observable<boolean> = new Observable<boolean>();
  @Output() onAddTask: EventEmitter<Task> = new EventEmitter<Task>();
  unsubscribe: Subject<void> = new Subject<void>();
  value: string = '';
  @ViewChild('textarea') textarea!: ElementRef;

  get isInputEmpty(): boolean {
    return !this.value;
  }

  constructor(private cdr: ChangeDetectorRef) {
  }

  ngOnInit() {
    this.inputFocused.pipe(
      takeUntil(this.unsubscribe),
      filter(Boolean),
    ).subscribe(() => this.onInputFocus());
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  onInputFocus() {
    this.value = this.text;
    this.isInputFocused = true;
    this.addTags();
    this.cdr.detectChanges();
    this.textarea.nativeElement.focus();
  }

  onInputBlur() {
    if (!this.value) {
      this.isInputFocused = false;
    }
  }

  preventMultiline(event: KeyboardEvent): void {
    if (event.code === 'Enter') {
      event.preventDefault();
    }
  }

  addTags() {
    this.tags = [];
    const evaluate = [
      { regExp: isHashtag, className: 'hashtag' },
      { regExp: isTag, className: 'tag' },
      { regExp: isEmail, className: 'email' },
      { regExp: isUrl, className: 'url' },
    ];

    for (const { regExp, className } of evaluate) {
      let found;
      while ((found = regExp.exec(this.value))) {
        this.tags.push({
          indices: {
            start: found.index,
            end: found.index + found[1].length
          },
          cssClass: className,
          data: found[1]
        });
      }
    }
  }

  resetInput() {
    this.value = '';
    this.isInputFocused = false;
  }

  onAddAction(): void {
    this.onAddTask.emit({ text: this.value, tags: this.tags });
    this.resetInput();
  }
}
