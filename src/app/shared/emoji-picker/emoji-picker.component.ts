import { PickerModule } from "@ctrl/ngx-emoji-mart";
import { CommonModule } from "@angular/common";
import { Component, ElementRef, Input, ViewChild } from "@angular/core";
import { Subject } from "rxjs";

@Component({
  selector: 'app-emoji-picker',
  standalone: true,
  imports: [PickerModule, CommonModule],
  templateUrl: './emoji-picker.component.html',
  styleUrl: './emoji-picker.component.scss'
})
export class EmojiPickerComponent {
  isOpened = false;
  @Input() emojiInput$: Subject<string> | undefined;
  @ViewChild("container") container: ElementRef<HTMLElement> | undefined;
  constructor() {}
  emojiSelected(event: any) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    this.emojiInput$?.next(event.emoji.native);
  }
  eventHandler = (event: Event) => {
    // Watching for outside clicks
    if (!this.container?.nativeElement.contains(event.target as Node)) {
      this.isOpened = false;
      window.removeEventListener("click", this.eventHandler);
    }
  };
  toggleEmojiPicker() {
    if (!this.container) {
      return;
    }
    this.isOpened = !this.isOpened;
    if (this.isOpened) {
      window.addEventListener("click", this.eventHandler);
    } else {
      window.removeEventListener("click", this.eventHandler);
    }
  }

}
