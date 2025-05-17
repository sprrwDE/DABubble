import { effect, Injectable, signal } from '@angular/core';
import { ChannelService } from './channel.service';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root',
})
export class GlobalVariablesService {
  // Signal, das den mobilen Zustand speichert
  isMobile = signal(window.innerWidth < 768);
  isTablet = signal(window.innerWidth < 1280);
  loading = false;

  constructor(
    private channelService: ChannelService,
    private userService: UserService
  ) {
    // Initialen Zustand setzen
    this.updateIsMobile();
    this.updateIsTablet();

    // Event-Listener hinzufügen, um das Signal bei Fenstergrößenänderung zu aktualisieren
    window.addEventListener('resize', () => this.updateIsMobile());
    window.addEventListener('resize', () => this.updateIsTablet());

    effect(() => {
      this.loading = this.userService.loadingData();
    });
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

  setLoading(status: boolean) {
    this.loading = status;
  }
}
