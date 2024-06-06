import { Component, ElementRef, OnInit, QueryList, ViewChildren } from '@angular/core';
import { AnimationController, GestureController, IonCard, NavController, Platform, ToastController } from '@ionic/angular';

@Component({
  selector: 'app-taste',
  templateUrl: './taste.page.html',
  styleUrls: ['./taste.page.scss'],
})
export class TastePage implements OnInit {

  exercises = [
    { image: 'https://placekitten.com/300/300', title: 'Exercise 1' },
    { image: 'https://placekitten.com/300/300', title: 'Exercise 2' },
    { image: 'https://placekitten.com/300/300', title: 'Exercise 3' },
  ];

  swipeCount = 0;
  progress = 0;

  @ViewChildren(IonCard, { read: ElementRef }) cards!: QueryList<ElementRef>;

  constructor(
    private gestureCtrl: GestureController,
    private animationCtrl: AnimationController,
    private plt: Platform,
    private navCtrl: NavController,
    private toastCtrl: ToastController
  ) { }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.addTinderSwipe(this.cards.toArray());
  }

  addTinderSwipe(cardArray: ElementRef<any>[]) {
    for (let i = 0; i < cardArray.length; i++) {
      const card = cardArray[i];
      const style = card.nativeElement.style;

      const swipe = this.gestureCtrl.create({
        el: card.nativeElement,
        gestureName: `swipe-${i}`,
        threshold: 0,
        onStart: () => {
          style.transition = '';
        },
        onMove: ev => {
          style.transform = `translateX(${ev.deltaX}px) rotate(${ev.deltaX / 10}deg)`;
          let color = ev.deltaX < 0 ? 'var(--ion-color-danger)' : 'var(--ion-color-success)';
          style.background = color;
        },
        onEnd: ev => {
          style.transition = '.5s ease-out';

          if (ev.deltaX > 150) {
            style.transform = `translateX(${this.plt.width() * 2}px) rotate(${ev.deltaX / 2}deg)`;
            this.swipeCount++;
            this.progress = this.swipeCount / cardArray.length; 
          } else if (ev.deltaX < -150) {
            style.transform = `translateX(-${this.plt.width() * 2}px) rotate(${ev.deltaX / 2}deg)`;
            this.swipeCount++;
            this.progress = this.swipeCount / cardArray.length;
          } else {
            style.transform = '';
            style.background = '';
          }
          if (this.swipeCount === cardArray.length) {
            this.presentToast();
            this.navCtrl.navigateBack('/app/home');
          }
        }
      });
      swipe.enable();
    }
  }

  async presentToast() {
    const toast = await this.toastCtrl.create({
      message: 'Thank you! We will learn from your taste to improve your workout program',
      duration: 4000,
      color: 'success',
      position: 'top'
    });
    toast.present();
  }


}
