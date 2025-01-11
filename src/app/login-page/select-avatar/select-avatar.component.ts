import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';

@Component({
  selector: 'app-select-avatar',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './select-avatar.component.html',
  styleUrl: './select-avatar.component.scss'
})
export class SelectAvatarComponent implements OnInit {
  avatars: string[] = [
    'imgs/avatar/1av.svg',
    'imgs/avatar/2av.svg',
    'imgs/avatar/3av.svg',
    'imgs/avatar/4av.svg',
    'imgs/avatar/5av.svg',
    'imgs/avatar/6av.svg',
  ]

  userId!: string;

  constructor(private route: ActivatedRoute) {

  }
  ngOnInit(): void {
    this.userId = this.route.snapshot.paramMap.get('userId') || '';
    console.log('empfagne user id: ', this.userId)
  }

}
