import { Task } from '../interfaces/task';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { BehaviorSubject, map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TasksService {

  private tasksSubject = new BehaviorSubject<Task[]>([]);
  tasks$ = this.tasksSubject.asObservable();

  constructor(
    private http: HttpClient,
    private auth: Auth
  ) { 
    this.retrieveTasks();
  }

  async retrieveTasks() {
    // Get the ID token of the currently signed-in user
    const user = await this.auth.currentUser;
  
    if(!user) {
      console.error('No user signed in');
      throw new Error('No user signed in');
    }
  
    const idToken = await user.getIdToken();
  
    this.http.get<any[]>(
      '/retrieveTasksByUser',
      {
        headers: {
          Authorization: `Bearer ${idToken}`
        }
      }
    ).subscribe(tasks => {
      console.debug('Retrieved tasks:', tasks);
      this.tasksSubject.next(tasks);
    });
  }

  async setTaskCompleted(task: Task) {
    // Get the ID token of the currently signed-in user
    const user = await this.auth.currentUser;
  
    if(!user) {
      console.error('No user signed in');
      throw new Error('No user signed in');
    }
  
    const idToken = await user.getIdToken();
  
    this.http.post(
      '/setTaskCompleted',
      {
        task_id: task.task_id
      },
      {
        headers: {
          Authorization: `Bearer ${idToken}`
        }
      }
    ).subscribe(() => {
      console.debug('Task marked as completed:', task);
      this.retrieveTasks();
    });
  }

  getTasks(): Observable<Task[]> {
    return this.tasks$;
  }
}