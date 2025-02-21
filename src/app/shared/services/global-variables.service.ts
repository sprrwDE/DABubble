import { Injectable, signal } from '@angular/core';
import { ChannelService } from './channel.service';

@Injectable({
  providedIn: 'root',
})
export class GlobalVariablesService {
  // Signal, das den mobilen Zustand speichert
  isMobile = signal(window.innerWidth < 768);
  isTablet = signal(window.innerWidth < 1280);

  constructor(private channelService: ChannelService) {
    // Initialen Zustand setzen
    this.updateIsMobile();
    this.updateIsTablet();

    // Event-Listener hinzufügen, um das Signal bei Fenstergrößenänderung zu aktualisieren
    window.addEventListener('resize', () => this.updateIsMobile());
    window.addEventListener('resize', () => this.updateIsTablet());
  }

  private updateIsMobile() {
    this.isMobile.set(window.innerWidth < 768);
    console.log(this.isMobile());
  }

  private updateIsTablet() {
    this.isTablet.set(window.innerWidth < 1280);
    console.log(this.isTablet(), 'tablet');
  }
}
