import { NgClass, NgIf } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CreateChannelPopupComponent } from './create-channel-popup/create-channel-popup.component';
import { ChannelDetailsPopupComponent } from './channel-details-popup/channel-details-popup.component';
import { MemberListPopupComponent } from './member-list-popup/member-list-popup.component';
import { PopupService } from './popup.service';
import { UserProfilePopupComponent } from './user-profile-popup/user-profile-popup.component';
import { ProfileMenuPopupComponent } from './profile-menu-popup/profile-menu-popup.component';
import { ContactProfilePopupComponent } from './contact-profile-popup/contact-profile-popup.component';
import { AddUserToChannelPopupComponent } from './add-user-to-channel-popup/add-user-to-channel-popup.component';

@Component({
  selector: 'app-popup',
  standalone: true,
  imports: [
    NgClass,
    NgIf,
    CreateChannelPopupComponent,
    ChannelDetailsPopupComponent,
    MemberListPopupComponent,
    UserProfilePopupComponent,
    ProfileMenuPopupComponent,
    ContactProfilePopupComponent,
    AddUserToChannelPopupComponent,
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
