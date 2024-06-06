import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-health',
  templateUrl: './health.page.html',
  styleUrls: ['./health.page.scss'],
})
export class HealthPage implements OnInit {

  completedDays: { [key: string]: boolean } = {};

  constructor() { }

  ngOnInit() {
    for (let day of ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su']) {
      this.completedDays[day] = Math.random() < 0.5;
    }
  }

  isCompleted(day: string): boolean {
    return this.completedDays[day];
  }

}