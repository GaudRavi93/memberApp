import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-rest',
  templateUrl: './rest.page.html',
  styleUrls: ['./rest.page.scss'],
})
export class RestPage implements OnInit {

  isPaused: boolean = false;

  countdownNumber = 30;
  countdown: number = this.countdownNumber;
  progressValue = 1;

  constructor(
    private navCtrl: NavController
  ) { }

  ngOnInit() {
    this.startCountdown();
  }

  startCountdown() {
    this.countdown = this.countdownNumber;
    this.progressValue = 1; // Start with a full progress bar


    const countdownInterval = setInterval(() => {
      if(this.isPaused) {
        return;
      }
      this.countdown--;
      this.progressValue = this.countdown / this.countdownNumber;


      if (this.countdown === 0) {
        clearInterval(countdownInterval);
        this.restFinished();
      }
    }, 1000);
  }


  goBack() {
    this.navCtrl.navigateForward('app/exercise');
  }

  pauseCountdown() {
    console.log('pauseCountdown');
    this.isPaused = !this.isPaused;    
  }

  restFinished() {
    console.log('restFinished');
    this.navCtrl.navigateForward(['/app/pa/feedback']);
  }

}
