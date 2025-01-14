import { NgClass, NgIf } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CreateChannelPopupComponent } from './create-channel-popup/create-channel-popup.component';
import { ChannelDetailsPopupComponent } from './channel-details-popup/channel-details-popup.component';
import { ChannelDetailsService } from '../shared/services/channel-details.service';

@Component({
  selector: 'app-popup',
  standalone: true,
  imports: [
    NgClass,
    NgIf,
    CreateChannelPopupComponent,
    ChannelDetailsPopupComponent,
  ],
  templateUrl: './popup.component.html',
  styleUrl: './popup.component.scss',
})
export class PopupComponent {
  @Input() popupCorner: string = '';
  @Input() popupOpen: boolean = false;
  @Input() popupType: string = '';

  @Output() closePopupEvent = new EventEmitter<void>();

  constructor(public channelDetailsService: ChannelDetailsService) {}

  closePopup() {
    this.channelDetailsService.resetEditStates();
    this.closePopupEvent.emit();
  }
}
