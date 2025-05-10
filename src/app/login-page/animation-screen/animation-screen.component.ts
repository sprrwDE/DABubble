import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { GlobalVariablesService } from '../../shared/services/global-variables.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-animation-screen',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './animation-screen.component.html',
  styleUrl: './animation-screen.component.scss',
})
export class AnimationScreenComponent implements OnInit {
  animation: boolean = true; // AUF TRUE STELLEN FÜR DIE ANIMATION


  constructor(public global: GlobalVariablesService){
  }

  ngOnInit(): void {}
}
