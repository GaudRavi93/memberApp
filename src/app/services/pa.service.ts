import { Exercise, Step, Workout } from '../interfaces/pa';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { BehaviorSubject, forkJoin, map, of, switchMap } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class PaService {

  private loadedWorkoutId: string | null = null;
  private selectedWorkoutId: string | null = null;

  private workoutSubject = new BehaviorSubject<Workout | null>(null);
  workout$ = this.workoutSubject.asObservable();

  private currentStepIndex = 0;
  private workout_session_id!: string ;

  constructor(
    private http: HttpClient,
    private auth: Auth
  ) { }

/**
 * Load a workout and its exercises. Inject the exercises into the workout steps.
 * 
 * @param workoutId The ID of the workout to load.
 * 
 * @returns An Observable that emits the loaded workout.
 */
  async loadWorkoutAndExercises(workoutId: string): Promise<void> {
    // Get the ID token of the currently signed-in user
    const user = await this.auth.currentUser;

    if (!user) {
      console.error('No user signed in');
      throw new Error('No user signed in');
    }

    const idToken = await user.getIdToken();

    this.http.get<Workout>(
      `/retrieveWorkout?workout_id=${workoutId}`,
      {
        headers: {
          Authorization: `Bearer ${idToken}`
        }
      }
    )
      .pipe(
        switchMap(workout => {
          if(!workout) {
            throw new Error('Workout not found.');
          }

          // Extract the exercise IDs from the workout
          const exerciseIds = workout.steps.map(step => step.exercise_id);

          // Create a unique set of exercise IDs
          const uniqueExerciseIds = new Set(exerciseIds);

          // Map each unique exercise ID to a request to get the corresponding exercise
          const exerciseRequests = Array.from(uniqueExerciseIds).map(exerciseId => this.http.get<Exercise>(
            `/retrieveExercise?exercise_id=${exerciseId}`,
            {
              headers: {
                Authorization: `Bearer ${idToken}`
              }
            }
          ));

          // Get all exercises
          return forkJoin({
            workout: of(workout),
            exercises: forkJoin(exerciseRequests)
          }).pipe(
            map(({ workout, exercises }) => {
              // Inject the exercise objects into the workout steps
              workout.steps.forEach(step => {
                const exercise = exercises.find(exercise => exercise.exercise_id === step.exercise_id);
                if (exercise) {
                  step.exercise = exercise;
                }
              });

              // Design the workout as loaded.
              this.loadedWorkoutId = workoutId;

              return workout;
            })
          );
        })
      )
      .subscribe(workout => {
        console.log('Workout:', workout);
        if(workout){
          this.workoutSubject.next(workout);
        }
      });
  }

  /**
   * Get the selected workout ID.
   * 
   * @returns The selected workout ID.
  */
  getSelectedWorkoutId(): string {
    if(this.selectedWorkoutId === null) {
      console.error('No workout ID selected.');
      return '';
    }
    else {
      return this.selectedWorkoutId;
    }
  }

  setSelectedWorkoutId(id: string): void {
    this.selectedWorkoutId = id;
  }

  verifySelectedWorkoutId(workoutId: string): boolean {
    return this.selectedWorkoutId === workoutId;
  }
  
  /**
   * Start a workout session using the given workout ID and member ID. It will make a request to the server to create a new workout session.
   * @param workout_id
   * @param member_id 
   */
  async startWorkoutSession(workout_id: string){
    console.debug('Starting workout session...')
    // Define the URL
    const url = '/createWorkoutSession'

    // Prepare request body
    const body = {
      workout_id: workout_id
    }

    // Get the ID token of the currently signed-in user
    const user = await this.auth.currentUser;

    if (!user) {
      console.error('No user signed in');
      throw new Error('No user signed in');
    }

    const idToken = await user.getIdToken();

    // Make the request
    this.http.post(
      url, 
      body,
      {
        headers: {
          Authorization: `Bearer ${idToken}`
        }
      }
    )
      .subscribe((response: any) => {
        this.workout_session_id = response.workoutSessionId;
      });
    
  }

  /**
   * Update the workout session with the given workout session ID and data to update.
   * @param workout_session_id 
   * @param data_to_update 
   * @returns void
   */
  updateWorkoutSession(workout_session_id: string, data_to_update: object): void{
    // Define the URL
    const url = '/updateWorkoutSession'

    // Prepare request body
    const body = {
      workout_session_id: workout_session_id,
      data_to_update: data_to_update
    }

    // Make the request
    this.http.post(url, body);
  }

  getCurrentStepIndex(): number {
    return this.currentStepIndex;
  }

  getStep(stepIndex: number): Step {
    // Verify if the step exists
    if(this.workoutSubject.value?.steps[stepIndex]){
      return this.workoutSubject.value?.steps[stepIndex];
    }
    else {
      throw new Error('Step not found.');
    }
  }

  getWorkoutLength(): number {
    let lenght = this.workoutSubject.value?.steps.length || 0;

    lenght = lenght - 1;

    return lenght;
  }

  getCurrentExerciseId(): string {
    return this.workoutSubject.value?.steps[this.currentStepIndex].exercise_id || '';
  }

  /**
   * Update the current step index and the workout session.
   * @returns void
   */
  nextStep(): void {
    // Update the current step index
    this.currentStepIndex++;

    // Update the workout session
    const url = '/updateWorkoutSession'

    // Prepare request body
    const body = {
      workout_session_id: this.workout_session_id,
      data_to_update: {
        current_step: this.currentStepIndex
      }
    }

    // Make the request
    this.http.post(url, body);
  }

  getloadingWorkoutId(): string | null {
    return this.loadedWorkoutId;
  }

  resetWorkout(): void {
    this.currentStepIndex = 0;
    this.workout_session_id = '';
  }

  /**
   * End the workout session by updating the workout session status to 'completed'.
   * @returns void
   */
  async endWorkoutSession() {
    console.debug('Ending workout session...')
    // Define the URL
    const url = '/updateWorkoutSession'

    // Get the ID token of the currently signed-in user
    const user = await this.auth.currentUser;

    if (!user) {
      console.error('No user signed in');
      throw new Error('No user signed in');
    }

    const idToken = await user.getIdToken();

    // Prepare request body
    const body = {
      workout_session_id: this.workout_session_id,
      data_to_update: {
        current_step: this.currentStepIndex,
        completion_status: 'completed'
      }
    }

    // Make the request
    this.http.patch(
      url,
      body,
      {
        headers: {
          Authorization: `Bearer ${idToken}`
        }
      }
    ).subscribe({
      next: (response) => console.log(response),
      error: (error) => console.error(error)
    });

    this.resetWorkout();
  }
}
