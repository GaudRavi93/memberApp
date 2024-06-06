import { Habit } from '../interfaces/habit';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HabitService {

  private habitsSubject = new BehaviorSubject<Habit[]>([]);
  habits$ = this.habitsSubject.asObservable();

  constructor(
    private auth: Auth,
    private http: HttpClient
  ) { }

  async retrieveHabit(habit_id: string) {
    // Get the ID token of the currently signed-in user
    const user = await this.auth.currentUser;

    if (!user) {
      console.error('No user signed in');
      throw new Error('No user signed in');
    }

    const idToken = await user.getIdToken();

    return this.http.get<any>(
      `/retrieveHabit?habitId=${habit_id}`,
      {
        headers: {
          Authorization: `Bearer ${idToken}`
        }
      }
    ).subscribe(habit => {
      console.debug('Retrieved habit:', habit);
      this.habitsSubject.next(habit);
    });
  }
}