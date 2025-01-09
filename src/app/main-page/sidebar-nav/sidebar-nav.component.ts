import { NgClass } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { SingleUserComponent } from "../single-user/single-user.component";

@Component({
  selector: 'app-sidebar-nav',
  standalone: true,
  imports: [NgClass, SingleUserComponent],
  templateUrl: './sidebar-nav.component.html',
  styleUrl: './sidebar-nav.component.scss',
})
export class SidebarNavComponent {
  showChannels = true;
  showContacts = true;
  showUser = false;
  @Output() showUserChange = new EventEmitter<boolean>();

  toggleChannels() {
    this.showChannels = !this.showChannels;
  }

  toggleContacts() {
    this.showContacts = !this.showContacts;
  }

  openDialog() {
    this.showUserChange.emit(true); 
  }
}
