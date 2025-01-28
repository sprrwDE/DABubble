import { 
  Component,
  EventEmitter,
  Output,
  Input
} from '@angular/core';
import { CommonModule } from '@angular/common';
/// DUMMY
import { AddUserService } from '../../shared/services/add-user.service';

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

  constructor(public addUserService: AddUserService) {}

  set showAddUserToChannelPopup(value: boolean) {
    this.display = value; 
  }

  addUserToChannel(userId: string) {
    this.addUserService.setUserToAdd(userId);
    this.closePopup();
  }

  closePopup() {
    this.display = false; 
    this.closePopupEvent.emit();
  }
}