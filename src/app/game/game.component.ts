import { Component } from '@angular/core';
import { StoreService } from '../store.service';
import { Field } from './field';
import { EndscreenComponent } from '../endscreen/endscreen.component';
import { MatDialog } from '@angular/material/dialog';
import * as _ from 'lodash';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css'],
})
export class GameComponent {
  player_red: String = '';
  player_blue: String = '';
  board: Field[][] = [];
  aiBoard: Field[][] = [];
  points_red: number = 0;
  points_blue: number = 0;
  aiPoints_red: number = 0;
  aiPoints_blue: number = 0;
  aiPoints_full: number = 0;
  aiPoints_component_full = 0;
  difference: number = -100;
  current_player: String = 'red';
  isAIGame: boolean = false;
  isAIMove: boolean = false;
  startAIMove: boolean = true;
  aiPlayer: String = '';
  moves: number = 0;
  possibleAIMoves: number[][] = [];
  i_ai_position: number = 0;
  x_ai_position: number = 0;
  ai_index: number = 0;
  recursion_index: number = 0;

  constructor(private service: StoreService, public dialog: MatDialog) {}

  ngOnInit() {
    this.player_red = this.service.player_red;
    this.player_blue = this.service.player_blue;
    this.isAIGame = this.service.isAI;
    this.aiPlayer = this.service.aiPlayer;

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
      this.searchCaptured(i, y, false, false);
      this.moves += 1;
      this.calcPoints();
      this.current_player = 'blue';
    } else {
      this.board[i][y].setPiece('blue');
      this.searchCaptured(i, y, false, false);
      this.moves += 1;
      this.calcPoints();
      this.current_player = 'red';
    }

