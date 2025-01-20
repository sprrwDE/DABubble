import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { GlobalVariablesService } from '../../shared/services/global-variables.service';

@Component({
  selector: 'app-animation-screen',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './animation-screen.component.html',
  styleUrl: './animation-screen.component.scss',
})
export class AnimationScreenComponent implements OnInit {
  animation: boolean = true; // AUF TRUE STELLEN FÜR DIE ANIMATION
  isMobile!: boolean;

  constructor(private global: GlobalVariablesService){
    this.isMobile = this.global.isMobile
  }

  ngOnInit(): void {}
}
