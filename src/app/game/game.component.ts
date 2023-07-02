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
  isAI: boolean = false;

  constructor(private service: StoreService) {}

  ngOnInit() {
    this.player_red = this.service.player_red;
    this.player_blue = this.service.player_blue;
    this.isAI = this.service.isAI;

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
      this.searchCaptured(i, y, false);
      this.calcPoints();
      this.current_player = 'blue';
    } else {
      this.board[i][y].setPiece('blue');
      this.searchCaptured(i, y, false);
      this.calcPoints();
      this.current_player = 'red';
    }
  }

  searchCaptured(i: number, y: number, freeMode: boolean) {
    let player: String = this.current_player;
    if (freeMode) {
      if (this.current_player == 'red') {
        player = 'blue';
      }
      if (this.current_player == 'blue') {
        player = 'red';
      }
    }
    for (let x = y - 1; x >= 0; x--) {
      if (
        this.board[i][x].piece != player &&
        this.board[i][x].piece != 'empty'
      ) {
        for (let c = x; c >= 0; c--) {
          if (
            (this.board[i][c].piece == player &&
              this.board[i][c].captured == false) ||
            (player == 'blue' && i == 0) ||
            (player == 'red' && i == 4)
          ) {
            this.board[i][x].setCaptured(true);
          }
        }
      }
    }
    for (let x = y + 1; x <= 4; x++) {
      if (
        this.board[i][x].piece != player &&
        this.board[i][x].piece != 'empty'
      ) {
        for (let c = x; c <= 4; c++) {
          if (
            (this.board[i][c].piece == player &&
              this.board[i][c].captured == false) ||
            (player == 'red' && i == 0) ||
            (player == 'blue' && i == 4)
          ) {
            this.board[i][x].setCaptured(true);
          }
        }
      }
    }
    for (let x = i - 1; x >= 0; x--) {
      if (
        this.board[x][y].piece != player &&
        this.board[x][y].piece != 'empty'
      ) {
        for (let c = x; c >= 0; c--) {
          if (
            (this.board[c][y].piece == player &&
              this.board[c][y].captured == false) ||
            (player == 'red' && y == 0) ||
            (player == 'blue' && y == 4)
          ) {
            this.board[x][y].setCaptured(true);
          }
        }
      }
    }
    for (let x = i + 1; x <= 4; x++) {
      if (
        this.board[x][y].piece != player &&
        this.board[x][y].piece != 'empty'
      ) {
        for (let c = x; c <= 4; c++) {
          if (
            (this.board[c][y].piece == player &&
              this.board[c][y].captured == false) ||
            (player == 'blue' && y == 0) ||
            (player == 'red' && y == 4)
          ) {
            this.board[x][y].setCaptured(true);
          }
        }
      }
    }
    if (freeMode == false) {
      this.searchForFree();
    }
  }

  searchForFree() {
    for (let i = 0; i <= 4; i++) {
      for (let x = 0; x <= 4; x++) {
        if (this.board[i][x].piece == this.current_player) {
          this.board[i][x].setCaptured(false);
        }
      }
    }
    for (let i = 0; i <= 4; i++) {
      for (let x = 0; x <= 4; x++) {
        if (
          this.board[i][x].piece != this.current_player &&
          this.board[i][x].piece != 'empty' &&
          this.board[i][x].captured == false
        ) {
          this.searchCaptured(i, x, true);
        }
      }
    }
  }

  calcPoints() {
    this.points_blue = 0;
    this.points_red = 0;
    for (let i = 0; i <= 4; i++) {
      for (let x = 0; x <= 4; x++) {
        if (
          this.board[i][x].piece == 'red' &&
          this.board[i][x].captured == true
        ) {
          this.points_blue += 1;
        }
        if (
          this.board[i][x].piece == 'blue' &&
          this.board[i][x].captured == true
        ) {
          this.points_red += 1;
        }
      }
    }
  }
}
