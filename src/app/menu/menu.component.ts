import { Component } from '@angular/core';
import { StoreService } from '../store.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css'],
})
export class MenuComponent {
  constructor(private service: StoreService) {}

  activateAI() {
    this.service.isAI = true;
  }
}
