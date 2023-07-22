import { Component } from '@angular/core';
import { StoreService } from '../store.service';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-endscreen',
  templateUrl: './endscreen.component.html',
  styleUrls: ['./endscreen.component.css'],
})
export class EndscreenComponent {
  winner: String = '';
  win_color: String = '';
  red_win: boolean = true;

  constructor(
    private service: StoreService,
    private dialog: MatDialogRef<EndscreenComponent>
  ) {}

  ngOnInit() {
    this.winner = this.service.winner;
    this.win_color = this.service.win_color;
    if (this.win_color == 'blue') {
      this.red_win = false;
    }
  }

  closeDialog() {
    this.dialog.close();
  }
}
