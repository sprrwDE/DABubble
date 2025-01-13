import { NgClass, NgIf } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CreateChannelPopupComponent } from './create-channel-popup/create-channel-popup.component';

@Component({
  selector: 'app-popup',
  standalone: true,
  imports: [NgClass, CreateChannelPopupComponent, NgIf],
  templateUrl: './popup.component.html',
  styleUrl: './popup.component.scss',
})
export class PopupComponent {
  @Input() centerPopup: boolean = false;
  @Input() popupCorner: string = '';
  @Input() popupOpen: boolean = false;
  @Input() popupType: string = '';

  @Output() closePopupEvent = new EventEmitter<void>();

  closePopup() {
    this.closePopupEvent.emit();
  }

  constructor() {}
}
