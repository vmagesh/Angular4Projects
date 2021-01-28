import { Component, OnInit } from '@angular/core';
import { ConfigService } from '@app/core/config.service';

@Component({
  selector: 'app-side-nav',
  templateUrl: './side-nav.component.html',
  styleUrls: ['./side-nav.component.scss']
})
export class SideNavComponent implements OnInit {
  sideNavOpened: boolean = false;
  constructor() {}

  toggle() {
    console.log(this.sideNavOpened);
    this.sideNavOpened = !this.sideNavOpened;
  }
  ngOnInit() {}
}
