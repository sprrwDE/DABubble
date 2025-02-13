import { Injectable, signal } from '@angular/core';
import { ChannelService } from './channel.service';

@Injectable({
  providedIn: 'root',
})
export class GlobalVariablesService {
  // Signal, das den mobilen Zustand speichert
  isMobile = signal(window.innerWidth < 768);

  constructor(private channelService: ChannelService) {
    // Initialen Zustand setzen
    this.updateIsMobile();

    // Event-Listener hinzufügen, um das Signal bei Fenstergrößenänderung zu aktualisieren
    window.addEventListener('resize', () => this.updateIsMobile());
  }

  private updateIsMobile() {
    this.isMobile.set(window.innerWidth < 768);
    console.log(this.isMobile());
    console.log(this.channelService.allChannels);
  }
}
