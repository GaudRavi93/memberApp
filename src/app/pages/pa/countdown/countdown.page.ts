import { Component, OnInit } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { PaService } from 'src/app/services/pa.service';


@Component({
  selector: 'app-countdown',
  templateUrl: './countdown.page.html',
  styleUrls: ['./countdown.page.scss'],
})
export class CountdownPage implements OnInit {
  countdown = 5;
  countdownInterval: any; 

  constructor(
    private navCtrl: NavController,
    private paService: PaService,
    private router: Router
  ) { 
    // Subscribe to router events
    this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        // If a navigation starts, clear the interval
        console.debug('Clearing countdown interval');
        clearInterval(this.countdownInterval);
      }
    });
  }

  ngOnInit() {
    const urlWorkoutId = this.paService.getSelectedWorkoutId();

    // Start the countdown
    this.countdownInterval = setInterval(() => {
      this.countdown--;

      // When the countdown reaches 0, clear the interval and navigate to the first exercise
      if (this.countdown === 0) {
        clearInterval(this.countdownInterval);

        this.paService.workout$.subscribe(workout => {
          // Check if the workout is defined and matches the workout in the URL
          if (workout !== null && workout.steps.length > 0) {
            // Navigate to the exercise
            this.navCtrl.navigateForward(`app/pa/${urlWorkoutId}/exercise/`);
          }
        });
      }
    }, 1000);  // 1000 milliseconds = 1 second
  }
}