import { Component, OnInit } from '@angular/core';
import { Form, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {
  credentials = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  constructor(
    private fb: FormBuilder,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    private authService: AuthService,
    private router: Router
  ) { }

    get email() {
      return this.credentials.controls.email;
    }

    get password() {
      return this.credentials.controls.password;
    }

    async login() {
      const loading = await this.loadingCtrl.create({
        message: 'Logging in...',
        spinner: 'crescent',
        showBackdrop: true,
      });
      await loading.present();

      this.authService.login(this.credentials.getRawValue())
        .then(() => {
          loading.dismiss();
          this.router.navigateByUrl('/app', { replaceUrl: true });
        })
        .catch(async error => {
          loading.dismiss();
          await this.showAlert('Login Failed', error.message);
        });

    }
    
    async showAlert(header: string, message: string) {
      const alert = await this.alertCtrl.create({
        header,
        message,
        buttons: ['OK'],
      });
      await alert.present();
    }

}
