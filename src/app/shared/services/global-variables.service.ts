import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class GlobalVariablesService {
  // Signal, das den mobilen Zustand speichert
  isMobile = signal(window.innerWidth < 768);

  constructor() {
    // Initialen Zustand setzen
    this.updateIsMobile();

    // Event-Listener hinzufügen, um das Signal bei Fenstergrößenänderung zu aktualisieren
    window.addEventListener('resize', () => this.updateIsMobile());
  }

  private updateIsMobile() {
    this.isMobile.set(window.innerWidth < 768);
    console.log(this.isMobile());
  }
}
