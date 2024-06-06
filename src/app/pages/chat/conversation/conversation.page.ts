import { Component, OnInit } from '@angular/core';
import { ChannelService } from 'stream-chat-angular';

@Component({
  selector: 'app-conversation',
  templateUrl: './conversation.page.html',
  styleUrls: ['./conversation.page.scss'],
})
export class ConversationPage implements OnInit {
  channelDetails: any;

  constructor(
    private channelService: ChannelService,
  ) { }

  ngOnInit() {
    this.channelService.activeChannel$.subscribe(response => {
      this.channelDetails = {
        name: response?.data?.name,
        image: response?.data?.image,
      };
    });
  }
}