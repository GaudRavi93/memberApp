import { Component, OnInit } from '@angular/core';
import Swiper from 'swiper';

@Component({
  selector: 'app-care',
  templateUrl: './care.page.html',
  styleUrls: ['./care.page.scss'],
})
export class CarePage implements OnInit {

  selectedView = 'todo';

  ressources = [
    { title: 'Mental Health'},
    { title: 'Sleep Health'}    
  ]

  constructor() { }

  ngOnInit() {
  }

  ngAfterViewInit() {
    new Swiper('.swiper-container-ressources', {
      slidesPerView: 1.2,
      freeMode: true,
      spaceBetween: 0
    });
  }

}
