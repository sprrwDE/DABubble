import { Injectable } from '@angular/core';
import { Channel } from '../models/channel.model';

@Injectable({
  providedIn: 'root'
})
export class ChannelService {
  constructor(public channel: Channel) { 
  }

}
