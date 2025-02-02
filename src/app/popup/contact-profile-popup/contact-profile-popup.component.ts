import {
  Component,
  effect,
  EventEmitter,
  Input,
  NgZone,
  Output,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { User } from '../../shared/models/user.model';
import { UserService } from '../../shared/services/user.service';
import { BehaviorSubject } from 'rxjs';
import { FirebaseService } from '../../shared/services/firebase.service';
import { AsyncPipe, NgClass, NgIf } from '@angular/common';
import { PopupService } from '../popup.service';
import { DirectChatService } from '../../shared/services/direct-chat.service';
import { DirectChat } from '../../shared/models/direct-chat.model';
import { Channel } from '../../shared/models/channel.model';
import { ChannelService } from '../../shared/services/channel.service';

@Component({
  selector: 'app-contact-profile-popup',
  standalone: true,
  imports: [NgIf, NgClass],
  templateUrl: './contact-profile-popup.component.html',
  styleUrl: './contact-profile-popup.component.scss',
})
export class ContactProfilePopupComponent {
  @Output() closePopupEvent = new EventEmitter<void>();
  @ViewChild('allUsersContainer') allUsersContainer!: ElementRef;

  private unsubscribe?: () => void;
  currentUser: UserService;
  // currentUserData$ = new BehaviorSubject<any>(null);

  loggedInUser: any;

  constructor(
    public service: FirebaseService,
    private user: UserService,
    private ngZone: NgZone,
    private popupService: PopupService,
    private directChatService: DirectChatService,
    private userService: UserService,
    private channelService: ChannelService
  ) {
    this.currentUser = user;

    effect(() => {
      this.loggedInUser = this.userService.loggedInUser();
    });
  }

  get contactProfileContent() {
    return this.popupService.contactProfileContent;
  }

  // ngOnInit() {
  //   console.log('User Data:', this.userData);

  //   this.user.updateStatus(this.userData.id);

  //   this.unsubscribe = this.service.subscribeToSingleDoc(
  //     'users',
  //     this.userData.id,
  //     (data) => {
  //       this.ngZone.run(() => {
  //         this.currentUserData$.next(data);
  //       });
  //     }
  //   );
  // }

  // ngOnDestroy() {
  //   if (this.unsubscribe) {
  //     this.unsubscribe();
  //   }
  // }

  closePopup() {
    this.closePopupEvent.emit();
  }

  setCurrentDirectChat(user: User) {
    this.channelService.chatComponent.scroll = true;
    this.channelService.currentChannel.set(new Channel());

    const directChat = this.directChatService.allDirectChats.find(
      (directChat) => {
        if (
          directChat.userIds.includes(user.id) &&
          directChat.userIds.includes(this.loggedInUser.id)
        ) {
          this.directChatService.currentDirectChat.set(directChat);
          return true;
        }
        return false;
      }
    );

    if (!directChat) {
      this.directChatService.currentDirectChat.set(new DirectChat());
    }

    this.directChatService.currentDirectChatUser.set(user);
    this.directChatService.isDirectChat = true;

    this.closePopup();

    this.popupService.memberListPopup.closePopup();

    // Scroll zum ausgewählten Benutzer in der Sidebar
    setTimeout(() => {
      const sidebarContainer = document.querySelector('#all-users');
      const activeElement = sidebarContainer?.querySelector('.active-contact');
      if (activeElement) {
        activeElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }, 100);
  }
}
