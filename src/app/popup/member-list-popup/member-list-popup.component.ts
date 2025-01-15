import { NgIf } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { PopupService } from '../popup.service';

@Component({
  selector: 'app-member-list-popup',
  standalone: true,
  imports: [NgIf],
  templateUrl: './member-list-popup.component.html',
  styleUrl: './member-list-popup.component.scss',
})
export class MemberListPopupComponent {
  @Output() closePopupEvent = new EventEmitter<void>();

  constructor(public popupService: PopupService) {}

  get showAddMembersPopup() {
    return this.popupService.showAddMembersPopup;
  }

  set showAddMembersPopup(value: boolean) {
    this.popupService.showAddMembersPopup = value;
  }

  closePopup(event: Event) {
    event.stopPropagation();
    this.closePopupEvent.emit();
  }

  showAddMembersSection(event: Event) {
    event.stopPropagation();
    this.showAddMembersPopup = true;
  }
}
