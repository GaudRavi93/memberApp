import { Component, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { IonModal, ModalController } from '@ionic/angular';

import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage {
  @ViewChild(IonModal) modal!: IonModal

  // Fake Data 
  firstName = "Maxime"
  lastName = "Devoge"
  userName = this.firstName + " " + this.lastName
  email = "maxime@devoge.com"
  birthDate = new Date("1990-01-01")
  height = 187
  sex = "Male"
  avatarUrl = "/assets/placeholder/avatar.png"

  constructor(
    private authService: AuthService,
    private router: Router,
    private modalController: ModalController
  ) { }

  async logout() {
    await this.authService.logout();
    this.router.navigateByUrl('/login', { replaceUrl: true });
  }

  cancel() {
    this.modal.dismiss(null, 'cancel');
  }

  confirm() {
    this.modal.dismiss(this.firstName, 'confirm');
  }
}
