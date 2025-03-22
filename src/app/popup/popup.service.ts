import { Injectable } from '@angular/core';
import { User } from '../shared/models/user.model';
import { CreateChannelPopupComponent } from './create-channel-popup/create-channel-popup.component';
import { MemberListPopupComponent } from './member-list-popup/member-list-popup.component';
import { Channel } from '../shared/models/channel.model';
import { MessageInputComponent } from '../main-page/chat/message-input/message-input.component';
import { ChannelDetailsPopupComponent } from './channel-details-popup/channel-details-popup.component';

@Injectable({
  providedIn: 'root',
})
export class PopupService {
  editChannelName = false;
  editChannelDescription = false;
  channelNameInputTooLong: boolean = false;
  channelNameExistsError: boolean = false;

  showAddMembersPopup = false;

  createChannelPopupOpen: boolean = false;

  memberListPopupOpen: boolean = false;
  mobileMemberListPopupOpen: boolean = false;
  showCreateChannelAddPeoplePopup = false;
  showCreateChannelAddPeopleInput = false;
  createChannelPopupChannel: Channel = new Channel();

  openUserProfilePopup = false;
  editingUserProfile = false;
  toggleAvatarSelection = false;

  contactProfileContent: User = new User();
  contactProfilePopupOpen = false;

  profileMenuPopupOpen: boolean = false;

  addUserToChannelPopup = false;

  channelDetailsPopupOpen: boolean = false;

  createChannelPopupComponent!: CreateChannelPopupComponent;
  channelDetailsPopupComponent!: ChannelDetailsPopupComponent;
  memberListPopup!: MemberListPopupComponent;

  // Statt einer einzelnen Referenz verwenden wir ein Array
  messageInputComponents: MessageInputComponent[] = [];

  showCreateChannelPopupErrorText = false;

  closeUserPopup() {
    // Schließe das Popup für alle registrierten MessageInputComponents
    this.messageInputComponents.forEach((component) => {
      component.showUserPopup = false;
      component.allUserIds = [];
    });
  }

  // Neue Methode zum Registrieren einer MessageInputComponent
  registerMessageInputComponent(component: MessageInputComponent) {
    if (!this.messageInputComponents.includes(component)) {
      this.messageInputComponents.push(component);
    }
  }

  // Neue Methode zum Entfernen einer MessageInputComponent
  unregisterMessageInputComponent(component: MessageInputComponent) {
    const index = this.messageInputComponents.indexOf(component);
    if (index !== -1) {
      this.messageInputComponents.splice(index, 1);
    }
  }

  // Neue Methode zum Fokussieren der Haupt-MessageInputComponent (wo isReplyInput false ist)
  focusMainMessageInput() {
    const mainComponent = this.messageInputComponents.find(
      (component) => !component.isReplyInput
    );
    if (mainComponent && mainComponent.chatInput) {
      mainComponent.chatInput.nativeElement.focus();
    }
  }

  // Neue Methode zum Fokussieren der Antwort-MessageInputComponent (wo isReplyInput true ist)
  focusReplyMessageInput() {
    const replyComponent = this.messageInputComponents.find(
      (component) => component.isReplyInput
    );
    if (replyComponent && replyComponent.replyInput) {
      replyComponent.replyInput.nativeElement.focus();
    }
  }

  resetEditStates() {
    if (this.createChannelPopupComponent) {
      this.createChannelPopupComponent.channel.name = '';
      this.createChannelPopupComponent.channel.description = '';
      this.createChannelPopupComponent.channel.users = [];
    }

    if (this.channelDetailsPopupComponent) {
      this.channelDetailsPopupComponent.channelNameInput = '';
      this.channelDetailsPopupComponent.channelDescriptionInput = '';
    }

    this.showCreateChannelPopupErrorText = false;

    this.editChannelName = false;
    this.editChannelDescription = false;
    this.editingUserProfile = false;
    this.toggleAvatarSelection = false;
    this.showAddMembersPopup = false;

    this.channelNameInputTooLong = false;
    this.channelNameExistsError = false;
  }
}
