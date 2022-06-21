import { Component, OnInit } from '@angular/core';
import {WebService} from "../services/web.service";
import {TimerService} from "../services/timer.service";

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss']
})
export class NavBarComponent implements OnInit {

  constructor(public web: WebService, public timer: TimerService) { }

  ngOnInit(): void {
  }

}
