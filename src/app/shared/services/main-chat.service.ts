import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class MainChatService {
  showMainChat: boolean = false;

  currentEditMessageId: string = '';

  constructor() {}
}
