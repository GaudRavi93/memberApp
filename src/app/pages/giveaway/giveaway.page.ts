import { Component, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-giveaway',
  templateUrl: './giveaway.page.html',
  styleUrls: ['./giveaway.page.scss'],
})
export class GiveawayPage implements OnInit, OnDestroy {

  days!: number;
  hours!: number;
  minutes!: number;
  seconds!: number;
  endTime = new Date('2024-06-31T23:59:59'); 
  countdownInterval!: any;

  constructor() { }

  ngOnInit() {
    this.startCountdown();
  }

  ngOnDestroy() {
    if (this.countdownInterval) {
      clearInterval(this.countdownInterval);
    }
  }

  startCountdown() {
    this.countdownInterval = setInterval(() => {
      const now = new Date();
      const distance = this.endTime.getTime() - now.getTime();

      this.days = Math.floor(distance / (1000 * 60 * 60 * 24));
      this.hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      this.minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      this.seconds = Math.floor((distance % (1000 * 60)) / 1000);
    }, 1000);
  }
}