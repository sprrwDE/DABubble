import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class EmojiCounterService {
  clickedEmojis: string[] = [];

  emojiCount: Record<string, number> = {}; // Typisierung hier

  constructor() {}

  /// Message Model anpassen, dass es matched mit dem Obj. Arr.
  /// Current Message ID holen
  /// Bei add / remove direkt firebase
  /// Im DOM / html Rendern / Synchen
  /// Stylen (Auch floating box position relative)

  addEmoji(emoji: string) {
    this.clickedEmojis.push(emoji);

    // Zähle das Emoji
    if (this.emojiCount[emoji]) {
      this.emojiCount[emoji]++;
    } else {
      this.emojiCount[emoji] = 1;
    }

    console.log('count', this.emojiCount);
    console.log('clicked list', this.clickedEmojis);
  }

  removeEmoji(emoji: string) {
    if (this.emojiCount[emoji] && this.emojiCount[emoji] > 0) {
      this.emojiCount[emoji]--;

      const index = this.clickedEmojis.lastIndexOf(emoji);
      if (index !== -1) {
        this.clickedEmojis.splice(index, 1);
      }

      if (this.emojiCount[emoji] === 0) {
        delete this.emojiCount[emoji];
      }

      console.log('Count:', this.emojiCount);
      console.log('Clicked List:', this.clickedEmojis);
    }
  }
}
