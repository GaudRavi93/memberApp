import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { PaService } from 'src/app/services/pa.service';

@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.page.html',
  styleUrls: ['./feedback.page.scss'],
})
export class FeedbackPage implements OnInit {
  difficulty = 1;

  workoutId!: string;

  constructor(
    private navCtrl: NavController,
    private paService: PaService
  ) { }

  ngOnInit() {
    this.workoutId = this.paService.getSelectedWorkoutId();

  }

  continue() {
    this.navCtrl.navigateForward(`app/pa/${this.workoutId}`);
  }
  

getDifficultyLabel() {
  switch (this.difficulty) {
    case 0: return "Workout was way too hard. I couldn’t finish it.";
    case 1: return "Workout was hard.";
    case 2: return "Workout was a bit too challenging but I was able to keep up.";
    case 3: return "Workout was at the right difficulty level";
    case 4: return "Workout was not complicated.";
    case 5: return "Workout was too easy, I almost didn’t sweat !";
    case 6: return "Workout was too simple, I was bored.";
    default: return "";
  }
}

}
