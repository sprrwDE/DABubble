import { Component, Input } from '@angular/core';
import { CommonModule
 } from '@angular/common';

@Component({
  selector: 'app-emoji-hover-display',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './emoji-hover-display.component.html',
  styleUrl: './emoji-hover-display.component.scss'
})
export class EmojiHoverDisplayComponent {
  @Input() emoji!: string | null;
  @Input() likers: any[] = [];
  @Input() position!: { top: string; left: string };
  @Input() firstLike: string | undefined = ''
}
