import { NgClass } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [NgClass],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss',
})
export class ChatComponent {}
