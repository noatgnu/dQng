import { Injectable } from '@angular/core';
import {Timer} from "../classes/timer";

@Injectable({
  providedIn: 'root'
})
export class TimerService {
  timer: Timer = new Timer()
  constructor() { }
}
