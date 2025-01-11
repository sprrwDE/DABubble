import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
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


  avatars: string[] = [
    'imgs/avatar/1av.svg',
    'imgs/avatar/2av.svg',
    'imgs/avatar/3av.svg',
    'imgs/avatar/4av.svg',
    'imgs/avatar/5av.svg',
    'imgs/avatar/6av.svg',
  ]

  userId!: string;

  constructor(private route: ActivatedRoute, private firebaseService: FirebaseService) {

  }
  ngOnInit(): void {
    this.userId = this.route.snapshot.paramMap.get('userId') || '';
    console.log('empfagne user id: ', this.userId)
  }

  selectAvatar(index:number) {
    this.currentAvatar = this.avatars[index]
    this.firebaseService.changeProfileImage(this.userId, this.avatars[index])
  }


/* test() {
    console.log(this.userId)
    this.firebaseService.getUser(this.userId)
  }  */
}
