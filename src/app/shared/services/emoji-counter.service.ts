import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EmojiCounterService {

  clickedEmojis:string[] = [];

  emojiCount: Record<string, number> = {}; // Typisierung hier

  constructor() { }

  addEmoji(emoji: string) {
    this.clickedEmojis.push(emoji);

    // Zähle das Emoji
    if (this.emojiCount[emoji]) {
      this.emojiCount[emoji]++;
    } else {
      this.emojiCount[emoji] = 1;
    }

    console.log('count', this.emojiCount);
    console.log('clicked list', this.clickedEmojis)
}
}
