import {
  Component,
  EventEmitter,
  Output,
  Input,
  ElementRef,
  HostListener,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddUserService } from '../../shared/services/add-user.service';
import { GlobalVariablesService } from '../../shared/services/global-variables.service';

@Component({
  selector: 'app-add-user-to-channel-popup',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './add-user-to-channel-popup.component.html',
  styleUrl: './add-user-to-channel-popup.component.scss',
})
export class AddUserToChannelPopupComponent {
  @Output() closePopupEvent = new EventEmitter<boolean>();
  @Output() clearInputEvent = new EventEmitter<void>();
  @Input() display: boolean = false;

  constructor(
    public addUserService: AddUserService,
    public globalVariablesService: GlobalVariablesService,
    private elRef: ElementRef
  ) {}

  set showAddUserToChannelPopup(value: boolean) {
    this.display = value;
  }

  addUserToChannel(userId: string) {
    this.addUserService.setUserToAdd(userId);
    this.closePopup();
    this.clearInputEvent.emit();
  }

  closePopup() {
    this.display = false;
    this.closePopupEvent.emit(false);
    this.clearInputEvent.emit();
  }

  @HostListener('document:mousedown', ['$event'])
  onClickOutside(event: Event) {
    const target = event.target as HTMLElement;

    if (
      target.tagName.toLowerCase() === 'input' ||
      this.elRef.nativeElement.contains(target)
    ) {
      return;
    }

    if (this.display) {
      this.closePopup();
    }
  }

  addUserToList(id: string) {
    this.addUserService.setUserToAdd(id);
    this.clearInputEvent.emit();
    if (this.addUserService.filteredUsers.length === 0) {
      this.closePopup();
    }
  }
}
