import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class StoreService {
  public player_red: String = '';
  public player_blue: String = '';
  public isAI: boolean = false;

  constructor() {}
}
