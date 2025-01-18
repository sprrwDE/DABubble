import { Injectable } from '@angular/core';
import { FirebaseService } from '../../shared/services/firebase.service';
import { Channel } from '../models/channel.model';
import { BehaviorSubject, Observable } from 'rxjs';
import { NgZone } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
@Injectable({
  providedIn: 'root'
})
export class ChannelService {
  private currentChannelData$ = new BehaviorSubject<Channel | null>(null);
  private unsubscribe?: () => void;
  fetchedChannelData$: Observable<any>;

  constructor(private fb: FirebaseService) {
    this.fetchedChannelData$ = this.fb.fetchedSingleData$;
  }

  // Hole Daten und speichere sie im BehaviorSubject
  fetchChannel(channelId: string): void {
    if (this.unsubscribe) {
      this.unsubscribe(); // Falls bereits eine Subscription besteht, beende sie.
    }

    this.unsubscribe = this.fb.subscribeToSingleDoc('channels', channelId, (data) => {
      this.currentChannelData$.next(new Channel(data)); // 🔥 Speichere die Daten in BehaviorSubject
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
