import { Component, ElementRef, ViewChild } from '@angular/core';
import { StoreService } from '../store.service';

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.css'],
})
export class PlayerComponent {
  one_switch: boolean = true;
  two_switch: boolean = false;
  player_red: string = 'Player 1';
  player_blue: string = 'Player 2';
  switched: boolean = false;

  @ViewChild('in_p_one_red') in_p_one_red!: ElementRef;
  @ViewChild('in_p_two_blue') in_p_two_blue!: ElementRef;
  @ViewChild('in_p_two_red') in_p_two_red!: ElementRef;
  @ViewChild('in_p_one_blue') in_p_one_blue!: ElementRef;

  constructor(private service: StoreService) {}

  ngOnInit() {
    if (this.service.isAI) {
      this.player_red = 'You';
      this.player_blue = 'AI';
      this.service.aiPlayer = 'blue';
    }
  }

  switch() {
    if (this.one_switch && !this.two_switch) {
      this.one_switch = false;
      this.two_switch = true;
      this.player_red = this.in_p_one_blue.nativeElement.value;
      this.player_blue = this.in_p_one_red.nativeElement.value;
      this.switched = true;
      if (this.service.isAI) {
        this.service.aiPlayer = 'red';
      }
    } else {
      this.one_switch = true;
      this.two_switch = false;
      this.player_red = this.in_p_two_blue.nativeElement.value;
      this.player_blue = this.in_p_two_red.nativeElement.value;
      this.switched = false;
      if (this.service.isAI) {
        this.service.aiPlayer = 'blue';
      }
    }
  }

  start() {
    if (!this.switched) {
      this.player_red = this.in_p_one_red.nativeElement.value;
      this.player_blue = this.in_p_one_blue.nativeElement.value;
    } else {
      this.player_red = this.in_p_two_red.nativeElement.value;
      this.player_blue = this.in_p_two_blue.nativeElement.value;
    }
    this.service.player_red = this.player_red;
    this.service.player_blue = this.player_blue;
  }
}
