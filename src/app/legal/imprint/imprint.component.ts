import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { GlobalVariablesService } from '../../shared/services/global-variables.service';


@Component({
  selector: 'app-imprint',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './imprint.component.html',
  styleUrl: './imprint.component.scss'
})
export class ImprintComponent {
  constructor(public global: GlobalVariablesService) {}

}
