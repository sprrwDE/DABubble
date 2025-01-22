import { 
  Component,
  EventEmitter,
  Output,
  Input
} from '@angular/core';
import { ChannelService } from '../../shared/services/channel.service';
import { UserService } from '../../shared/services/user.service';
/// DUMMY
import { TestService } from '../../shared/services/test.service';

@Component({
  selector: 'app-add-user-to-channel-popup',
  standalone: true,
  imports: [],
  templateUrl: './add-user-to-channel-popup.component.html',
  styleUrl: './add-user-to-channel-popup.component.scss'
})
export class AddUserToChannelPopupComponent {
  @Output() closePopupEvent = new EventEmitter<void>();
  @Input() display: boolean = false; // `@Input()` damit der Wert von außen gesteuert werden kann

  constructor(public test: TestService) {}

  set showAddUserToChannelPopup(value: boolean) {
    this.display = value; 
  }

  closePopup() {
    this.display = false; 
    this.closePopupEvent.emit();
  }
}