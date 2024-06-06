import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ChatService } from 'src/app/services/chat.service';
import { Channel } from 'stream-chat';
import { ChannelService, DefaultStreamChatGenerics } from 'stream-chat-angular';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
})
export class ChatPage implements OnInit {
  channel_list: any = [];
  isLoading: boolean = true;

  constructor(
    private router: Router,
    private chatService: ChatService,
    private channelService: ChannelService
  ) { }

  ngOnInit() {
    this.channel_list = [];
    this.chatService.getChannels().subscribe({
      next: (channels) => {
        this.channel_list = channels;
        this.isLoading = false;
      },
      error: (error) => {
        console.error(error);
        this.isLoading = false;
      }
    });
  }

  /** open selected channel */
  openChannel(channel: Channel<DefaultStreamChatGenerics>) {
    this.channelService.setAsActiveChannel(channel);
    this.router.navigate([`app/chat/conversation/${channel.id}`]);
  }
}