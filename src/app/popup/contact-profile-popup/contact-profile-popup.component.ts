import { Component, EventEmitter, Input, NgZone, Output } from '@angular/core';
import { User } from '../../shared/models/user.model';
import { UserService } from '../../shared/services/user.service';
import { BehaviorSubject } from 'rxjs';
import { FirebaseService } from '../../shared/services/firebase.service';
import { AsyncPipe, NgClass, NgIf } from '@angular/common';

@Component({
  selector: 'app-contact-profile-popup',
  standalone: true,
  imports: [NgIf, NgClass],
  templateUrl: './contact-profile-popup.component.html',
  styleUrl: './contact-profile-popup.component.scss',
})
export class ContactProfilePopupComponent {
  @Output() closePopupEvent = new EventEmitter<void>();
  @Input() userData: User = new User();

  private unsubscribe?: () => void;
  currentUser: UserService;
  // currentUserData$ = new BehaviorSubject<any>(null);

  constructor(
    public service: FirebaseService,
    private user: UserService,
    private ngZone: NgZone
  ) {
    this.currentUser = user;
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
}
