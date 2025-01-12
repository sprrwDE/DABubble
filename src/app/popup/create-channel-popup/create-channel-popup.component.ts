import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-create-channel-popup',
  standalone: true,
  imports: [],
  templateUrl: './create-channel-popup.component.html',
  styleUrl: './create-channel-popup.component.scss',
})
export class CreateChannelPopupComponent {
  @Output() closePopupEvent = new EventEmitter<void>();

  closePopup() {
    this.closePopupEvent.emit();
  }
}
