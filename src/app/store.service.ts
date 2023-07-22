import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class StoreService {
  public player_red: String = '';
  public player_blue: String = '';
  public isAI: boolean = false;
  public aiPlayer = '';
  public red_points = 0;
  public blue_points = 0;
  public winner: String = '';
  public win_color: String = '';

  constructor() {}
}
