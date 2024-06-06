import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-stats',
  templateUrl: './stats.page.html',
  styleUrls: ['./stats.page.scss'],
})
export class StatsPage implements OnInit {
  entries: number = 10;
  streaks: number = 5; 
  days: { completed: boolean }[] = [
    { completed: true },
    { completed: true },
    { completed: false },
    { completed: false },
    { completed: false },
  ];

  constructor(
    private router: Router
  ) { }

  ngOnInit() {
  }

  continue() {
    console.log('continue');
    this.router.navigate(['/app/pa/taste']);
  }

}
