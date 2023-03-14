import { TestBed } from '@angular/core/testing';
import { take } from 'rxjs';

import { Task, TaskService } from './task.service';

describe('TaskService', () => {
  let service: TaskService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TaskService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should add a task', (done) => {
    const mockTask: Task = { text: 'mock text', tags: [] };
    service.addTask(mockTask);
    service.tasks.subscribe(tasks => {
      expect(tasks).toContain(jasmine.objectContaining(mockTask));
      done();
    })
  })

  it('should update a task', (done) => {
    const mockTask: Task = { text: 'mock text', tags: [], id: 1 };
    service.addTask(mockTask);
    service.tasks.pipe(take(1)).subscribe(tasks => {
      expect(tasks).toContain(jasmine.objectContaining(mockTask));
    });

    const updateTask: Task = { text: 'updated text', tags: [], id: 1 };
    service.updateTask(updateTask);

    service.tasks.pipe(take(1)).subscribe(tasks => {
      expect(tasks).toContain(jasmine.objectContaining(updateTask));
      done();
    });
  });
});
