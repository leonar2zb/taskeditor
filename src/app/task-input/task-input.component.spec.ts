import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { HighlightTag, TextInputHighlightModule } from 'angular-text-input-highlight';
import { TaskService } from '../task.service';

import { TaskInputComponent } from './task-input.component';

describe('TaskInputComponent', () => {
  let component: TaskInputComponent;
  let fixture: ComponentFixture<TaskInputComponent>;
  let taskService: TaskService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormsModule, TextInputHighlightModule],
      declarations: [TaskInputComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(TaskInputComponent);
    component = fixture.componentInstance;
    taskService = TestBed.inject(TaskService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should be empty if there is no text', () => {
    component.text = '';
    fixture.detectChanges();
    expect(component.isInputEmpty).toBe(true);
  });

  it('should be not empty if there is text', () => {
    component.value = 'mock text';
    fixture.detectChanges();
    expect(component.isInputEmpty).toBe(false);
  });

  it('should be a beauty input when focus it', () => {
    spyOn(component, 'addTags');
    component.onInputFocus();
    expect(component.isInputFocused).toBe(true);
  });

  it('should be a simple input when lost focus and it is empty', () => {
    component.text = '';
    component.onInputBlur();
    expect(component.isInputFocused).toBe(false);
  });

  it('should prevent multiline', () => {
    const mockEvent = new KeyboardEvent('keydown', { code: 'Enter' });
    spyOn(mockEvent, 'preventDefault');
    component.preventMultiline(mockEvent);
    expect(mockEvent.preventDefault).toHaveBeenCalled();
  });

  it('should reset the input', () => {
    component.value = 'mock text';
    component.isInputFocused = true;
    component.resetInput();
    expect(component.value).toBe('');
    expect(component.isInputFocused).toBe(false);
  });

  it('should add task', () => {
    spyOn(component, 'resetInput').and.callThrough();
    component.onAddAction();
    expect(component.resetInput).toHaveBeenCalled();
  });

  it('should evaluate different RegExp when add tags', () => {
    const expectedTags: HighlightTag[] = [
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
    component.value = '#important we need to visit to www.google.com and notify to admin@site.com, cc: @boss';
    component.addTags();
    expect(component.tags).toEqual(expectedTags);
  });
});

