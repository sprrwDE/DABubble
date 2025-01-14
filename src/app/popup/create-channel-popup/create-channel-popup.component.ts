import { Component, EventEmitter, Output } from '@angular/core';
import { NgClass, NgIf } from '@angular/common';

@Component({
  selector: 'app-create-channel-popup',
  standalone: true,
  imports: [NgClass, NgIf],
  templateUrl: './create-channel-popup.component.html',
  styleUrl: './create-channel-popup.component.scss',
})
export class CreateChannelPopupComponent {
  @Output() closePopupEvent = new EventEmitter<void>();

  closePopup() {
    this.closePopupEvent.emit();
  }
}
