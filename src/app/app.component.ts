import { ChatService } from './services/chat.service';
import { Component, OnInit } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { ChatClientService } from 'stream-chat-angular';
import { register } from 'swiper/element/bundle';

 
import {
  ActionPerformed,
  PushNotificationSchema,
  PushNotifications,
  Token,
} from "@capacitor/push-notifications";
import { Platform } from '@ionic/angular';
import * as LiveUpdates from '@capacitor/live-updates';
import { LocalNotifications } from '@capacitor/local-notifications';

// Register Swiper
register();

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {

  constructor(
    private chatClientService: ChatClientService,
    private chatService: ChatService,
    private auth: Auth,
    private platform: Platform
  ) { }

  ngOnInit() {
    this.platform.ready().then(async () => {

      if(this.platform.is('capacitor')){
        const notifs = await LocalNotifications.schedule({
          notifications: [
            {
              title: 'Download completed 1',
              body: 'Please restart you application 1',
              id: 1,
              schedule: { at: new Date(Date.now() + 1000 * 5) },
              actionTypeId: '',
              extra: null,
            },
          ],
        });
        console.log('notifs 1: ', notifs);
        const resultSync = await LiveUpdates.sync();
        if(resultSync.activeApplicationPathChanged){
          const notifs = await LocalNotifications.schedule({
            notifications: [
              {
                title: 'Download completed 2',
                body: 'Please restart you application 2',
                id: 1,
                schedule: { at: new Date(Date.now() + 1000 * 5) },
                actionTypeId: '',
                extra: null,
              },
            ],
          });
          alert('notifs 2: '+ notifs);
        }
        console.log('resultSync: ', resultSync);
        // Request permission to use push notifications
        // iOS will prompt user and return if they granted permission or not
        // Android will just grant without prompting
        PushNotifications.requestPermissions().then((result) => {
          if (result.receive === "granted") {
            // Register with Apple / Google to receive push via APNS/FCM
            PushNotifications.register();
          } else {
            // Show some error
            console.log("User denied push notification permissions");
          }
        });
    
        // On success, we should be able to receive notifications
        PushNotifications.addListener("registration", (token: Token) => {
          console.log("Push registration success, token: " + token.value);
          this.chatService.setPushToken(token.value);
        });
    
        // Some issue with our setup and push will not work
        PushNotifications.addListener("registrationError", (error: any) => {
          console.log("Error on registration: " + JSON.stringify(error));
        });
    
        // Show us the notification payload if the app is open on our device
        PushNotifications.addListener(
          "pushNotificationReceived",
          (notification: PushNotificationSchema) => {
            console.log("Push received: " + JSON.stringify(notification));
          }
        );
    
        // Method called when tapping on a notification
        PushNotifications.addListener(
          "pushNotificationActionPerformed",
          (notification: ActionPerformed) => {
            console.log("Push action performed: " + JSON.stringify(notification));
          }
        );
      }
    });
  }

}