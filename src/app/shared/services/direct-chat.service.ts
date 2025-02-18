import { inject, Injectable, signal, effect } from '@angular/core';
import {
  addDoc,
  collection,
  doc,
  Firestore,
  onSnapshot,
  updateDoc,
} from '@angular/fire/firestore';
import { Unsubscribe } from 'firebase/firestore';
import { DirectChat } from '../models/direct-chat.model';
import { Message } from '../models/message.model';
import { User } from '../models/user.model';
import { Reply } from '../models/reply.model';

@Injectable({
  providedIn: 'root',
})
export class DirectChatService {
  firestore = inject(Firestore);
  unsubAllDirectChats!: Unsubscribe;
  unsubMessages!: Unsubscribe;

  isDirectChat: boolean = false;

  allDirectChats: DirectChat[] = [];
  currentDirectChat = signal<DirectChat>(new DirectChat());
  currentDirectChatUser = signal<User>(new User());
  currentDirectChatIdTest: string = '';

  currentDirectChatId: string = '';
  currentDirectChatMessages: Message[] = [];
  currentDirectChatIdIsInitialized: boolean = false;

  constructor() {
    this.getAllDirectChats();

    effect(() => {
      this.currentDirectChatIdTest = this.currentDirectChat().id || '';
    });
  }

  getAllDirectChats() {
    try {
      this.unsubAllDirectChats = onSnapshot(
        collection(this.firestore, 'direct-chats'),
        (snapshot) => this.handleDirectChatsSnapshot(snapshot)
      );
    } catch (error) {
      console.error('Error fetching channels:', error);
    }
  }

  private handleDirectChatsSnapshot(snapshot: any) {
    this.allDirectChats = [];
    snapshot.forEach((item: any) => this.processDirectChat(item));
  }

  private processDirectChat(item: any) {
    const directChatData = { ...item.data(), id: item.id, messages: [] };
    const directChat = new DirectChat(directChatData);
    this.subscribeToDirectChatMessages(directChat, item.id);
  }

  private subscribeToDirectChatMessages(
    directChat: DirectChat,
    directChatId: string
  ) {
    this.unsubMessages = onSnapshot(
      collection(this.firestore, `direct-chats/${directChatId}/messages`),
      (snapshot) => this.handleMessagesSnapshot(snapshot, directChat)
    );
  }

  private handleMessagesSnapshot(snapshot: any, directChat: DirectChat) {
    const messages = this.createMessagesFromDocs(snapshot);
    this.setupRepliesSubscriptions(messages, directChat.id || '');
    this.updateDirectChat(directChat, messages);
  }

  private createMessagesFromDocs(snapshot: any): Message[] {
    const messages: Message[] = [];
    snapshot.forEach((doc: any) => {
      messages.push(this.createMessageFromDoc(doc));
    });
    return messages;
  }

  private createMessageFromDoc(doc: any): Message {
    return new Message({
      ...doc.data(),
      id: doc.id,
      replies: [],
    });
  }

  private setupRepliesSubscriptions(messages: Message[], directChatId: string) {
    messages.forEach((message) => {
      this.subscribeToMessageReplies(directChatId, message);
    });
  }

  private subscribeToMessageReplies(directChatId: string, message: Message) {
    onSnapshot(
      this.getRepliesCollectionRef(directChatId, message.id || ''),
      (snapshot) => this.handleRepliesSnapshot(snapshot, message)
    );
  }

  private getRepliesCollectionRef(directChatId: string, messageId: string) {
    return collection(
      this.firestore,
      `direct-chats/${directChatId}/messages/${messageId}/replies`
    );
  }

  private handleRepliesSnapshot(snapshot: any, message: Message) {
    message.replies = this.createRepliesFromDocs(snapshot).sort(
      (a, b) => a.timestamp - b.timestamp
    );
    this.updateCurrentDirectChat(
      this.currentDirectChat,
      this.currentDirectChatMessages
    );
  }

  private createRepliesFromDocs(snapshot: any): Reply[] {
    return snapshot.docs.map(
      (doc: any) => new Reply({ ...doc.data(), id: doc.id })
    );
  }

  private updateDirectChat(directChat: DirectChat, messages: Message[]) {
    directChat.messages = messages.sort((a, b) => a.timestamp - b.timestamp);
    this.updateDirectChatInList(directChat);
    this.updateCurrentDirectChat(directChat, messages);
  }

  private updateDirectChatInList(directChat: DirectChat) {
    const index = this.allDirectChats.findIndex(
      (ch) => ch.id === directChat.id
    );
    if (index >= 0) {
      this.allDirectChats[index] = directChat;
    } else {
      this.allDirectChats.push(directChat);
    }
  }

  private updateCurrentDirectChat(directChat: any, messages: Message[]) {
    this.initializeCurrentDirectChatIfNeeded();

    if (this.currentDirectChatId === directChat.id) {
      this.currentDirectChatMessages = messages;
      this.currentDirectChat.set(directChat);
    }
  }

  private initializeCurrentDirectChatIfNeeded() {
    if (
      !this.currentDirectChatIdIsInitialized &&
      this.allDirectChats.length > 0
    ) {
      this.currentDirectChatId = this.allDirectChats[0].id || '';
      this.currentDirectChatIdIsInitialized = true;
    }
  }

  // add

  async addDirectChat(data: any) {
    try {
      const docRef = await addDoc(
        collection(this.firestore, 'direct-chats'),
        data
      );
      this.currentDirectChatId = docRef.id;
      return docRef.id;
    } catch (error) {
      console.error('Fehler beim Erstellen des chats: ', error);
      return null;
    }
  }

  async editMessage(messageId: string, newMessage: string) {
    const messageRef = doc(
      this.firestore,
      'direct-chats',
      this.currentDirectChat().id || '',
      'messages',
      messageId
    );
    await updateDoc(messageRef, {
      message: newMessage,
    });
  }

  async editReply(messageId: string, replyId: string, newReply: string) {
    const replyRef = doc(
      this.firestore,
      'direct-chats',
      this.currentDirectChat().id || '',
      'messages',
      messageId,
      'replies',
      replyId
    );
    await updateDoc(replyRef, {
      message: newReply,
    });
  }

  async sendMessage(data: any) {
    try {
      const directChatRef = doc(
        this.firestore,
        'direct-chats',
        this.currentDirectChatId
      );
      await addDoc(collection(directChatRef, 'messages'), data);
    } catch (error) {
      console.error('Fehler beim Erstellen der Nachricht:', error);
    }
  }

  async sendReply(messageId: string, data: any) {
    try {
      const messageRef = doc(
        this.firestore,
        `direct-chats/${this.currentDirectChatId}/messages/${messageId}`
      );
      const replyRef = await addDoc(collection(messageRef, 'replies'), data);
      await updateDoc(replyRef, { id: replyRef.id });
    } catch (error) {
      console.error('Fehler beim Erstellen der Antwort:', error);
    }
  }

  // set

  ngOnDestroy(): void {
    this.unsubAllDirectChats();
    this.unsubMessages();
  }
}
