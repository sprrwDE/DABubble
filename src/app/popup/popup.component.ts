import { NgClass } from '@angular/common';
import { Component, Input } from '@angular/core';
import { PopupService } from '../shared/services/popup.service';

@Component({
  selector: 'app-popup',
  standalone: true,
  imports: [NgClass],
  templateUrl: './popup.component.html',
  styleUrl: './popup.component.scss',
})
export class PopupComponent {
  @Input() centerPopup: boolean = false;
  @Input() popupCorner: string = '';

  constructor(public popupService: PopupService) {}
}
