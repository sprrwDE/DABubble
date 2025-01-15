import { NgClass, NgIf } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CreateChannelPopupComponent } from './create-channel-popup/create-channel-popup.component';
import { ChannelDetailsPopupComponent } from './channel-details-popup/channel-details-popup.component';
import { MemberListPopupComponent } from './member-list-popup/member-list-popup.component';
import { PopupService } from './popup.service';

@Component({
  selector: 'app-popup',
  standalone: true,
  imports: [
    NgClass,
    NgIf,
    CreateChannelPopupComponent,
    ChannelDetailsPopupComponent,
    MemberListPopupComponent,
  ],
  templateUrl: './popup.component.html',
  styleUrl: './popup.component.scss',
})
export class PopupComponent {
  @Input() popupCorner: string = '';
  @Input() popupOpen: boolean = false;
  @Input() popupType: string = '';

  @Output() closePopupEvent = new EventEmitter<void>();

  constructor(public popupService: PopupService) {}

  closePopup() {
    this.popupService.resetEditStates();
    this.closePopupEvent.emit();
  }
}
