import { NgClass, NgIf } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { ChannelDetailsService } from '../../shared/services/channel-details.service';

@Component({
  selector: 'app-channel-details-popup',
  standalone: true,
  imports: [NgClass, NgIf],
  templateUrl: './channel-details-popup.component.html',
  styleUrl: './channel-details-popup.component.scss',
})
export class ChannelDetailsPopupComponent {
  @Output() closePopupEvent = new EventEmitter<void>();

  constructor(public channelDetailsService: ChannelDetailsService) {}

  get editChannelName() {
    return this.channelDetailsService.editChannelName;
  }

  set editChannelName(value: boolean) {
    this.channelDetailsService.editChannelName = value;
  }

  get editChannelDescription() {
    return this.channelDetailsService.editChannelDescription;
  }

  set editChannelDescription(value: boolean) {
    this.channelDetailsService.editChannelDescription = value;
  }

  closePopup() {
    this.channelDetailsService.resetEditStates();

    console.log(this.editChannelName, this.editChannelDescription);

    this.closePopupEvent.emit();
  }
}
