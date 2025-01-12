import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FirebaseService } from '../../shared/services/firebase.service';


@Component({
  selector: 'app-select-avatar',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './select-avatar.component.html',
  styleUrl: './select-avatar.component.scss'
})
export class SelectAvatarComponent implements OnInit {
  currentAvatar: string = 'imgs/avatar/profile.svg'
  @Output() notification = new EventEmitter<string>();

  avatars: string[] = [
    'imgs/avatar/1av.svg',
    'imgs/avatar/2av.svg',
    'imgs/avatar/3av.svg',
    'imgs/avatar/4av.svg',
    'imgs/avatar/5av.svg',
    'imgs/avatar/6av.svg',
  ]

  userId!: string;

  constructor(private route: ActivatedRoute, private firebaseService: FirebaseService, private routerLink: Router) {

  }
  ngOnInit(): void {
    this.userId = this.route.snapshot.paramMap.get('userId') || '';
    console.log('empfagne user id: ', this.userId)
  }

  selectAvatar(index: number) {
    this.currentAvatar = this.avatars[index]

  }

  confirmAvatar() {
    this.firebaseService.changeProfileImage(this.userId, this.currentAvatar)
    this.showNotification()
    setTimeout(() => {
      this.routerLink.navigate(['/login'])
    }, 2500);

  }

  // this.notification.emit(`<img src="imgs/icons/send.svg" alt="">`)

  showNotification() {
    this.notification.emit("Konto erfolgreich erstellt!")
  }
}
