import { ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { filter, from, interval, Observable, Subject, Subscription, switchMap, takeUntil, tap } from 'rxjs';
import { Step, Workout } from 'src/app/interfaces/pa';
import { PaService } from 'src/app/services/pa.service';

@Component({
  selector: 'app-exercise',
  templateUrl: './exercise.page.html',
  styleUrls: ['./exercise.page.scss'],
})
export class ExercisePage implements OnInit, OnDestroy {
  workoutId!: string;
  workout$!: Observable<Workout>;

  currentStep!: Step;

  countdownSubscription!: Subscription;
  countdownStop$ = new Subject<void>();

  countdownNumber = 0;
  countdown = this.countdownNumber;
  countdownInterval: any;

  progressValue = 1;
  isPaused = false;

  zoom_count = 1;
  completedStep = 0;
  workout_steps: any = [];

  // Subject to destroy the countdown when the component is destroyed
  destroy$ = new Subject<void>();
  @ViewChild('videoPlayer') videoPlayer!: ElementRef;

  constructor(
    private route: ActivatedRoute,
    private navCtrl: NavController,
    private paService: PaService,
    public cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
    // Get the workout ID from the URL
    this.workoutId = this.getWorkoutIdFromUrl();

    // Verify that the loaded workout matches the workout ID from the URL
    if (this.paService.getSelectedWorkoutId() !== this.workoutId) {
      console.error('Loaded workout does not match the workout ID from the URL.');
      throw new Error('Loaded workout does not match the workout ID from the URL.');
    }

    // Retrieve the loaded workout from the service
    this.workout$ = this.paService.workout$.pipe(
      filter((workout): workout is Workout => workout !== null)
    );

    this.workout$.pipe(
      switchMap(workout => {
        const steps = workout.steps || [];
        const stepsObservable = from(steps);

        // filter the steps by the mode of exercise
        return stepsObservable.pipe(
          filter((step): step is Step => Boolean(step.exercise && step.exercise.mode_of_exercise !== 'rest'))
        );
      })
    ).subscribe((step_res: any) => {
      this.workout_steps.push({
        exercise_id: step_res.exercise_id,
        steps_name: step_res.exercise.name,
        steps_mode: step_res.exercise.mode_of_exercise,
        isCompleted: false,
        percentage: 0
      });
    });

    // Retrieve the current step index from the service
    const startingStepIndex = this.paService.getCurrentStepIndex();

    // Get the current step
    this.currentStep = this.paService.getStep(startingStepIndex);

    // If the current step index is 0, we are starting a workout from the beginning
    // If the current step index is greater than 0, we are resuming a workout
    if (startingStepIndex === 0) {
      console.debug('Starting workout from the beginning.');
    } else {
      console.debug('Resuming workout from step', startingStepIndex);
      let foundMatch = false;
      this.workout_steps.forEach((element: any) => {
        // if starting steps is not 0 then count the completed steps
        if (!foundMatch && element.exercise_id !== this.currentStep.exercise_id) {
          element.isCompleted = true;
          this.completedStep = this.completedStep + 1;
        } else {
          foundMatch = true
        }
      });
    }

    // Verify that the current step is not null and start the countdown
    if (this.currentStep !== null) {
      this.startCountdown(this.currentStep.duration);
    }
  }

  // video zoom-out function
  DecreaseZoom() {
    if (this.zoom_count != 1) {
      this.zoom_count = this.zoom_count - 1;
      this.cdr.detectChanges();
    }
  }

  // video zoom-in function
  IncreaseZoom() {
    if (this.zoom_count < 5) {
      this.zoom_count = this.zoom_count + 1;
      this.cdr.detectChanges();
    }
  }

  /**
   * Get the exercise for the given step index from the PA service.
   * @param stepIndex 
   * @returns The exercise for the given step index.
   */
  getExercise(stepIndex: number): Step {
    return this.paService.getStep(stepIndex);
  }

  ngOnDestroy() {
    console.debug('ExercisePage destroyed.')
    this.destroy$.next();
    this.destroy$.complete();

    if (this.countdownSubscription) {
      this.countdownSubscription.unsubscribe();
    }
  }

  /**
   * Get the exercise ID from the URL using the Angular ActivatedRoute.
   * @returns The exercise ID from the URL.
   */
  getExerciseIdFromUrl(): string {
    const params = this.route.snapshot.paramMap;
    const exerciseId = params.get('exerciseId');

    if (exerciseId) {
      console.debug('Exercise ID found in URL.', exerciseId);
      return exerciseId;
    } else {
      console.error('No exercise ID found in URL. Returning fake ID.');
      throw new Error('No exercise ID found in URL.');
    }
  }

  /**
   * Get the workout ID from the URL using the Angular ActivatedRoute.
   * @returns The workout ID.
   */
  getWorkoutIdFromUrl(): string {
    // Get the workout ID from the URL
    const params = this.route.snapshot.paramMap;

    const workoutId = params.get('workoutId');

    if (workoutId) {
      console.debug('Workout ID found in URL.', workoutId);
      return workoutId;
    }
    else {
      console.error('No workout ID found in URL. Returning fake ID.');
      throw new Error('No workout ID found in URL.');
    }
  }

  /**
   * Start the countdown for the given duration in seconds and update the progress bar.
   * When the countdown reaches 0, call the exerciseFinished() method.
   * @param seconds The duration of the countdown in seconds.
   * @returns void
   */
  startCountdown(seconds: number): void {
    this.countdown = seconds;
    this.countdownNumber = seconds;
    this.progressValue = 1; // Start with a full progress bar

    this.countdownSubscription = interval(1000).pipe(
      takeUntil(this.countdownStop$),
      tap(() => {
        if (!this.isPaused) {
          this.countdown--;
          this.progressValue = this.countdown / this.countdownNumber;

          if (this.countdown === 0) {
            this.exerciseFinished();
          }
        }
      })
    ).subscribe();
  }

  /**
   * Destroy the countdown by emitting a value on the countdownStop$ Subject.
   * This will stop the countdown.
   * @returns void
   */
  destroyCountdown(): void {
    console.debug('Destroying countdown');
    this.countdownStop$.next();
    // Reset the countdown stop signal so it can be used again
    this.countdownStop$ = new Subject<void>();
  }

  /**
   * Called when the exercise is finished.
   * This method will navigate to the next exercise or to the feedback page if the workout is finished.
   * @returns void
   */
  exerciseFinished(): void {
    console.debug('Exercise finished.');

    // Unsubscribe from the countdown subscription to clear the interval
    if (this.countdownSubscription) {
      this.countdownSubscription.unsubscribe();
    }

    if (this.paService.getCurrentStepIndex() < this.paService.getWorkoutLength()) {
      console.debug('Navigating to the next exercise.');
      // display the progress bar as completed
      const steps_details = this.workout_steps.find((steps: any) =>
        (steps.steps_name == this.currentStep.exercise?.name) && (steps.isCompleted == false)
      );
      if (steps_details) {
        steps_details.isCompleted = true;
        this.cdr.detectChanges();
      }

      // Tell the service to go to the next step
      this.paService.nextStep();

      // increase the completed steps count if mode is not rest
      if (this.currentStep.exercise && this.currentStep.exercise.mode_of_exercise !== 'rest')
        this.completedStep = this.completedStep + 1;

      // Get the current step
      this.currentStep = this.paService.getStep(this.paService.getCurrentStepIndex());
      if (this.isPaused)
        this.pauseCountdown(false);

      // Verify that the current step is not null and start the countdown
      if (this.currentStep !== null) {
        this.startCountdown(this.currentStep.duration);
      }
    } else {
      // Tell the service we are done with the workout
      this.paService.endWorkoutSession();

      // Navigate to the feedback page
      this.navCtrl.navigateForward(`app/pa/test/feedback`);
    }

  }

  goBackToPa() {
    this.navCtrl.navigateForward('app/pa/' + this.workoutId);
  }

  goHome() {
    this.navCtrl.navigateForward('app/home');
  }

  // pause the video
  pauseCountdown(pauseValue: boolean) {
    const video: HTMLVideoElement = this.videoPlayer.nativeElement;
    this.isPaused = pauseValue;
    if (this.isPaused) {
      video.pause();
    } else {
      video.play();
    }
  }

  //  format number to time format
  formatTime(seconds: number): string {
    const minutes: number = Math.floor(seconds / 60);
    const remainingSeconds: number = seconds % 60;
    const formattedMinutes: string = minutes < 10 ? '0' + minutes : '' + minutes;
    const formattedSeconds: string = remainingSeconds < 10 ? '0' + remainingSeconds : '' + remainingSeconds;
    return formattedMinutes + ':' + formattedSeconds;
  }
}
