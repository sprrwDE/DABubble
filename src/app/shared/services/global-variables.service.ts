import { Injectable, signal } from '@angular/core';
import { ChannelService } from './channel.service';

@Injectable({
  providedIn: 'root',
})
export class GlobalVariablesService {
  // Signal, das den mobilen Zustand speichert
  isMobile = signal(window.innerWidth < 768);
  isTablet = signal(window.innerWidth < 1280);
  loading = false;

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
  }

  private updateIsTablet() {
    this.isTablet.set(window.innerWidth < 1280);
  }

  handleImageError(event: any) {
    event.target.src = 'imgs/avatar/profile.svg';
  }

  showLoadingScreen() {
    this.loading = true;
  }

  hideLoadingScreen() {
    this.loading = false;
  }
}