    if (this.isAIGame) {
      this.setAIMove();
    }
  }

  searchCaptured(i: number, y: number, freeMode: boolean, second: boolean) {
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
    if (freeMode == false && second == false) {
      this.searchForFree();
      for (let i = 0; i <= 4; i++) {
        for (let x = 0; x <= 4; x++) {
          if (
            this.board[i][x].piece == this.current_player &&
            this.board[i][x].captured == false
          ) {
            this.searchCaptured(i, x, false, true);
          }
        }
      }
      this.searchTurned();
    }
  }

  searchTurned() {
    for (let i = 0; i <= 4; i++) {
      for (let x = 0; x <= 4; x++) {
        if (
          this.board[i][x].piece != this.current_player &&
          this.board[i][x].piece != 'empty'
        ) {
          let turn_count: number = 0;
          for (let c = x; c >= 0; c--) {
            if (
              (this.board[i][c].piece == this.current_player &&
                this.board[i][c].captured == false) ||
              x == 0
            ) {
              turn_count += 1;
              break;
            }
          }
          for (let c = x; c <= 4; c++) {
            if (
              (this.board[i][c].piece == this.current_player &&
                this.board[i][c].captured == false) ||
              x == 4
            ) {
              turn_count += 1;
              break;
            }
          }
          for (let c = i; c >= 0; c--) {
            if (
              (this.board[c][x].piece == this.current_player &&
                this.board[c][x].captured == false) ||
              i == 0
            ) {
              turn_count += 1;
              break;
            }
          }
          for (let c = i; c <= 4; c++) {
            if (
              (this.board[c][x].piece == this.current_player &&
                this.board[c][x].captured == false) ||
              i == 4
            ) {
              turn_count += 1;
              break;
            }
          }
          if (turn_count == 4) {
            this.board[i][x].setTurned(true);
          }
        }
      }
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
          this.searchCaptured(i, x, true, false);
        }
      }
    }
  }

  calcPoints() {
    this.points_blue = 0;
    this.points_red = 0;
    this.aiPoints_blue = 0;
    this.aiPoints_red = 0;
    for (let i = 0; i <= 4; i++) {
      for (let x = 0; x <= 4; x++) {
        if (this.board[i][x].piece == 'red') {
          if (this.board[i][x].captured) {
            this.points_blue += 1;
          }
          if (this.board[i][x].turned) {
            this.points_blue += 1;
          }
        }
        if (this.board[i][x].piece == 'blue') {
          if (this.board[i][x].captured) {
            this.points_red += 1;
          }
          if (this.board[i][x].turned) {
            this.points_red += 1;
          }
        }
      }
    }
    if (this.moves == 18) {
      if (this.points_red > this.points_blue) {
        this.service.winner = this.player_red;
        this.service.win_color = 'red';
      } else if (this.points_blue > this.points_red) {
        this.service.winner = this.player_blue;
        this.service.win_color = 'blue';
      } else {
        this.service.winner = 'draw';
      }
      this.service.red_points = this.points_red;
      this.service.blue_points = this.points_blue;
      let endScreen = this.dialog.open(EndscreenComponent, {});
    }
  }

  setAIMove() {
    this.aiBoard = _.cloneDeep(this.board);
    this.possibleAIMoves = [];
    this.aiPoints_full = -100;
    this.aiPoints_component_full = -100;
    this.isAIMove = true;
    this.startAIMove = false;
    this.bestAIMove(0);
    this.bestAIMove(1);
    this.bestAIMove(2);
    this.isAIMove = false;
    let random = Math.floor(Math.random() * this.possibleAIMoves.length);
    console.log(this.possibleAIMoves);
    this.move(this.possibleAIMoves[random][0], this.possibleAIMoves[random][1]);
  }
  //fix it
  bestAIMove(aiIndex: number) {
    for (let i = 0; i <= 4; i++) {
      for (let x = 0; x <= 4; x++) {
        if (this.ai_index == 0) {
          this.i_ai_position = i;
          this.x_ai_position = x;
          this.aiBoard = _.cloneDeep(this.board);
        }
        if (this.aiBoard[i][x].piece == 'empty') {
          this.move(i, x);
          if (
            this.aiPlayer == 'red' &&
            this.current_player == 'red' &&
            aiIndex == 2
          ) {
            if (this.aiPoints_red - this.aiPoints_blue > this.aiPoints_full) {
              this.aiPoints_full = this.aiPoints_red - this.aiPoints_blue;
              if (
                this.aiPoints_full - this.aiPoints_component_full >
                this.difference
              ) {
                this.difference =
                  this.aiPoints_full - this.aiPoints_component_full;
                this.possibleAIMoves = [];
                this.possibleAIMoves.push([
                  this.i_ai_position,
                  this.x_ai_position,
                ]);
              }
              if (
                this.aiPoints_full - this.aiPoints_component_full ==
                this.difference
              ) {
                this.possibleAIMoves.push([
                  this.i_ai_position,
                  this.x_ai_position,
                ]);
              }
            }
          }
          if (this.aiPlayer == 'red' && this.current_player == 'blue') {
            if (
              this.aiPoints_blue - this.aiPoints_red >
              this.aiPoints_component_full
            ) {
              this.aiPoints_component_full =
                this.aiPoints_blue - this.aiPoints_red;
            }
          }
          if (
            this.aiPlayer == 'blue' &&
            this.current_player == 'blue' &&
            aiIndex == 2
          ) {
            console.log('test');
            if (this.aiPoints_blue - this.aiPoints_red > this.aiPoints_full) {
              this.aiPoints_full = this.aiPoints_blue - this.aiPoints_red;
              if (
                this.aiPoints_full - this.aiPoints_component_full >
                this.difference
              ) {
                this.difference =
                  this.aiPoints_full - this.aiPoints_component_full;
                this.possibleAIMoves = [];
                this.possibleAIMoves.push([
                  this.i_ai_position,
                  this.x_ai_position,
                ]);
              }
              if (
                this.aiPoints_full - this.aiPoints_component_full ==
                this.difference
              ) {
                this.possibleAIMoves.push([
                  this.i_ai_position,
                  this.x_ai_position,
                ]);
              }
            }
          }
          if (this.aiPlayer == 'blue' && this.current_player == 'red') {
            if (
              this.aiPoints_red - this.aiPoints_blue >
              this.aiPoints_component_full
            ) {
              this.aiPoints_component_full =
                this.aiPoints_red - this.aiPoints_blue;
            }
          }
        }

        //if (this.recursion_index <= 2) {
        if (this.current_player == 'red') {
          this.current_player = 'blue';
        } else {
          this.current_player = 'red';
        }
        //this.bestAIMove();
        //} else {
        //this.ai_index = 0;
        //}
      }
    }
  }
}
