import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FirebaseService } from '../../shared/services/firebase.service';

@Component({
  selector: 'app-select-avatar',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './select-avatar.component.html',
  styleUrl: './select-avatar.component.scss',
})
export class SelectAvatarComponent implements OnInit {
  currentAvatar: string = 'imgs/avatar/profile.svg';
  @Output() notification = new EventEmitter<string>();

  avatars: string[] = [
    'imgs/avatar/1av.svg',
    'imgs/avatar/2av.svg',
    'imgs/avatar/3av.svg',
    'imgs/avatar/4av.svg',
    'imgs/avatar/5av.svg',
    'imgs/avatar/6av.svg',
  ];

  userId!: string;
  userName: any;

  constructor(
    private route: ActivatedRoute,
    private firebaseService: FirebaseService,
    private routerLink: Router
  ) {}

  ngOnInit(): void {
    this.userId = this.route.snapshot.paramMap.get('userId') || '';
    this.getUsersName();
  }

  selectAvatar(index: number) {
    this.currentAvatar = this.avatars[index];
  }

  async getUsersName() {
    const userName = await this.firebaseService.getSingleDoc(
      'users',
      this.userId
    );

    // Überprüfen, ob der Rückgabewert nicht null oder undefined ist
    if (userName && userName['name']) {
      this.userName = userName['name'];
    } else {
      console.warn(
        'Benutzer nicht gefunden oder keine Eigenschaft "name" vorhanden.'
      );
      this.userName = 'Unbekannt'; // Fallback-Wert
    }
  }

  confirmAvatar() {
    this.firebaseService.changeProfileImage(this.userId, this.currentAvatar);
    this.showNotification();
    setTimeout(() => {
      this.routerLink.navigate(['/login']);
    }, 2500);
  }

  showNotification() {
    this.notification.emit('Konto erfolgreich erstellt!');
  }
}
