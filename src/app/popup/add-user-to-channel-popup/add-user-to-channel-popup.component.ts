import { 
  Component,
  EventEmitter,
  Output,
  Input
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChannelService } from '../../shared/services/channel.service';
import { UserService } from '../../shared/services/user.service';
/// DUMMY
import { TestService } from '../../shared/services/test.service';

@Component({
  selector: 'app-add-user-to-channel-popup',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './add-user-to-channel-popup.component.html',
  styleUrl: './add-user-to-channel-popup.component.scss'
})
export class AddUserToChannelPopupComponent {
  @Output() closePopupEvent = new EventEmitter<void>();
  @Input() display: boolean = false;

  constructor(public test: TestService) {}

  set showAddUserToChannelPopup(value: boolean) {
    this.display = value; 
  }

  addUserToChannel(userId: string) {
    this.test.setUserToAdd(userId);
    this.closePopup();
  }

  closePopup() {
    this.display = false; 
    this.closePopupEvent.emit();
  }
}