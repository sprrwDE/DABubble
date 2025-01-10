import { NgClass } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { FirebaseService } from '../../shared/services/firebase.service';
import { User } from '../../shared/models/user.model';
import { Observable } from 'rxjs';


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
  allUsers: User[] = [];
  fetchedCollection$: Observable<any>
  @Output() showUserChange = new EventEmitter<User | null>();

  constructor(private service: FirebaseService) {
    this.fetchedCollection$ = service.fetchedCollection$;
    this.service.getData('users')
  }

  ngOnInit() {
    this.fetchedCollection$.subscribe((data) => {
      this.allUsers = data.map(
        (rawData:any) =>
          new User({
            ...rawData,
          })
      );
    });
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
