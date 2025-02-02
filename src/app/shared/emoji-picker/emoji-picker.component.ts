import { Component } from '@angular/core';
import { PickerModule } from "@ctrl/ngx-emoji-mart";

@Component({
  selector: 'app-emoji-picker',
  standalone: true,
  imports: [PickerModule],
  templateUrl: './emoji-picker.component.html',
  styleUrl: './emoji-picker.component.scss'
})
export class EmojiPickerComponent {

}
