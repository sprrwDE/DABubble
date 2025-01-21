import { 
  Component,
  EventEmitter,
  Output,
} from '@angular/core';
import { PopupService } from '../popup.service';
import { ChannelService } from '../../shared/services/channel.service';
import { UserService } from '../../shared/services/user.service';

@Component({
  selector: 'app-add-user-to-channel-popup',
  standalone: true,
  imports: [],
  templateUrl: './add-user-to-channel-popup.component.html',
  styleUrl: './add-user-to-channel-popup.component.scss'
})
export class AddUserToChannelPopupComponent {
  @Output() closePopupEvent = new EventEmitter<void>();

  constructor(
    public popupService: PopupService,
  ) {
      console.log('Popup Service Status beim Laden:', this.popupService.addUserToChannelPopup);
  }

  get showAddUserToChannelPopup() {
    return this.popupService.addUserToChannelPopup;
  }

  set showAddUserToChannelPopup(value: boolean) {
    this.popupService.addUserToChannelPopup = value;
  }

  closePopup() {
    this.closePopupEvent.emit();
  }

}
