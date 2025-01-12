import { NgClass } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { User } from '../../shared/models/user.model';
import { UserService } from '../../shared/services/user.service';


@Component({
  selector: 'app-sidebar-nav',
  standalone: true,
  imports: [NgClass],
  templateUrl: './sidebar-nav.component.html',
  styleUrl: './sidebar-nav.component.scss',
})
export class SidebarNavComponent {
  showChannels = true;
  showContacts = true;
  showUser = false;
  @Output() showUserChange = new EventEmitter<User | null>();

  constructor(public user: UserService) {
  }

  toggleChannels() {
    this.showChannels = !this.showChannels;
  }

  toggleContacts() {
    this.showContacts = !this.showContacts;
  }

  openDialog(user: User) {
    this.showUserChange.emit(user); 
  }
}
