import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HighlightTag } from 'angular-text-input-highlight';
import { TaskInputComponent } from '../task-input/task-input.component';

import { TaskComponent } from './task.component';

describe('TaskComponent', () => {
  let component: TaskComponent;
  let fixture: ComponentFixture<TaskComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TaskComponent, TaskInputComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(TaskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should toggle status', () => {
    component.isDone = false;
    component.toggleStatus()
    expect(component.isDone).toBe(true);
  });

  it('should parse a simple text', () => {
    const text = 'hi, it is a simple text';
    component.text = text;
    fixture.detectChanges();
    expect(component.value).toBe(text);
  });

  it('should parse special characters', () => {
    const text = '#important we need to visit to www.google.com and notify to admin@site.com, cc: @boss';
    const tags: HighlightTag[] = [
      {
        "indices": {
          "start": 0,
          "end": 10
        },
        "cssClass": "hashtag",
        "data": "#important"
      },
      {
        "indices": {
          "start": 80,
          "end": 85
        },
        "cssClass": "tag",
        "data": "@boss"
      },
      {
        "indices": {
          "start": 60,
          "end": 74
        },
        "cssClass": "email",
        "data": "admin@site.com"
      },
      {
        "indices": {
          "start": 31,
          "end": 45
        },
        "cssClass": "url",
        "data": "www.google.com"
      }
    ];
    const expectedText = '<span class="budge hashtag">#important</span> we need to visit to <span class="budge url"><div class="icon link"></div> Link</span> and notify to <span class="budge email"><div class="icon mail"></div> Mail</span>, cc: <span class="budge tag"><div class="avatar"></div> boss</span>';
    component.text = text;
    component.tags = tags;
    fixture.detectChanges();
    expect(component.value).toBe(expectedText);
  });

  it('should omit empty className', () => {
    const text = 'hi, it is a simple text';
    const tags: HighlightTag[] = [
      {
        "indices": {
          "start": 0,
          "end": 4,
        },
        "cssClass": "",
        "data": "hi"
      },
    ];
    component.text = text;
    component.tags = tags;
    fixture.detectChanges();
    expect(component.value).toBe('it is a simple text');
  });
});
