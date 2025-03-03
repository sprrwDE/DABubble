import { Component, effect } from '@angular/core';
import { PopupService } from '../popup.service';
import { NgIf } from '@angular/common';
import { User } from '../../shared/models/user.model';
import { UserService } from '../../shared/services/user.service';
import { Subscription } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { FirebaseService } from '../../shared/services/firebase.service';
import { NgClass } from '@angular/common';
import { GlobalVariablesService } from '../../shared/services/global-variables.service';

@Component({
  selector: 'app-user-profile-popup',
  standalone: true,
  imports: [NgIf, FormsModule, NgClass],
  templateUrl: './user-profile-popup.component.html',
  styleUrl: './user-profile-popup.component.scss',
})
export class UserProfilePopupComponent {
  public loggedInUserData: User = new User();

  unsubscribeLoggedInUser!: Subscription;

  nameInput: string = '';

  avatarInput: string = '';
  toggleAvatarSelection: boolean = false;
  avatars: { url: string; selected: boolean }[] = [
    { url: 'imgs/avatar/1av.svg', selected: false },
    { url: 'imgs/avatar/2av.svg', selected: false },
    { url: 'imgs/avatar/3av.svg', selected: false },
    { url: 'imgs/avatar/4av.svg', selected: false },
    { url: 'imgs/avatar/5av.svg', selected: false },
    { url: 'imgs/avatar/6av.svg', selected: false },
  ];

  constructor(
    public popupService: PopupService,
    private userService: UserService,
    private firebaseService: FirebaseService,
    public globalVariablesService: GlobalVariablesService
  ) {
    effect(() => {
      const user = this.userService.loggedInUser();
      if (user) this.loggedInUserData = user;
    });
  }

  get editingUserProfile() {
    return this.popupService.editingUserProfile;
  }

  set editingUserProfile(value: boolean) {
    this.popupService.editingUserProfile = value;
  }

  closePopup() {
    this.discardChanges();
    this.popupService.toggleAvatarSelection = false;
    this.popupService.openUserProfilePopup = false;
  }

  returnUserData(property: keyof User, fallbackValue: string = 'lädt...') {
    if (
      !this.loggedInUserData?.[property] ||
      this.loggedInUserData[property] === '' ||
      this.loggedInUserData[property] === undefined ||
      this.loggedInUserData[property] === null
    ) {
      if (property === 'image') return 'imgs/avatar/profile.svg';
      return fallbackValue;
    }
    return this.loggedInUserData[property];
  }

  private resetAvatarSelection(): void {
    this.avatars.forEach((avatar) => (avatar.selected = false));
    this.popupService.toggleAvatarSelection = false;
  }

  private updateUserName(updates: Partial<User>): void {
    if (this.nameInput.trim() !== '') {
      updates.name = this.nameInput.trim();
      this.firebaseService.updateUserName(
        this.loggedInUserData.id,
        updates.name
      );
    }
  }

  private updateProfileImage(updates: Partial<User>): void {
    if (this.avatarInput !== '') {
      updates.image = this.avatarInput;
      this.firebaseService.changeProfileImage(
        this.loggedInUserData.id,
        updates.image
      );
    }
  }

  private updateUserService(updates: Partial<User>): void {
    if (Object.keys(updates).length > 0) {
      this.userService.updateLoggedInUser(updates);
      this.popupService.editingUserProfile = false;
    }
  }

  public pushData(): void {
    this.resetAvatarSelection();
    const updates: Partial<User> = {};

    this.updateUserName(updates);
    this.updateProfileImage(updates);
    this.updateUserService(updates);
  }

  showEditProfilePicPopup() {
    this.popupService.toggleAvatarSelection =
      !this.popupService.toggleAvatarSelection;
  }

  selectAvatar(i: number) {
    this.avatars.forEach((avatar) => (avatar.selected = false));
    this.avatarInput = this.avatars[i].url;
    this.avatars[i].selected = true;
  }

  discardChanges() {
    this.nameInput = this.loggedInUserData.name;
    this.avatarInput = this.loggedInUserData.image;
    this.toggleAvatarSelection = false;
    this.avatars.forEach((avatar) => (avatar.selected = false));
  }
}
