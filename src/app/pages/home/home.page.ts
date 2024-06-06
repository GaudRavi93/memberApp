import { Task } from '../../interfaces/task';
import { Component, OnInit } from '@angular/core';
import { ActionSheetController, AlertController, NavController, ToastController } from '@ionic/angular';
import { isSameDay, startOfDay } from 'date-fns';
import { map, Observable } from 'rxjs';
import { TasksService } from 'src/app/services/tasks.service';
import Swiper from 'swiper';


@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  challenges = [
    { title: 'Challenge 1', description: 'Description 1' },
    { title: 'Challenge 2', description: 'Description 2' },
    { title: 'Challenge 3', description: 'Description 3' },
    { title: 'Challenges', description: 'Explore more challenges'}
  ];

  helpItems = [
  { icon: 'call', title: "Talk to a doctor for free, 24/7" ,content: 'Start a phone or video call with a doctor 24/7 - anywhere, anytime' },
  { icon: 'body', title: "Help with joint or muscle aches", content: 'Get a personalized program to help overcome any aches or pains you have' },
  { icon: 'heart', title: "Work on your mental health", content: 'Get access to a ton of free mental health resources anytime you need' },
  ];

  recommendations = [
  { title: 'Recommendation 1', content: 'Content 1', subtitle: 'Subtitle 1', image: '/assets/placeholder/person.png' },
  { title: 'Recommendation 2', content: 'Content 2', subtitle: 'Subtitle 2', image: '/assets/placeholder/person.png' },
  ];

  tasks$!: Observable<Task[] | null >;

  constructor(
    private navCtrl: NavController,
    private toastController: ToastController,
    private actionSheetController: ActionSheetController,
    private alertController: AlertController,
    private toastCtrl: ToastController,
    private tasksService: TasksService
  ) { }

  ngOnInit() {
    this.tasks$ = this.tasksService.getTasks().pipe(
      map(tasks => tasks.filter(task => isSameDay(startOfDay(new Date(task.scheduled_start_time)), startOfDay(new Date()))))
    );
  }

  ngAfterViewInit() {
    new Swiper('.swiper-container-challenges', {
      slidesPerView: 1.5,
      freeMode: true,
      spaceBetween: -10
    });

    new Swiper('.swiper-container-recommendations', {
      slidesPerView: 1,
      freeMode: true,
      spaceBetween: 0
    });
  }

  redirectToProfile() {
    console.debug('Redirecting to profile page');
    this.navCtrl.navigateForward('/app/profile');
  }
  
  redirectToGiveaway() {
    console.debug('Redirecting to giveaway page');
    this.navCtrl.navigateForward('/app/giveaway');
  }
  
  goToAction(taskInfo: Task['task_info']) {
    // Redirect to the appropriate page based on the task type
    if (taskInfo.medication_id) {
      this.navCtrl.navigateForward(`/app/medication/${taskInfo.medication_id}`);
    } else if (taskInfo.habits_id) {
      this.navCtrl.navigateForward(`/app/habits/${taskInfo.habits_id}`);
    } else if (taskInfo.workout_id) {
      this.navCtrl.navigateForward(`/app/pa/${taskInfo.workout_id}`);
    } else {
      console.error('No task type found');
    }
  }
  async markTaskAsCompleted(task: Task) {
    if(task.status === 'completed') {
      console.warn('Task is already completed');
      return;
    }

    task.status = 'completed';
    const toast = await this.createCompletionToast(task);
    toast.present();

    const { role } = await toast.onDidDismiss();
    if (role !== 'cancel') {
      this.tasksService.setTaskCompleted(task);
    }
  }

  async createCompletionToast(task: Task) {
    return this.toastController.create({
      message: 'Task has been completed !',
      duration: 5000,
      color: 'success',
      buttons: [
        {
          text: 'Undo',
          role: 'cancel',
          handler: () => {
            // Undo the task completion
            task.status = 'pending';
          }
        }
      ]
    });
  }

  async presentTaskOptions(task: Task['task_info']) {
    const actionSheet = await this.actionSheetController.create({
      header: "Options",
      buttons: [
        {
          text: 'See more details about the task',
          icon: 'stats-chart',
          handler: () => {
            if(task.habits_id) {
              this.navCtrl.navigateForward(`/app/habit/${task.habits_id}`);        
            }
          }
        
        },
      {
        text: 'Report a problem with the task',
        icon: 'megaphone',
        handler: () => {
          this.presentReportProblemModal();
        }
      }
    ]
    });

    await actionSheet.present();
  }

  async presentReportProblemModal() {
  const alert = await this.alertController.create({
    header: 'Report a problem',
    inputs: [
      {
        name: 'problem',
        type: 'text',
        placeholder: 'Describe the problem'
      }
    ],
    buttons: [
      {
        text: 'Cancel',
        role: 'cancel'
      },
      {
        text: 'Submit',
        handler: (data) => {
          const toast =  this.toastCtrl.create({
            message: 'Problem has been reported to your coach!',
            duration: 5000,
            color: 'primary'
          });
          toast.then(toast => toast.present());
        }
      }
    ]
  });

  await alert.present();
}

}