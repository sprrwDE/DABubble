import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ChannelDetailsService {
  editChannelName = false;
  editChannelDescription = false;

  resetEditStates() {
    this.editChannelName = false;
    this.editChannelDescription = false;
  }
}
