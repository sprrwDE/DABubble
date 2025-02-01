import { Component, effect } from '@angular/core';
import { PopupService } from '../popup.service';
import { NgIf } from '@angular/common';
import { User } from '../../shared/models/user.model';
import { UserService } from '../../shared/services/user.service';
import { Subscription } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { FirebaseService } from '../../shared/services/firebase.service';

@Component({
  selector: 'app-user-profile-popup',
  standalone: true,
  imports: [NgIf, FormsModule],
  templateUrl: './user-profile-popup.component.html',
  styleUrl: './user-profile-popup.component.scss',
})
export class UserProfilePopupComponent {
  public loggedInUserData: User = new User();

  unsubscribeLoggedInUser!: Subscription;

  nameInput: string = '';

  avatarInput: string = '';
  toggleAvatarSelection: boolean = false;
  avatars: string[] = [
    'imgs/avatar/1av.svg',
    'imgs/avatar/2av.svg',
    'imgs/avatar/3av.svg',
    'imgs/avatar/4av.svg',
    'imgs/avatar/5av.svg',
    'imgs/avatar/6av.svg',
  ]

  constructor(
    private popupService: PopupService,
    private userService: UserService,
    private firebaseService: FirebaseService
  ) {
    effect(() => {
      const user = this.userService.loggedInUser();
      if (user) {
        this.loggedInUserData = user; 
      }
    });
  }

  get editingUserProfile() {
    return this.popupService.editingUserProfile;
  }

  set editingUserProfile(value: boolean) {
    this.popupService.editingUserProfile = value;
  }

  closePopup() {
    this.discardChanges()
    this.popupService.openUserProfilePopup = false;
  }

  returnUserData(property: keyof User, fallbackValue: string = 'lädt...') {
    if (
      !this.loggedInUserData?.[property] ||
      this.loggedInUserData[property] === '' ||
      this.loggedInUserData[property] === undefined ||
      this.loggedInUserData[property] === null
    ) {
      if (property === 'image') {
        return 'imgs/avatar/profile.svg';
      }
      return fallbackValue;
    }
    return this.loggedInUserData[property];
  }

  pushData() {
    if (this.nameInput.trim() != '') {
      this.editingUserProfile = false;
      this.firebaseService.updateUserName(
        this.loggedInUserData.id,
        this.nameInput.trim()
      );
    } if(this.avatarInput != '') {
      this.firebaseService.changeProfileImage(this.loggedInUserData.id, this.avatarInput)
    }
    else {
      return;
    }
  }

  showEditProfilePicPopup() {
    console.log('open')
    this.toggleAvatarSelection = true
  }

  selectAvatar(avatar: string) {
    console.log(avatar)
    this.avatarInput = avatar
  }

  discardChanges() {
    this.nameInput = this.loggedInUserData.name;
    this.avatarInput = this.loggedInUserData.image;
    this.toggleAvatarSelection = false;
  }
}
