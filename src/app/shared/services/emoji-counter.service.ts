import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class EmojiCounterService {
  //// Kann beides weg wenn man in Firebase handled
  clickedEmojis: string[] = [];
  emojiCountArray: { emoji: string; count: number }[] = []; // Array von Objekten

  constructor() {}

  /// Message Model anpassen, dass es matched mit dem Obj. Arr.
  /// Current Message ID holen
  /// Bei add / remove direkt firebase
  /// Im DOM / html Rendern / Synchen
  /// Stylen (Auch floating box position relative)

  addEmoji(emoji: string) {
    this.clickedEmojis.push(emoji);

    const existingEmoji = this.emojiCountArray.find(
      (item) => item.emoji === emoji
    );

    if (existingEmoji) {
      existingEmoji.count++;
    } else {
      this.emojiCountArray.push({ emoji, count: 1 });
    }

    console.log('Count:', this.emojiCountArray);
    console.log('Clicked List:', this.clickedEmojis);
  }

  removeEmoji(emoji: string) {
    const index = this.emojiCountArray.findIndex(
      (item) => item.emoji === emoji
    );

    if (index !== -1) {
      this.emojiCountArray[index].count--;

      const clickedIndex = this.clickedEmojis.lastIndexOf(emoji);
      if (clickedIndex !== -1) {
        this.clickedEmojis.splice(clickedIndex, 1);
      }

      if (this.emojiCountArray[index].count === 0) {
        this.emojiCountArray.splice(index, 1);
      }

      console.log('Count:', this.emojiCountArray);
      console.log('Clicked List:', this.clickedEmojis);
    }
  }

  resetList() {
    this.clickedEmojis = [];
    this.emojiCountArray = [];
    console.log('clicked', this.clickedEmojis)
    console.log('arr', this.emojiCountArray)
  }
}
