import { Component, ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.css'],
})
export class PlayerComponent {
  one_switch: boolean = true;
  two_switch: boolean = false;
  player_one: string = 'Player 1';
  player_two: string = 'Player 2';

  @ViewChild('in_p_one_red') in_p_one_red!: ElementRef;
  @ViewChild('in_p_two_blue') in_p_two_blue!: ElementRef;
  @ViewChild('in_p_two_red') in_p_two_red!: ElementRef;
  @ViewChild('in_p_one_blue') in_p_one_blue!: ElementRef;

  switch() {
    if (this.one_switch && !this.two_switch) {
      this.one_switch = false;
      this.two_switch = true;
      this.player_one = this.in_p_one_red.nativeElement.value;
      this.player_two = this.in_p_two_blue.nativeElement.value;
    } else {
      this.one_switch = true;
      this.two_switch = false;
      this.player_two = this.in_p_two_red.nativeElement.value;
      this.player_one = this.in_p_one_blue.nativeElement.value;
    }
  }
}
