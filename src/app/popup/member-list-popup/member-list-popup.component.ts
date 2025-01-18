
import { NgIf, NgClass } from '@angular/common';
import {
  Component,
  EventEmitter,
  Output,
  OnInit,
  OnDestroy,
} from '@angular/core';
import { PopupService } from '../popup.service';
import { ChannelService } from '../../shared/services/channel.service';
import { Channel } from '../../shared/models/channel.model';
import { User } from '../../shared/models/user.model';
import { Subscription } from 'rxjs';
import { AddMemberPopupComponent } from './add-member-popup/add-member-popup.component';

@Component({
  selector: 'app-member-list-popup',
  standalone: true,
  imports: [NgIf, NgClass, AddMemberPopupComponent],
  templateUrl: './member-list-popup.component.html',
  styleUrl: './member-list-popup.component.scss',
})
export class MemberListPopupComponent implements OnInit, OnDestroy {
  @Output() closePopupEvent = new EventEmitter<void>();

  private subscription!: Subscription;
  channelData: Channel | null = null;
  userList: User[] = [];

  constructor(
    public popupService: PopupService,
    private channelService: ChannelService
  ) {}

  ngOnInit() {
    this.subscription = this.channelService.getChannel().subscribe((data) => {
      if (data) {
        this.channelData = data;
        this.userList = data.users;
        console.log('User Liste in Channel:', this.userList);
      }
    });

    this.channelService.fetchChannel('Ks8hNpn38fEiwcDmRxOB');
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
    this.channelService.unsubscribeChannel(); 
  }


  get showAddMembersPopup() {
    console.log(this.popupService.showAddMembersPopup);
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
