import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class MainChatService {
  showMainChat: boolean = false;

  currentEditMessageId: string = '';

  renderReplyMessage = signal<boolean>(false);

  constructor() {}
}
