import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-medication',
  templateUrl: './medication.page.html',
  styleUrls: ['./medication.page.scss'],
})
export class MedicationPage implements OnInit {

  medicationData = {
    name: 'Medication Name',
    frequency: "Every day at 10 am",
    instructions: "When you wake up, take 1 pill with water, and eat a small meal, then go about your day, and don't forget to drink water!",
    stats: {
      compliance7days: 0.8,
      complianceAllTime: 0.9,
    }

  }

  constructor() { }

  ngOnInit() {
  }

}
