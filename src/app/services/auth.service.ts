import { Injectable } from '@angular/core';
import { Auth, signInWithEmailAndPassword } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private auth: Auth
  ) { }

  async login({email, password}: {email: string, password: string}) {
    try {
      const credentials = await signInWithEmailAndPassword(this.auth, email, password);

      return credentials;
    }
    catch (error) {
      throw error;
    }
  } 

  logout() {
    return this.auth.signOut();
  }

  getMemberId() {
    if(this.auth.currentUser) {
      return this.auth.currentUser.uid;
    }
    else {
      return 'fake-member-id';
    }
  }
}
