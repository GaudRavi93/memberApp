import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Auth, authState } from '@angular/fire/auth';
import { Subscription } from 'rxjs';
import { ChannelService, ChatClientService, StreamI18nService } from 'stream-chat-angular';


@Injectable({
  providedIn: 'root'
})
export class ChatService {
  authState$ = authState(this.auth);
  authStateSubscription?: Subscription;
  pushToken?: string;

  constructor(
    private chatClientService: ChatClientService,
    private channelService: ChannelService,
    private streamI18nService: StreamI18nService,
    private http: HttpClient,
    private auth: Auth
  ) {
    // When the user signs in, connect to Stream Chat
    this.authStateSubscription = this.authState$.subscribe((user) => {
      if (user) {
        this.connectStreamUser(user.uid);
        if(this.pushToken){
          this.chatClientService.chatClient.addDevice(
            this.pushToken,
            'firebase',
            user.uid
          );
        }
      }
    });

    this.streamI18nService.setTranslation();

  }


  setPushToken(token: string) {
    this.pushToken = token;
  }

  async connectStreamUser(userId: string): Promise<void> {
    try {
      // Get the ID token of the currently signed-in user
      const user = await this.auth.currentUser;

      // If no user is signed in, throw an error
      if (!user) {
        console.error('No user signed in');
        throw new Error('No user signed in');
      }

      // Verify the user's ID is the same as the one passed to the function
      if (user.uid !== userId) {
        console.error('User ID does not match');
        throw new Error('User ID does not match');
      }

      // Get the ID token of the currently signed-in user
      const idToken = await user.getIdToken();

      // Send a request to your function with the ID token in the Authorization header
      this.http.get(
        '/getStreamUserToken',
        {
          headers: {
            Authorization: `Bearer ${idToken}`
          }
        }
      )
      // Get the Stream Chat user token from the response and initialize the Stream Chat client
      .subscribe((token) => this.chatClientService.init(
        'r544ka9bdcjp',
        userId,
        token.toString()
      )
      // Log a message when the Stream Chat client is initialized
      .then(() => {
        console.debug('Stream Chat client initialized');
        this.channelService.init({
          type: 'messaging',
          members: { $in: [userId] },
        });
      })
    );
    // Log an error if the Stream Chat client fails to initialize
    } catch (error) {
      console.error('Error getting Stream user token:', error);
      throw error;
    }
  }

  getChannels() {
    return this.channelService.channels$;
  }
}