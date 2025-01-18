import { inject, Injectable } from '@angular/core';
import { FirebaseService } from '../../shared/services/firebase.service';
import { Channel } from '../models/channel.model';
import { BehaviorSubject, Observable } from 'rxjs';
import { NgZone } from '@angular/core';
import {
  Firestore,
  addDoc,
  collection,
  doc,
  onSnapshot,
  updateDoc,
} from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root',
})
@Injectable({
  providedIn: 'root',
})
export class ChannelService {
  firestore = inject(Firestore);
  unsubAllChannels: any;

  allChannels: any[] = [];
  currentChannelId: string = '';
  currentChannel: any;

  currentChannelIdIsInitialized = false;

  ngOnDestroy(): void {
    this.unsubAllChannels();
  }

  constructor(
    public fb: FirebaseService,
    private ngZone: NgZone // public firestore: Firestore
  ) {
    this.getAllChannels();
  }

  getAllChannels() {
    try {
      this.unsubAllChannels = onSnapshot(
        collection(this.firestore, 'channels'),
        (items) => {
          this.allChannels = [];

          items.forEach((item) => {
            this.allChannels.push({ ...item.data(), id: item.id });
          });

          console.log(this.allChannels);

          if (!this.currentChannelIdIsInitialized) {
            this.currentChannelId = this.allChannels[0].id;
            this.currentChannelIdIsInitialized = true;
          }

          this.currentChannel = this.allChannels.find(
            (channel) => channel.id === this.currentChannelId
          );
        }
      );
    } catch (error) {
      console.error('Error fetching channels:', error);
    }
  }

  async addChannel(data: any) {
    try {
      const docRef = await addDoc(collection(this.firestore, 'channels'), data);
    } catch (error) {
      console.error('Fehler beim Erstellen des Benutzers: ', error);
    }
  }

  async sendMessage(data: any) {
    try {
      const channelRef = doc(this.firestore, 'channels', this.currentChannelId);
      await updateDoc(channelRef, {
        messages: [data, ...(this.currentChannel?.messages || [])],
      });
    } catch (error) {
      console.error('Fehler beim Erstellen der Nachricht:', error);
    }
  }

  // ///////////////////
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

    this.unsubscribe = this.fb.subscribeToSingleDoc(
      'channels',
      channelId,
      (data) => {
        this.ngZone.run(() => {
          this.currentChannelData$.next(new Channel(data));
        });
      }
    );
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
