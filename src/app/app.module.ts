import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';



import {
  StreamAutocompleteTextareaModule,
  StreamChatModule,
} from "stream-chat-angular";

const firebaseConfig = {
  apiKey: "AIzaSyBmcZqVJBfJ0NgCI_W2G8pOBbWpdVfMvJs",
  authDomain: "development-35385.firebaseapp.com",
  projectId: "development-35385",
  storageBucket: "development-35385.appspot.com",
  messagingSenderId: "971378351719",
  appId: "1:971378351719:web:caa8972102a97477997ec2",
  measurementId: "G-F4MKP3MN2V"
};

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule, 
    IonicModule.forRoot(), 
    AppRoutingModule,
    provideFirebaseApp(() => initializeApp(firebaseConfig)), 
    provideAuth(() => getAuth()), 
    provideFirestore(() => getFirestore()),
    TranslateModule.forRoot(),
    StreamAutocompleteTextareaModule,
    StreamChatModule,
    HttpClientModule
  ],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule {}
