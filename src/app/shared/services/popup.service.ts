import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class PopupService {
  constructor() {}

  popupOpen: boolean = false;

  openPopup() {
    this.popupOpen = true;
  }
}
