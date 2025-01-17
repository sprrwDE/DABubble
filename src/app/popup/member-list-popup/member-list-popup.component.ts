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
import { UserService } from '../../shared/services/user.service';

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
  userIds: string[] = [];

  constructor(
    public popupService: PopupService,
    private channelService: ChannelService,
    private userService: UserService
  ) {}

  get allUsers() {
    return this.userService.allUsers;
  }

  get showAddMembersPopup() {
    return this.popupService.showAddMembersPopup;
  }

  set showAddMembersPopup(value: boolean) {
    this.popupService.showAddMembersPopup = value;
  }

  get currentChannelId() {
    return this.channelService.currentChannelId;
  }

  get loggedInUser() {
    return this.userService.loggedInUser;
  }

  ngOnInit() {
    this.subscription = this.channelService.getChannel().subscribe((data) => {
      if (data) {
        this.channelData = data;
        this.userIds = this.channelData.users;

        this.userList = this.allUsers.filter((user) =>
          this.userIds.includes(user.id)
        );
      }
    });

    this.channelService.fetchChannel(this.currentChannelId);
  }

  openContactProfile(user: User) {
    this.popupService.contactProfileContent = user;
    this.popupService.contactProfilePopupOpen = true;
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
    this.channelService.unsubscribeChannel();
  }

  closePopup() {
    this.closePopupEvent.emit();
  }

  showAddMembersSection(event: Event) {
    event.stopPropagation();
    this.showAddMembersPopup = true;
  }
}
