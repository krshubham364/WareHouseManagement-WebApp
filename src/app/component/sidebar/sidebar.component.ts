import { Component } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import {MatListModule} from '@angular/material/list';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [MatListModule, RouterLink,MatIcon],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent {

}
