import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LoadingController, NavController } from '@ionic/angular';
import { Observable, tap } from 'rxjs';
import { Workout } from 'src/app/interfaces/pa';
import { AuthService } from 'src/app/services/auth.service';
import { PaService } from 'src/app/services/pa.service';
import Swiper from 'swiper';

@Component({
  selector: 'app-pa',
  templateUrl: './pa.page.html',
  styleUrls: ['./pa.page.scss'],
})
export class PaPage implements OnInit {

  urlWorkoutId!: string; // URL parameter
  selectedWorkoutId?: string; // workout ID currently selected in PA service

  workout$?: Observable<Workout | null>;

  constructor(
    private navCtrl: NavController,
    private paService: PaService,
    private route: ActivatedRoute,
    private loadingController: LoadingController
  ) { }

  /**
   * Lifecycle hook that is called after the view has been initialized.
   * 
   * Initializes the component by performing the following steps:
   * 1. Retrieves the workout ID from the URL.
   * 2. Compares the workout ID from the URL with the one from the service.
   * 3. If the workout IDs do not match, sets the selected workout ID in the service.
   * 4. Starts loading by presenting a loading spinner.
   * 5. Retrieves the workout and exercises from the service.
   * 6. Subscribes to the workout observable and dismisses the loading spinner when the data is loaded.
   * 
   * @returns void
   */
  ngOnInit() {
    // Get the workout ID from the URL
    this.urlWorkoutId = this.getWorkoutIdFromUrl();

    // Get the workout ID from the service
    this.selectedWorkoutId = this.getWorkoutIdFromService();

    // Compare the workout ID from the URL with the one from the service
    if (this.selectedWorkoutId !== this.urlWorkoutId) {
      if (this.selectedWorkoutId !== '') {
        console.error('Workout ID from URL does not match the one from the service.');
      }
      else {
        this.paService.setSelectedWorkoutId(this.urlWorkoutId);
      }
    }

    // Start loading
    this.presentLoading();

    // Get the workout and exercises
    this.paService.loadWorkoutAndExercises(this.urlWorkoutId);

    this.workout$ = this.paService.workout$.pipe(
      tap(workout => {
        // Data is loaded
        this.loadingController.dismiss();
      })
    );
  }

  /**
  * Lifecycle hook that is called after the view has been initialized.
  * 
  * Initializes a new Swiper instance for the '.swiper-container-exercices' element.
  * 
  * @returns void
  */
  ngAfterViewInit() {
    new Swiper('.swiper-container-exercices', {
      slidesPerView: 2.2,
      freeMode: true,
      spaceBetween: -20
    });
  }

  /**
 * Display a loading spinner while the workout data is being loaded.
 * 
 * @returns {Promise<void>} A promise that resolves when the loading spinner is dismissed.
 */
  async presentLoading() {
    const loading = await this.loadingController.create({
      message: 'Loading workout data...',
      duration: 2000
    });
    await loading.present();
  
    const { role, data } = await loading.onDidDismiss();
  }


  /**
   * Get the workout ID from the URL.
   * 
   * If the workout ID is not found in the URL, return a fake ID.
   * 
   * @returns The workout ID.
   */
  getWorkoutIdFromUrl() {
    // Get the workout ID from the URL
    const params = this.route.snapshot.paramMap;

    const workoutId = params.get('workoutId');

    if (workoutId) {
      console.debug('Workout ID found in URL.', workoutId);
      return workoutId;
    }
    else {
      console.error('No workout ID found in URL. Returning fake ID.');
      return 'fakeid';
    }
  }

  /**
   * Get the workout ID from the service.
   * 
   * @returns The workout ID.
   */
  getWorkoutIdFromService() {
    // Get the workout ID from the service
    return this.paService.getSelectedWorkoutId();
  }


  /**
   * Start the workout by navigating to the first exercise.
   * 
   * If the first exercise is a rest, navigate to the rest page.
   */
  startWorkout() {
    console.log('Starting workout...');

    // Check if the workout is already loaded
    if (this.paService.getloadingWorkoutId() !== this.urlWorkoutId) {
      console.error('Workout not loaded.');
      return;
    }

    // Start workout session
    this.paService.startWorkoutSession(this.urlWorkoutId);

    // Navigate to the countdown page
    this.navCtrl.navigateForward(`/app/pa/${this.urlWorkoutId}/countdown`);
  }
}
