import { Component } from '@angular/core';
import { StoreService } from '../store.service';
import { Field } from './field';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css'],
})
export class GameComponent {
  player_red: String = '';
  player_blue: String = '';
  board: Field[][] = [];
  points_red: number = 0;
  points_blue: number = 0;
  current_player: String = 'red';

  constructor(private service: StoreService) {}

  ngOnInit() {
    this.player_red = this.service.player_red;
    this.player_blue = this.service.player_blue;

    for (let i = 0; i <= 4; i++) {
      let row: Field[] = [];
      for (let y = 0; y <= 4; y++) {
        let field: Field = new Field();
        field.setPiece('empty');
        row.push(field);
      }
      this.board.push(row);
    }
  }

  move(i: number, y: number) {
    if (this.current_player == 'red') {
      this.board[i][y].setPiece('red');
      this.current_player = 'blue';
    } else {
      this.board[i][y].setPiece('blue');
      this.current_player = 'red';
    }
  }
}
