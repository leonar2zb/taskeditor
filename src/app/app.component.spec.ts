import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { TaskInputComponent } from './task-input/task-input.component';
import { TaskListComponent } from './task-list/task-list.component';
import { TaskService } from './task.service';

describe('AppComponent', () => {
  let fixture: ComponentFixture<AppComponent>;
  let app: AppComponent;
  let taskService: TaskService;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [TaskService],
      declarations: [
        AppComponent,
        TaskInputComponent,
        TaskListComponent,
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(AppComponent);
    app = fixture.componentInstance;
    taskService = TestBed.inject(TaskService);
  });

  it('should create the app', () => {
    expect(app).toBeTruthy();
  });

  it('should set focus', () => {
    const focusSpy = spyOn(app._inputFocused$, 'next')
    app.onInputFocus();
    expect(focusSpy).toHaveBeenCalled();
  });

  it('should add a task', () => {
    const mockTask = { text: '', tags: [] };
    spyOn(taskService, 'addTask');
    app.onAddTask(mockTask);
    expect(taskService.addTask).toHaveBeenCalledWith(mockTask);
  });
});
