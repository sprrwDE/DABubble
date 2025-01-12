import { Component, Output, EventEmitter, Input, OnDestroy, OnInit, NgZone } from '@angular/core';
import { User } from '../../shared/models/user.model';
import { FirebaseService } from '../../shared/services/firebase.service';
import { UserService } from '../../shared/services/user.service';
import { CommonModule } from '@angular/common';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-single-user',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './single-user.component.html',
  styleUrls: ['./single-user.component.scss']
})
export class SingleUserComponent implements OnInit, OnDestroy {
  @Output() closeEvent = new EventEmitter<void>();
  @Input() userData!: User;

  private unsubscribe?: () => void; 
  currentUser: UserService
  currentUserData$ = new BehaviorSubject<any>(null); 

  constructor(public service: FirebaseService, private user: UserService, private ngZone: NgZone) {
    this.currentUser = user;
  }

  ngOnInit() {
    console.log('User Data:', this.userData);
    this.user.updateStatus(this.userData.id)

    this.unsubscribe = this.service.subscribeToSingleDoc('users', this.userData.id, (data) => {
      this.ngZone.run(() => {
        this.currentUserData$.next(data); 
      });
    });
  }

  ngOnDestroy() {
    if (this.unsubscribe) {
      this.unsubscribe();
    }
  }

  closeDialog() {
    this.closeEvent.emit();
  }
}
