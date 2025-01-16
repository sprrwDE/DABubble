import { Injectable } from '@angular/core';
import { FirebaseService } from '../../shared/services/firebase.service';
import { Channel } from '../models/channel.model';
import { BehaviorSubject, Observable } from 'rxjs';
import { NgZone } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ChannelService {
  private currentChannelData$ = new BehaviorSubject<Channel | null>(null);
  private unsubscribe?: () => void;

  constructor(private fb: FirebaseService, private ngZone: NgZone) {}

  fetchChannel(channelId: string): void {
    if (this.unsubscribe) {
      this.unsubscribe(); 
    }

    this.unsubscribe = this.fb.subscribeToSingleDoc('channels', channelId, (data) => {
      this.ngZone.run(() => {
        this.currentChannelData$.next(new Channel(data));
      });
    });
  }

  getChannel(): Observable<Channel | null> {
    return this.currentChannelData$.asObservable();
  }

  unsubscribeChannel(): void {
    if (this.unsubscribe) {
      this.unsubscribe();
      this.unsubscribe = undefined;
    }
  }
}
